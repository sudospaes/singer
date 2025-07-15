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

export default i18n;
