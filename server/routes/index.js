import { mainRoute } from "#server/routes/main.js";
import { pageRoute } from "#server/routes/page.js";
import { sitemapXmlRoute } from "#server/routes/sitemap-xml.js";
import { turboRssRoute } from "#server/routes/turbo-rss.js";

/** @type {{ [name: string]: Route }} */
export const routes = {
	"/": mainRoute,
	"/:page": pageRoute,
	"/sitemap.xml": sitemapXmlRoute,
	"/turbo.rss": turboRssRoute,
};
