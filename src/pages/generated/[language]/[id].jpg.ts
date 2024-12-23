import type { Question } from "$lib/types";
import { randomNumber } from "$lib/utils";
import { getQuestions, stripResponse, upstash } from "$lib/utils.server";

import type { APIRoute, GetStaticPaths } from "astro";
import { PIXABAY_API_KEY } from "astro:env/server";

type Props = Pick<Question, "imageQuery" | "language">;

export const getStaticPaths = (async () => {
  const allQuestions = (await getQuestions()).flatMap(([_, items]) => items);

  return allQuestions
    .filter(({ imageQuery }) => typeof imageQuery === "string")
    .map(({ id, language, imageQuery }) => ({
      params: { language, id },
      props: { imageQuery, language } satisfies Props,
    }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async (context) => {
  if (import.meta.env.DEV) {
    return import("$lib/assets/placeholder/image.jpg")
      .then((image) => image.default.src)
      .then(context.redirect);
  }

  const { id } = context.params;
  const { imageQuery, language } = context.props as Props;

  return upstash.get(`${language}-${id}-pixabay-${imageQuery}`, async () => {
    const items = await fetchPixabay(imageQuery!.toLowerCase());
    const randomItem = items.splice(randomNumber(0, items.length - 1), 1)[0];

    const url = compressWithWsrv(randomItem.webformatURL);
    return fetch(url).then(stripResponse);
  });
};

interface PixabayResponse {
  hits: Array<{ webformatURL: string }>;
}

const pixabayResponses = new Map<string, PixabayResponse["hits"]>();
const fetchPixabay = async (imageQuery: string) => {
  const cache = pixabayResponses.get(imageQuery);
  if (cache !== undefined && cache.length > 0) return cache;

  const pixabayUrl = new URL("https://pixabay.com/api");
  pixabayUrl.search = new URLSearchParams({
    key: PIXABAY_API_KEY,
    q: imageQuery,
    image_type: "photo",
    orientation: "horizontal",
    per_page: "16",
  }).toString();

  const response = await fetch(pixabayUrl);
  const { hits: items }: PixabayResponse = await response.json();
  pixabayResponses.set(imageQuery, items);

  return items;
};

const compressWithWsrv = (url: string) => {
  const wsrv = new URL("https://wsrv.nl/");
  wsrv.search = new URLSearchParams({
    url,
    fit: "cover",
    output: "webp",
    h: "160", // Height
    q: "50", // Quality
  }).toString();

  return wsrv;
};
