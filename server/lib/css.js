import { readFile } from "node:fs/promises";
import { ALL_STYLESHEETS } from "#server/constants.js";

/** @type {Record<string, string>} */
const cache = {};

/** @type {(stylesheets: Stylesheet[]) => Promise<string>} */
export async function getCss() {
	/** @type {string[]} */
	await Promise.all(
		ALL_STYLESHEETS.map(async ({ name }) => {
			if (!cache[name]) {
				try {
					cache[name] = await readFile(`./public/css/${name}.css`, "utf-8");
				} catch (error) {
					cache[name] = `/* ${error} *'`;
				}
			}
		}),
	);

	return ALL_STYLESHEETS.map(({ media, name }) => {
		if (cache[name] && media) {
			return `@media ${media} {${cache[name]}}`;
		}
		return cache[name];
	}).join("");
}
