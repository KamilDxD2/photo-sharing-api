import profileController from "./profileController.js"
import getRequestData from "./getRequestData.js"

const profileRouter = async (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        res.writeHead(401, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ message: "Missing token (Authorization: Bearer <token>)" }))
        return
    }
    if (req.url == "/api/profile" && req.method == "GET") {
        let token = req.headers.authorization.split(" ")[1]
        let Res = profileController.verifyToken(token)
        if (Res.hasOwnProperty("message")) {
            res.writeHead(401, { "Content-Type": "application/json" })
            res.end(JSON.stringify(Res))
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify(Res))
        }
        return
    }
    if (req.url == "/api/profile" && req.method == "PATCH") {
        let token = req.headers.authorization.split(" ")[1]
        let Res = profileController.verifyToken(token)
        if (Res.hasOwnProperty("message")) {
            res.writeHead(401, { "Content-Type": "application/json" })
            res.end(JSON.stringify(Res))
        }
        else {
            let new_data = JSON.parse(await getRequestData(req))
            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify(profileController.updateProfile(new_data, Res.email)))
        }
        return
    }
    res.writeHead(404, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ message: "Route not found" }))


}

export default profileRouter;




