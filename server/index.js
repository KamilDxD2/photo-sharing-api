import { config } from 'dotenv';
config();

import http from 'http';
import imageRouter from "./app/imageRouter.js";
import tagsRouter from "./app/tagsRouter.js";
import filtersRouter from "./app/filtersRouter.js";
import userRouter from './app/userRouter.js';
import profileRouter from './app/profileRouter.js';


http.createServer(async (req, res) => {
    try {

        //images

        if (req.url.search("/api/photos") != -1) {
            await imageRouter(req, res)
        }

        //tags

        else if (req.url.search("/api/tags") != -1) {
            await tagsRouter(req, res)
        }

        //filters

        else if (req.url.search("/api/filters") != -1 || req.url.search("/api/getimage") != -1) {
            await filtersRouter(req, res)
        }

        //users

        else if (req.url.search("/api/user") != -1) {
            await userRouter(req, res)
        }

        //profile

        else if (req.url.search("/api/profile") != -1) {
            await profileRouter(req, res)
        }

        else {
            res.writeHead(404, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ message: "Route not found" }))
        }

    } catch (err) {
        console.error(err)
        if (!res.headersSent) res.writeHead(500, { "Content-Type": "application/json" })
        if (!res.writableEnded) res.end(JSON.stringify({ message: "Internal server error" }))
    }




}).listen(process.env.APP_PORT, () => console.log(`listen on ${process.env.APP_PORT}`))