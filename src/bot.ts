import { Bot } from "grammy";

const BOT_TOKEN = Bun.env.BOT_TOKEN as string;

const bot = new Bot(BOT_TOKEN);

bot.start({
  onStart: () => {
    console.log("Bot is running...");
  },
});
