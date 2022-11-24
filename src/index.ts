/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import {Image} from "./types";

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	DB: D1Database;
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const db = env.DB;
		// Get random row from images table (SQLite)
		try {
			const stmt = db.prepare("SELECT * FROM images ORDER BY RANDOM() LIMIT 1");
			const result: D1Result<Image> = await stmt.all();
			if (result.error) {
				return new Response(result.error, {status: 500});
			}
			if (result.success && result.results !== undefined) {
				// Get first row
				const row: Image = result.results[0];
				return new Response("Hello! I am rory " + row.id + " with URL " + row.url, {status: 200});
			} else {
				return new Response("No results", {status: 500});
			}
		} catch (e: any) {
			return new Response(e.message, {status: 500});
		}
	},
};
