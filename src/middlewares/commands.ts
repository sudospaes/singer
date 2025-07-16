import { Composer } from "grammy";

import type { BotContext } from "types/common";

const commands = new Composer<BotContext>();

commands.command("start", (ctx) => {
  ctx.reply(ctx.t("welcome"));
});

commands.command("help", (ctx) => {
  ctx.reply(ctx.t("guide"));
});

export default commands;
