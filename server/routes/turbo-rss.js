import { BASE_URL, PROJECT_DESCRIPTION, PROJECT_TITLE } from "#server/constants.js";
import { database } from "#server/lib/db.js";
import { html, sql, xml } from "#server/lib/mark-template.js";

const sqlQuery = database.prepare(sql`
	SELECT id AS link, heading, content FROM pages ORDER BY link;
`);

/** @type {(page: DbItem) => string} */
function renderTurboPage({ content, heading, link }) {
	const data = html`
		<header>
			<h1>${heading}</h1>
		</header>
		${content}
	`;

	return xml`
		<item turbo="true">
			<turbo:extendedHtml>true</turbo:extendedHtml>
			<link>${BASE_URL}/${link}/</link>
			<turbo:content><![CDATA[${data}]]></turbo:content>
			<pubDate>Mon, 10 Mar 2025 19:00:00 +0300</pubDate>
		</item>
	`;
}

export const turboRssRoute = {
	/** @type {RouteMethod} */
	GET() {
		const pages = sqlQuery.all();

		return {
			contentType: "application/xml",
			template: xml`
				<?xml version="1.0" encoding="UTF-8" ?>
				<rss xmlns:yandex="http://news.yandex.ru" xmlns:media="http://search.yahoo.com/mrss/" xmlns:turbo="http://turbo.yandex.ru" version="2.0">
					<channel>
						<title>${PROJECT_TITLE}</title>
						<description>${PROJECT_DESCRIPTION}</description>
						<link>${BASE_URL}/</link>
						<language>ru</language>
						${pages.map(renderTurboPage).join("")}
					</channel>
				</rss>
			`,
		};
	},
};
