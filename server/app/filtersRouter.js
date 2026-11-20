import jsonController from "./jsonController.js"
import filtersController from "./filtersController.js"
import getRequestData from "./getRequestData.js"

const filtersRouter = async (req, res) => {
    if (req.url.match(/\/api\/filters\/metadata\/\d+/) && req.method == "GET") {
        let id = req.url.split("/")[4]
        res.writeHead(200, { "Content-Type": "application/json" })
        if (jsonController.getone(id) != null) {
            let metadata = await filtersController.getmetadata(id)
            res.end(JSON.stringify(metadata))
        }
        else {
            res.end(JSON.stringify({ message: `Photo with id: ${id} not found` }))
        }
        return
    }
    if (req.url == "/api/filters" && req.method == "PATCH") {
        let filter = JSON.parse(await getRequestData(req))
        let id = filter.id
        res.writeHead(200, { "Content-Type": "application/json" })
        if (jsonController.getone(id) != null) {
            let new_photo = await filtersController.filter(filter)

            res.end(JSON.stringify(new_photo))
        }
        else {
            res.end(JSON.stringify({ message: `Photo with id: ${id} not found` }))
        }
        return
    }
    if (req.url.match(/\/api\/getimage\/\d+/) && req.method == "GET") {
        let id = req.url.split("/")[3]
        if (jsonController.getone(id) != null) {
            filtersController.getimage(req, res)
        }
        else {
            res.end(JSON.stringify({ message: `Photo with id: ${id} not found` }))
        }
        return
    }
    if (req.url.match(/\/api\/getimage\/\d+\/filter\/\w/) && req.method == "GET") {
        let id = req.url.split("/")[3]
        if (jsonController.getone(id) != null) {
            filtersController.getimage(req, res)
        }
        else {
            res.end(JSON.stringify({ message: `Photo with id: ${id} not found` }))
        }
        return
    }
    res.writeHead(404, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ message: "Route not found" }))


}

export default filtersRouter;