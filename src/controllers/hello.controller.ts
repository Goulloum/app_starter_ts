import "reflect-metadata";
import { BodyParam, Controller, Get, NotFoundError, QueryParam, Render, Req, Res } from "routing-controllers";

@Controller()
export class HelloController {
    @Get("/hello")
    @Render("index")
    public hello(@QueryParam("name") name: string, @Req() req: any, @Res() res: any) {
        if (!name) {
            throw new NotFoundError("Name is required");
        }
        return { name: name };
    }
}
