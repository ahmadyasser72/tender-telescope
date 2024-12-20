import type { Difficulty, Question } from "./types";

import { getCollection } from "astro:content";
import {
  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,
} from "astro:env/server";

import { Redis } from "@upstash/redis";

export const stripResponse = (response: Response) =>
  response.blob().then((blob) => new Response(blob));

export const getAnswers = async () => {
  const answerMap = new Map<Difficulty, Set<string>>();

  const entries = await getCollection("answers");
  for (const { id: difficulty, data } of entries) {
    const answers = new Set(data.items);

    const questions = (await getQuestions()).flatMap(([_, items]) =>
      items.filter((it) => it.difficulty === difficulty),
    );
    for (const { translation } of questions) answers.add(translation);

    answerMap.set(difficulty, answers);
  }

  return answerMap;
};

export const getQuestions = async () => {
  const entries = await getCollection("questions");
  return entries.map(({ data, id }): [typeof id, Question[]] => [
    id,
    data.items.map((it, idx) => ({
      ...it,
      language: id,
      code: data.code,
      id: idx,
    })),
  ]);
};

export const upstash = {
  redis:
    UPSTASH_REDIS_REST_URL !== undefined &&
    UPSTASH_REDIS_REST_TOKEN !== undefined
      ? new Redis({
          url: UPSTASH_REDIS_REST_URL,
          token: UPSTASH_REDIS_REST_TOKEN,
          automaticDeserialization: false,
          enableTelemetry: false,
        })
      : undefined,
  get: async (key: string, init: () => Promise<Response>) => {
    if (upstash.redis === undefined) return init();

    const base64 = await upstash.redis.get<string>(key);
    if (base64) {
      const binaryString = atob(base64);

      const buffer = new ArrayBuffer(binaryString.length);
      const uint8Array = new Uint8Array(buffer);

      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }

      return new Response(uint8Array);
    } else {
      const response = await init();
      await upstash.set(key, response.clone());
      return response;
    }
  },
  set: async (key: string, response: Response) => {
    if (upstash.redis === undefined) return;

    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    await upstash.redis.set(key, btoa(binary), { ex: 60 * 60 * 24 });
  },
};
