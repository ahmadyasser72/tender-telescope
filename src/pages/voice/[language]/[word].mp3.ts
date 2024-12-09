import ttsPlaceholder from "$lib/assets/placeholder/tts.mp3";
import { randomNumber } from "$lib/utils";
import { getQuestions, stripResponse } from "$lib/utils.server";

import type { APIRoute, GetStaticPaths } from "astro";
import { VOICE_RSS_API_KEY } from "astro:env/server";

export const getStaticPaths = (async () => {
  const allQuestions = (await getQuestions()).flatMap(([_, items]) => items);

  return allQuestions.map(({ language, sourceWord, code }) => ({
    params: { language, word: sourceWord },
    props: { languageCode: code },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async (context) => {
  const { word } = context.params;
  if (import.meta.env.DEV) {
    return context.redirect(ttsPlaceholder);
  }

  const { languageCode } = context.props;

  const urls = [
    ttsGoogleTranslate(languageCode, word!),
    ...ttsSimplyTranslate(languageCode, word!),
  ];

  // coba download tts google translate terlebih dahulu, sekaligus
  // beberapa instances simplytranslate (google translate proxy), ....
  while (urls.length > 0) {
    try {
      const url = urls.splice(randomNumber(0, urls.length - 1), 1)[0];
      const response = await fetch(url);
      if (response.ok) return stripResponse(response);
    } catch {
      // coba yang lain bila timeout
      continue;
    }
  }

  // kalau gagal baru gunakan VoiceRSS,
  // ini karena kualitas TTS google translate lebih bagus dan
  // VoiceRSS gratisan hanya bisa maksimal 350 requests per harinya
  return fetch(ttsVoiceRSS(languageCode, word!)).then(stripResponse);
};

const ttsGoogleTranslate = (code: string, text: string) => {
  // ref: https://codeberg.org/ManeraKai/simplytranslate/src/branch/main/engines/google.go#L84
  const url = new URL("https://translate.google.com/translate_tts");
  url.search = new URLSearchParams({
    tl: code.slice(0, 2),
    q: text,
    client: "tw-ob",
  }).toString();

  return url;
};

// simplytranslate is a google translate proxy
const ttsSimplyTranslate = (code: string, text: string) => {
  // https://codeberg.org/ManeraKai/simplytranslate/raw/branch/main/instances.json
  const instances = [
    "https://simplytranslate.org",
    "https://t.opnxng.com",
    "https://st.adast.dk",
    "https://simplytranslate.ducks.party",
    "https://simplytranslate.aketawi.space",
  ];

  return instances.map((instance) => {
    const url = new URL(instance);
    url.pathname = "/api/tts";
    url.search = new URLSearchParams({
      lang: code.slice(0, 2),
      text,
    }).toString();

    return url;
  });
};

// ref: https://voicerss.org/api/
const ttsVoiceRSS = (code: string, text: string) => {
  const url = new URL("https://api.voicerss.org");
  url.search = new URLSearchParams({
    key: VOICE_RSS_API_KEY,
    src: text,
    // The textual content language
    hl: code,
    // The speech rate (speed)
    r: "-3",
    // The speech audio codec
    c: "MP3",
  }).toString();

  return url;
};
