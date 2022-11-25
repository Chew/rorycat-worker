import {Env} from "./index";
import {randomImage} from "./controllers/images";
import {error404} from "./errors";

export type RouteResponse = (request: Request, env: Env, ctx: ExecutionContext) => Promise<Response>;

export class Route {
    // Routes go here
    routes: Record<string, RouteResponse> = {
        "/": randomImage
    }

    path = "/";

    constructor(request: Request) {
        const url = new URL(request.url);
        this.path = url.pathname;
    }

    /**
     * Returns the response for the route
     *
     * @param request The request
     * @param env The environment
     * @param ctx The execution context
     */
    async parse(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const route = this.routes[this.path];
        if (route) {
            return route(request, env, ctx);
        } else {
            return error404();
        }
    }
}
