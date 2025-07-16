import { Bot, session } from "grammy";

import i18n from "middlewares/i18n";
import commands from "middlewares/commands";
import checker from "middlewares/checker";
import menu from "middlewares/menu";
import parser from "middlewares/parser";

import type { BotContext } from "types/common";

const BOT_TOKEN = Bun.env.BOT_TOKEN as string;

const bot = new Bot<BotContext>(BOT_TOKEN);

bot.use(session({ initial: () => ({}) }));

bot.use(i18n);
bot.use(commands);
bot.use(checker);
bot.use(menu);
bot.use(parser);

bot.start({
  onStart: () => {
    console.log("Bot is running...");
  },
});
