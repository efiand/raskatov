import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";
import { host, STATIC_MIME_TYPES, staticExtensions } from "#server/constants.js";
import { createApp } from "#server/lib/app.js";

let sseData = "reload";

/**
 * Server Sent Events
 *
 * @type {(res: RouteResponse) => void}
 */
function sendReload(res) {
	res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		Connection: "keep-alive",
	});
	res.write(`retry: 33\ndata: ${sseData}\nid: ${Date.now()}\n\n`);
	sseData = "";
}

createApp(async (req, res, next) => {
	if (!req.url?.includes("/raskatov")) {
		res.statusCode = 301;
		res.setHeader("Location", req.url === "/" ? "/raskatov" : `/raskatov${req.url}`);
		res.end();
		return;
	}

	const { pathname } = new URL(`${host}${req.url?.replace("/raskatov", "")}`);

	if (pathname === "/dev/watch") {
		sendReload(res);
		return;
	}

	if (pathname === "/.well-known/appspecific/com.chrome.devtools.json") {
		res.setHeader("Content-Type", "application/json");
		res.end("{}");
		return;
	}

	const ext = path.extname(pathname);

	if (!staticExtensions.has(ext)) {
		next?.(req, res);
		return;
	}

	try {
		const filePath = path.join(process.cwd(), "./public", pathname);
		await access(filePath);
		res.writeHead(200, { "Content-Type": STATIC_MIME_TYPES[ext] });
		createReadStream(filePath).pipe(res);
	} catch (error) {
		console.error(error);
		next?.(req, res);
	}
});
