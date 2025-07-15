import { Composer } from "grammy";

import type { BotContext } from "types/common";

const commands = new Composer<BotContext>();

commands.use((ctx, next) => {
  const originalReply = ctx.reply.bind(ctx);
  ctx.reply = (text) => {
    return originalReply(text, {
      parse_mode: "HTML",
      link_preview_options: { is_disabled: true },
    });
  };
  next();
});

commands.command("start", (ctx) => {
  ctx.reply(ctx.t("welcome"));
});

commands.command("help", (ctx) => {
  ctx.reply(ctx.t("guide"));
});

export default commands;
