import type { APIRoute } from "astro";
import { actions } from "astro:actions";

export const GET: APIRoute = async (context) => {
  const { level: levelString } = context.params;
  const level = Number(levelString);
  if (Number.isNaN(level)) return context.redirect("/404");

  const { data: preferences, error } = await context.callAction(
    actions.game.getPreferences,
    undefined,
  );

  if (preferences === undefined && error !== undefined)
    return context.redirect("/404");

  const question = await context.callAction(actions.questions.get.orThrow, {
    index: level,
    ...preferences,
  });

  return context.redirect(`/images/${question.translation}.jpg`);
};
