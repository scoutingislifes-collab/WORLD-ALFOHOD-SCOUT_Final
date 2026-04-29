import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { isRTL, LANGUAGES } from "@/lib/i18n";

interface SeoHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

const SITE_NAME = "WORLD ALFOHOD SCOUT";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, hreflang: string, href: string) {
  let el = document.head.querySelector(
    `link[rel="${rel}"][hreflang="${hreflang}"]`
  ) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    el.setAttribute("hreflang", hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function SeoHead({
  title,
  description,
  image,
  type = "website",
  noIndex = false,
}: SeoHeadProps) {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const lang = i18n.resolvedLanguage || i18n.language || "ar";
    const dir = isRTL(lang) ? "rtl" : "ltr";
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", dir);

    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : t("seo.defaultTitle", "WORLD ALFOHOD SCOUT — عالم الفهود");
    document.title = fullTitle;

    const desc =
      description ||
      t(
        "seo.defaultDescription",
        "Inclusive global scouting platform — academy, games, events, store, and community in 20 languages."
      );

    setMeta("name", "description", desc);
    setMeta("name", "robots", noIndex ? "noindex,nofollow" : "index,follow");
    setMeta("name", "theme-color",
      document.documentElement.classList.contains("dark") ? "#0d2818" : "#0a5132"
    );

    // Open Graph
    setMeta("property", "og:type", type);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:locale", lang);
    if (image) setMeta("property", "og:image", image);

    // Twitter
    setMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", desc);
    if (image) setMeta("name", "twitter:image", image);

    // hreflang for all 20 supported languages
    const url = window.location.href.split("?")[0];
    LANGUAGES.forEach(l => setLink("alternate", l.code, url));
    setLink("alternate", "x-default", url);
  }, [title, description, image, type, noIndex, i18n.resolvedLanguage, i18n.language, t]);

  return null;
}
