import { Composer, InputFile } from "grammy";

import type { BotContext } from "types/common";

import ProxyAdapter from "middlewares/services/proxy-adapter";
import TemplateAdapter from "./services/template-adapter";

import { generateTag } from "helper/utils";

const parser = new Composer<BotContext>();

parser.on("callback_query:data", async (ctx) => {
  const data = ctx.callbackQuery.data;
  let proxy: ProxyAdapter;

  try {
    proxy = new ProxyAdapter(ctx.session.type!, ctx.session.url!);
  } catch (error) {
    const err = error as Error;
    return ctx.reply(ctx.t("internal-error-message", { err: err.message }));
  }

  const singboxConfig = new TemplateAdapter(proxy, data).export();
  ctx.session.buffer = Buffer.from(singboxConfig, "utf-8");

  const tag = generateTag();
  await ctx.replyWithDocument(new InputFile(ctx.session.buffer!, `@toSingBox-${tag}-${data}.json`), {
    caption: ctx.t("singbox-config-file-caption"),
  });
  ctx.deleteMessage();
});

export default parser;
