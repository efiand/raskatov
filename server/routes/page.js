import { database } from "#server/lib/db.js";
import { html, sql } from "#server/lib/mark-template.js";

const sqlQuery = database.prepare(sql`
	SELECT
		id as rawId,
		heading,
		content,
		writedAt,
		STRFTIME('%d.%m.%Y', writedAt ) AS formattedWritedAt,
		STRFTIME('%Y', writedAt ) AS year
	FROM pages WHERE id = ?;
`);
const sqlMaxQuery = database.prepare(sql`SELECT MAX(id) AS length FROM pages;`);

export const pageRoute = {
	/** @type {RouteMethod} */
	GET({ pathname }) {
		const { content, formattedWritedAt, heading, rawId, writedAt, year } =
			sqlQuery.get(Number(pathname.slice(1))) || {};
		const id = Number(rawId);
		const length = Number(sqlMaxQuery.get()?.length);

		const pageTemplate = content
			? html`
					<div class="poem">
						${content}
						<time class="separated" datetime="${writedAt}">${formattedWritedAt}</time>
					</div>

					<p class="copyright">© Андрей Раскатов, ${year}</p>
				`
			: "";

		return {
			page: {
				description: `Стихотворение Андрея Раскатова «${heading}».`,
				heading: heading ? `${heading}` : "Страница не найдена",
				next: id === length ? "" : `/${id + 1}`,
				pageTemplate,
				prev: id === 1 ? "" : `/${id - 1}`,
			},
		};
	},
};
