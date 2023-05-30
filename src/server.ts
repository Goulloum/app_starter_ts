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
                                       

              17/11/2022

*/
import "reflect-metadata";
import express from "express";
import connection from "./Model";

require("dotenv").config();
var cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());

const start = async (): Promise<void> => {
    try {
        await connection.sync({ alter: process.env.PROFILE === "dev" });
        app.listen(process.env.SERVER_PORT, () => {
            console.log("Server started on port 8080");
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

void start();
