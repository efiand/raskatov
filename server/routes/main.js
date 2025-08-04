import { PROJECT_DESCRIPTION } from "#server/constants.js";
import { database } from "#server/lib/db.js";
import { html, sql } from "#server/lib/mark-template.js";

const sqlQuery = database.prepare(sql`SELECT id, heading FROM pages ORDER BY id;`);
const sqlMaxQuery = database.prepare(sql`SELECT MAX(id) AS length FROM pages;`);

/** @type {(page: DbItem, ampPrefix: string) => string} */
function renderItem({ heading, id }, ampPrefix) {
	return html`
		<li class="toc__item">
			<a class="toc__link" href="/raskatov${ampPrefix}/${id}/">${heading}</a>
		</li>
	`;
}

export const mainRoute = {
	/** @type {RouteMethod} */
	GET({ isAmp }) {
		const pagesTemplate = sqlQuery
			.all()
			.map((page) => renderItem(page, isAmp ? `/amp` : ""))
			.join("");

		return {
			page: {
				description: PROJECT_DESCRIPTION,
				heading: "Содержание",
				next: "/1",
				pageTemplate: html`
					<ol class="toc">${pagesTemplate}</ol>

					<p class="copyright">© <a href="https://efiand.ru">efiand</a>, разработка сайта, 2025</p>
				`,
				prev: `/${sqlMaxQuery.get()?.length}`,
			},
		};
	},
};
