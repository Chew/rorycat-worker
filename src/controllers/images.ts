import {Env} from "../index";
import {Image} from "../types";
import {mainContent} from "../layout";

/**
 * Grabs a random rory image
 *
 * @param request The request
 * @param env The environment
 * @param ctx The execution context
 */
export async function randomImage(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
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
            const image: Image = result.results[0];
            // retrieve local HTML file from ./rory.html
            // replace {{ id }} with the url of the image
            let newHtml = mainContent.replace("{{ id }}", image.id.toString());
            newHtml = newHtml.replace("{{ url }}", image.url);
            console.log(newHtml);
            return new Response(newHtml, {headers: {'content-type': 'text/html;charset=UTF-8',}, status: 200});
        } else {
            return new Response("No results", {status: 500});
        }
    } catch (e: any) {
        return new Response(e.message, {status: 500});
    }
}
