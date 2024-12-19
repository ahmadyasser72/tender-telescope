import type { Question } from "$lib/types";
import { randomNumber } from "$lib/utils";
import { getQuestions, stripResponse } from "$lib/utils.server";

import type { APIRoute, GetStaticPaths } from "astro";
import { PIXABAY_API_KEY } from "astro:env/server";

type Props = Pick<Question, "imageQuery">;

export const getStaticPaths = (async () => {
  const allQuestions = (await getQuestions()).flatMap(([_, items]) => items);

  return allQuestions
    .filter(({ imageQuery }) => typeof imageQuery === "string")
    .map(({ id, language, imageQuery }) => ({
      params: { language, id },
      props: { imageQuery } satisfies Props,
    }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async (context) => {
  if (import.meta.env.DEV) {
    return import("$lib/assets/placeholder/image.jpg")
      .then((image) => image.default.src)
      .then(context.redirect);
  }

  const { imageQuery } = context.props as Props;

  const items = await fetchPixabay(imageQuery!.toLowerCase());
  const randomItem = items.splice(randomNumber(0, items.length - 1), 1)[0];

  return fetch(randomItem.webformatURL).then(stripResponse);
};

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
