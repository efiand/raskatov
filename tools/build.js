import { access, mkdir, writeFile } from "node:fs/promises";
import { baseLocalUrl } from "#server/constants.js";
import { createApp } from "#server/lib/app.js";
import { getPages } from "#server/lib/pages.js";

const server = createApp();
const pages = getPages();

await Promise.all(
	[...pages, ...pages.map((page) => (page === "/" ? "/amp" : `/amp${page}`)), "/sitemap.xml", "/turbo.rss"].map(
		async (url) => {
			const markup = await fetch(`${baseLocalUrl}${url}`).then((res) => res.text());

			if (url.includes(".")) {
				await writeFile(`./public${url}`, markup);
			} else if (url === "/") {
				await writeFile("./public/index.html", markup);
			} else {
				const dir = `./public${url}`;
				try {
					await access(dir);
				} catch {
					await mkdir(dir, { recursive: true });
				}
				await writeFile(`${dir}/index.html`, markup);
			}
			console.info(`Страница ${url} сгенерирована.`);
		},
	),
);

server.close();
