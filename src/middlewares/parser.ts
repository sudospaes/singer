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
    ctx.deleteMessage();
    const err = error as Error;
    return ctx.reply(ctx.t("internal-error-message", { err: err.message }));
  }

  const singboxConfig = new TemplateAdapter(proxy, data);
  const buffer = Buffer.from(singboxConfig.export(), "utf-8");

  const fileName = `@toSingBoxBot-${generateTag()}-${data}.json`;
  await ctx.replyWithDocument(new InputFile(buffer, fileName), {
    caption: ctx.t("singbox-config-file-caption"),
  });
  ctx.deleteMessage();
});

export default parser;
