import { Composer } from "grammy";
import { I18n } from "@grammyjs/i18n";

import { join } from "path";

import { rootPath } from "helper/utils";

import type { BotContext } from "types/common";

const i18n = new Composer<BotContext>();

i18n.use(
  new I18n<BotContext>({
    defaultLocale: "en",
    directory: join(rootPath(), "src", "locales"),
  })
);

i18n.use((ctx, next) => {
  const originalReply = ctx.reply.bind(ctx);
  ctx.reply = (text, other) => {
    return originalReply(text, {
      parse_mode: "HTML",
      link_preview_options: { is_disabled: true },
      ...other,
    });
  };
  next();
});

export default i18n;
