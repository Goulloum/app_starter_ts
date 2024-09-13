/*
Copyrighted since I was born bitch
I tried to do something 
nice, readable and maitainable but 
obviously I failed.
Good luck to the next one

                                       
 (               (  (                  
 )\ )         (  )\ )\      (     )    
(()/(    (   ))\((_|(_)(   ))\   (     
 /(_))_  )\ /((_)_  _  )\ /((_)  )\  ' 
(_)) __|((_|_))(| || |((_|_))( _((_))  
  | (_ / _ \ || | || / _ \ || | '  \() 
   \___\___/\_,_|_||_\___/\_,_|_|_|_|  
                                       

              13/09/2024

*/
import { Application } from "express";
import "reflect-metadata";
import { useExpressServer } from "routing-controllers";
import { parseTemplate } from "./config/template.engine";
import { ErrorMiddleware } from "./middlewares/error.middleware";

require("dotenv").config();
const express = require("express");

const app: Application = express();

app.engine("html", parseTemplate);
app.set("views", __dirname + "/views"); // specify the views directory
app.set("view engine", "html"); // register the template engine
app.use(express.static("public"));

useExpressServer(app, {
    controllers: [__dirname + "/controllers/*.controller.ts"],
    middlewares: [__dirname + "/middlewares/*.middleware.ts"],
    defaultErrorHandler: false,
});

try {
    app.listen(process.env.APP_PORT);
    console.log(`Server started on port ${process.env.APP_PORT}`);
} catch (err: any) {
    console.log(err);
}
