import { createI18n } from "vue-i18n/dist/vue-i18n.cjs.js";

export function loadLanguages() {
  const context = import.meta.globEager("./languages/*.ts");

  const languages: AnyObject = {};

  const langs = Object.keys(context);
  for (const key of langs) {
    if (key === "./index.ts") return;
    const lang = context[key].lang;
    const name = key.replace(/(\.\/languages\/|\.ts)/g, "");
    languages[name] = lang;
  }

  return languages;
}

export function i18nt(key: string) {
  return i18n.global.t(key);
}

export const i18n = createI18n({
  locale: "zh-cn",
  fallbackLocale: "zh-cn",
  messages: loadLanguages(),
});

export function setLanguage(locale: string) {
  i18n.global.locale = locale;
}
