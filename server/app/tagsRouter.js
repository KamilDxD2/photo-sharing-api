import tagsController from "./tagsController.js"
import getRequestData from "./getRequestData.js"

const tagsRouter = async (req, res) => {
    if (req.url == "/api/tags/raw" && req.method == "GET") {
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify(tagsController.getall()))
        return
    }
    if (req.url == "/api/tags" && req.method == "GET") {
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify(tagsController.getmodded()))
        return
    }
    if (req.url.match(/\/api\/tags\/\d+/) && req.method == "GET") {
        let id = req.url.split("/")[3]
        res.writeHead(200, { "Content-Type": "application/json" })
        if (tagsController.getone(id) != null) {
            res.end(JSON.stringify(tagsController.getone(id)))
        }
        else {
            res.end(JSON.stringify({ message: `Tag with id: ${id} not found` }))
        }
        return
    }
    if (req.url == "/api/tags" && req.method == "POST") {
        let tag = await getRequestData(req)

        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify(tagsController.add(tag)))
        return
    }

    res.writeHead(404, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ message: "Route not found" }))


}

export default tagsRouter;




