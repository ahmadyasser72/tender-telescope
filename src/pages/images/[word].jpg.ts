import imagePlaceholder from "$lib/assets/placeholder/image.jpg";
import { base64, randomNumber } from "$lib/utils";
import { getQuestions } from "$lib/utils.content";

import type { APIRoute, GetStaticPaths } from "astro";
import { PIXABAY_API_KEY } from "astro:env/server";

export const prerender = true;

export const getStaticPaths = (async () => {
  const indonesianWords = new Set<string>();
  const imageLookup = new Map<string, string>();
  const englishWordLookup = new Map<string, string>();
  const allQuestions = await getQuestions();
  for (const {
    language,
    translation: indonesianWord,
    image,
    sourceWord,
  } of allQuestions) {
    if (language === "inggris") {
      englishWordLookup.set(indonesianWord, sourceWord);

      if (image) imageLookup.set(indonesianWord, image.src);
    }

    indonesianWords.add(indonesianWord);
  }

  return [...englishWordLookup].map(([indonesianWord, englishWord]) => ({
    params: { word: base64.encode(indonesianWord) },
    props: {
      pixabayQuery: englishWord,
      image: imageLookup.get(indonesianWord),
    },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async (context) => {
  if (import.meta.env.DEV) {
    return context.redirect(imagePlaceholder.src);
  }

  const { pixabayQuery, image } = context.props;
  if (image !== undefined) return context.redirect(image);

  const pixabayUrl = new URL("https://pixabay.com/api");
  pixabayUrl.search = new URLSearchParams({
    key: PIXABAY_API_KEY,
    q: pixabayQuery,
    image_type: "photo",
    orientation: "horizontal",
    per_page: "16",
  }).toString();

  const response = await fetch(pixabayUrl);
  const json: PixabayResponse = await response.json();

  const { hits: items } = json;
  const item = items[randomNumber(0, items.length - 1)];

  return fetch(item.webformatURL);
};

/**
 * example response:
 *
 * ```json
 * {
	"total": 4692,
	"totalHits": 500,
	"hits": [
	    {
	        "id": 195893,
	        "pageURL": "https://pixabay.com/en/blossom-bloom-flower-195893/",
	        "type": "photo",
	        "tags": "blossom, bloom, flower",
	        "previewURL": "https://cdn.pixabay.com/photo/2013/10/15/09/12/flower-195893_150.jpg"
	        "previewWidth": 150,
	        "previewHeight": 84,
	        "webformatURL": "https://pixabay.com/get/35bbf209e13e39d2_640.jpg",
	        "webformatWidth": 640,
	        "webformatHeight": 360,
	        "largeImageURL": "https://pixabay.com/get/ed6a99fd0a76647_1280.jpg",
	        "fullHDURL": "https://pixabay.com/get/ed6a9369fd0a76647_1920.jpg",
	        "imageURL": "https://pixabay.com/get/ed6a9364a9fd0a76647.jpg",
	        "imageWidth": 4000,
	        "imageHeight": 2250,
	        "imageSize": 4731420,
	        "views": 7671,
	        "downloads": 6439,
	        "likes": 5,
	        "comments": 2,
	        "user_id": 48777,
	        "user": "Josch13",
	        "userImageURL": "https://cdn.pixabay.com/user/2013/11/05/02-10-23-764_250x250.jpg",
	    },
	    {
	        "id": 73424,
	        ...
	    },
	    ...
	]
	}
  ```
 */
interface PixabayResponse {
  hits: Array<{ webformatURL: string }>;
}
