import { Composer } from "grammy";

import type { BotContext } from "types/common";

const checker = new Composer<BotContext>();

checker.on("message:text", (ctx, next) => {
  const vlessRegex = /^vless:\/\/[^@]+@[^:]+:\d+/;
  const trojanRegex = /^trojan:\/\/[^@]+@[^:]+:\d+/;
  const vmessRegex = /^vmess:\/\/[A-Za-z0-9+/=]+$/;

  const url = ctx.message.text.trim();

  const type = vlessRegex.test(url)
    ? "vless"
    : false || vmessRegex.test(url)
    ? "vmess"
    : false || trojanRegex.test(url)
    ? "trojan"
    : false;

  if (type === false) {
    return ctx.reply(ctx.t("unsupported-protocol"));
  }

  ctx.session = { type, url };

  return next();
});

export default checker;
