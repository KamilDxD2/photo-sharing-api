import userController from "./userController.js"
import getRequestData from "./getRequestData.js"

const userRouter = async (req, res) => {
    if (req.url == "/api/user/register" && req.method == "POST") {
        let data = JSON.parse(await getRequestData(req))
        if (Object.values(data).every(item => item !== "")) {
            res.writeHead(200, { "Content-Type": "application/json" })
            let User = await userController.adduser(data)
            res.end(JSON.stringify({ message: User }))
        }
        else {
            res.writeHead(404, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ message: "Data incomplete" }))
        }
        return
    }
    if (req.url.match(/\/api\/user\/confirm\/eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/]*/g) && req.method == "GET") {
        let token = req.url.split("/")[4]
        let Verify = await userController.verifyuser(token)
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify(Verify))

        return
    }
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        let token = req.headers.authorization.split(" ")[1]
        let Res = userController.verifyToken(token)
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify(Res))
        return
    }
    if (req.url == "/api/user/login" && req.method == "POST") {
        let data = JSON.parse(await getRequestData(req))
        if (Object.values(data).every(item => item !== "")) {
            let User = await userController.loginuser(data)
            if (typeof User === "string") {
                res.writeHead(401, { "Content-Type": "application/json" })
                res.end(JSON.stringify({ message: User }))
                return
            }
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Authorization', 'Bearer ' + User.token);
            res.end(JSON.stringify(User))
        }
        else {
            res.writeHead(404, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ message: "Data incomplete" }))
        }
        return
    }
    if (req.url == "/api/user" && req.method == "GET") {
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify(userController.getuser()))
        return
    }
    res.writeHead(404, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ message: "Route not found" }))


}

export default userRouter;




