import { BASE_URL } from "#server/constants.js";
import { database } from "#server/lib/db.js";
import { sql, xml } from "#server/lib/mark-template.js";

const sqlQuery = database.prepare(sql`
	SELECT
		CONCAT('/', id, '/') AS loc,
		STRFTIME('%Y-%m-%dT%H:%M:%S+03:00', updatedAt) AS lastmod
	FROM pages ORDER by lastmod DESC;
`);

/** @type {(lastmod: string | null) => Changefreq} */
function getChangefreq(lastmod) {
	if (!lastmod) {
		return undefined;
	}

	const daysAfterMod = Math.floor((Date.now() - new Date(lastmod).valueOf()) / 86_400_000);

	if (daysAfterMod < 1) {
		return "daily";
	}
	if (daysAfterMod < 7) {
		return "weekly";
	}
	if (daysAfterMod < 30) {
		return "monthly";
	}
	if (daysAfterMod < 365) {
		return "yearly";
	}
	return undefined;
}

/** @type {(data: DbItem) => string} */
function renderPage({ lastmod, loc }) {
	const changefreq = getChangefreq(lastmod ? `${lastmod}` : null);

	return xml`
		<url>
			<loc>${BASE_URL}${loc}</loc>
			${changefreq ? xml`<changefreq>${changefreq}</changefreq>` : ""}
			${lastmod ? xml`<lastmod>${lastmod}</lastmod>` : ""}
		</url>
	`;
}

export const sitemapXmlRoute = {
	/** @type {RouteMethod} */
	GET() {
		const pages = sqlQuery.all();

		pages.push({ loc: "/" }, { loc: "/turbo.rss", lastmod: pages[0].lastmod });

		return {
			contentType: "application/xml",
			template: xml`
				<?xml version="1.0" encoding="UTF-8" ?>
				<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="https://www.w3.org/1999/xhtml">
					${pages.map(renderPage).join("")}
				</urlset>
			`,
		};
	},
};
