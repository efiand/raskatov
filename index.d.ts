declare global {
	import type { IncomingMessage, ServerResponse } from "node:http";
	import type { SQLOutputValue } from "node:sqlite";

	namespace NodeJS {
		interface ProcessEnv {
			DEV?: string;
			PORT?: string;
		}
	}

	type Changefreq = "daily" | "weekly" | "monthly" | "yearly" | undefined;

	type DbItem = Record<string, SQLOutputValue>;

	type LayoutData = {
		isAmp?: boolean;
		description: string;
		heading: string;
		next: string;
		pageTemplate?: string;
		pathname?: string;
		prev: string;
	};

	type PageData = {
		content: string;
		description: string;
		formattedWritedAt: string;
		heading: string;
		writedAt: string;
	};

	type Route = {
		GET: RouteMethod;
	};

	type RouteData = {
		contentType?: string;
		page?: LayoutData;
		template?: string;
	};

	type RouteMethod = (params: RouteParams) => RouteData;

	type RouteParams = {
		isAmp: boolean;
		pathname: string;
	};

	type RouteRequest = IncomingMessage;

	type RouteResponse = ServerResponse<IncomingMessage> & { req: IncomingMessage };

	type ServerMiddleware = (req: IncomingMessage, res: RouteResponse, next?: ServerMiddleware) => Promise<void>;

	type SitemapPage = {
		lastmod?: string;
		loc: string;
	};

	type Stylesheet = {
		name: string;
		media?: string;
	};

	type TurboPage = {
		content: string;
		description: string;
		heading: string;
		link: string;
		pubDate: string;
		telegramId: number | null;
	};
}

export {};
