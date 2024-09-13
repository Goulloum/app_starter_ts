import { ExpressErrorMiddlewareInterface, HttpError, Middleware, NotFoundError, Render } from "routing-controllers";

@Middleware({ type: "after" })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    @Render("error")
    error(error: HttpError, request: any, response: any, next: (err: any) => any) {
        return response.render("error", { message: error.message, status: error.httpCode, stack: error.stack });
    }
}
