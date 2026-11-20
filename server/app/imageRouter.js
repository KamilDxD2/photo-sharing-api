import jsonController from "./jsonController.js"
import fileController from "./fileController.js"
import getRequestData from "./getRequestData.js"

const imageRouter = async (req, res) => {
    if (req.url == "/api/photos" && req.method == "POST") {
        let photo = await fileController(req)
        if (photo.hasOwnProperty("message")) {
            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify(photo))
            return
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify(jsonController.add(photo)))
            return
        }

    }
    if (req.url == "/api/photos" && req.method == "GET") {
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify(jsonController.getall()))
        return
    }
    if (req.url.match(/\/api\/photos\/tags\/\d+/) && req.method == "PATCH") {
        let id = req.url.split("/")[4]
        let tags = await getRequestData(req)
        res.writeHead(200, { "Content-Type": "application/json" })
        if (jsonController.getone(id) != null) {
            res.end(JSON.stringify(jsonController.addtags(id, tags)))
        }
        else {
            res.end(JSON.stringify({ message: `Photo with id: ${id} not found` }))
        }
        return
    }
    if (req.url.match(/\/api\/photos\/tags\/\d+/) && req.method == "GET") {
        let id = req.url.split("/")[4]
        res.writeHead(200, { "Content-Type": "application/json" })
        if (jsonController.getone(id) != null) {
            res.end(JSON.stringify(jsonController.gettags(id)))
        }
        else {
            res.end(JSON.stringify({ message: `Photo with id: ${id} not found` }))
        }
        return
    }
    if (req.url.match(/\/api\/photos\/\d+/) && req.method == "GET") {
        let id = req.url.split("/")[3]
        res.writeHead(200, { "Content-Type": "application/json" })
        if (jsonController.getone(id) != null) {
            res.end(JSON.stringify(jsonController.getone(id)))
        }
        else {
            res.end(JSON.stringify({ message: `Photo with id: ${id} not found` }))
        }
        return
    }
    if (req.url.match(/\/api\/photos\/\d+/) && req.method == "DELETE") {
        let id = req.url.split("/")[3]
        res.writeHead(200, { "Content-Type": "application/json" })
        if (jsonController.delete(id)) {
            res.end(JSON.stringify({ message: `Photo with id: ${id} deleted` }))
        }
        else {
            res.end(JSON.stringify({ message: `Photo with id: ${id} not found` }))
        }
        return
    }
    if (req.url.match(/\/api\/photos\/\d+/) && req.method == "PATCH") {
        let id = req.url.split("/")[3]
        res.writeHead(200, { "Content-Type": "application/json" })
        if (jsonController.update(id) != null) {
            res.end(JSON.stringify(jsonController.getone(id)))
        }
        else {
            res.end(JSON.stringify({ message: `Photo with id: ${id} not found` }))
        }
        return
    }

    res.writeHead(404, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ message: "Route not found" }))


}

export default imageRouter;