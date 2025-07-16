import { Composer, InlineKeyboard } from "grammy";

import type { BotContext } from "types/common";

const menu = new Composer<BotContext>();

menu.on("message:text", async (ctx) => {
  const keyboard = new InlineKeyboard();

  keyboard.text(ctx.t("ir-direct"), "ir-direct").row();
  keyboard.text(ctx.t("ch-direct"), "ch-direct").row();
  keyboard.text(ctx.t("no-direct"), "no-direct").row();

  ctx.reply(ctx.t("menu-message"), { reply_markup: keyboard });
});

export default menu;
