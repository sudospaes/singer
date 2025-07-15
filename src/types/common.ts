import type { Context, SessionFlavor } from "grammy";
import type { I18nFlavor } from "@grammyjs/i18n";

export type BotContext = Context & I18nFlavor & SessionFlavor<SessionData>;

interface SessionData {
  type?: "vless" | "vmess" | "trojan";
  url?: string;
}
