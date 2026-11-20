import model from './model.js'
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import jsonController from './jsonController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { Images } = model;

const filtersController = {
    getmetadata: (id) => {
        let img = Images.find(obj => obj.id == id);
        let url = path.join(path.dirname(__dirname), img.url.replace('http://localhost:3000/', ''));

        return new Promise(async (resolve, reject) => {
            try {

                if (url) {
                    let meta = await sharp(url)
                        .metadata()
                    resolve(meta)
                }
                else {
                    resolve("url_not_found")
                }

            } catch (err) {
                reject(err.message)
            }
        })
    },
    filter: (obj) => {
        let id = obj.id
        let name = obj.name
        let img = Images.find(Obj => Obj.id == id);
        let url = path.join(path.dirname(__dirname), img.url.replace('http://localhost:3000/', ''));

        const relative = (p) => path.relative(path.dirname(__dirname), p).split(path.sep).join('/');

        return new Promise(async (resolve, reject) => {
            try {

                if (url) {
                    if (name == "rotate") {
                        let newUrl = url.replace(/(.*)(\.[\w\d_-]+)$/i, '$1-ROTATED$2');
                        jsonController.update_fil(id, "rotate", relative(newUrl))
                        await sharp(url)
                            .rotate(90)
                            .toFile(newUrl);
                        resolve(img)
                    }
                    else if (name == "resize") {
                        let newUrl = url.replace(/(.*)(\.[\w\d_-]+)$/i, '$1-RESIZED$2');
                        jsonController.update_fil(id, "resize", relative(newUrl))
                        await sharp(url)
                            .resize({
                                width: 512,
                                height: 512
                            })
                            .toFile(newUrl);
                        resolve(img)
                    }
                    else if (name == "reformat") {
                        let newUrl = url.replace(/(.*)(\.[\w\d_-]+)$/i, '$1-REFORMATTED.png');
                        jsonController.update_fil(id, "reformat", relative(newUrl))
                        await sharp(url)
                            .toFormat("png")
                            .toFile(newUrl);
                        resolve(img)
                    }
                    else if (name == "crop") {
                        let newUrl = url.replace(/(.*)(\.[\w\d_-]+)$/i, '$1-CROPPED$2');
                        jsonController.update_fil(id, "crop", relative(newUrl))
                        await sharp(url)
                            .extract({ width: 200, height: 200, left: 20, top: 20 })
                            .toFile(newUrl);
                        resolve(img)
                    }
                    else if (name == "grayscale") {
                        let newUrl = url.replace(/(.*)(\.[\w\d_-]+)$/i, '$1-GRAYSCALE$2');
                        jsonController.update_fil(id, "grayscale", relative(newUrl))
                        await sharp(url)
                            .grayscale()
                            .toFile(newUrl);
                        resolve(img)
                    }
                    else if (name == "flip") {
                        let newUrl = url.replace(/(.*)(\.[\w\d_-]+)$/i, '$1-FLIPPED$2');
                        jsonController.update_fil(id, "flip", relative(newUrl))
                        await sharp(url)
                            .flip()
                            .toFile(newUrl);
                        resolve(img)
                    }
                    else if (name == "flop") {
                        let newUrl = url.replace(/(.*)(\.[\w\d_-]+)$/i, '$1-FLOPPED$2');
                        jsonController.update_fil(id, "flop", relative(newUrl))
                        await sharp(url)
                            .flop()
                            .toFile(newUrl);
                        resolve(img)
                    }
                    else if (name == "negate") {
                        let newUrl = url.replace(/(.*)(\.[\w\d_-]+)$/i, '$1-NEGATE$2');
                        jsonController.update_fil(id, "negate", relative(newUrl))
                        await sharp(url)
                            .negate()
                            .toFile(newUrl);
                        resolve(img)
                    }
                    else if (name == "tint") {
                        let newUrl = url.replace(/(.*)(\.[\w\d_-]+)$/i, '$1-TINT$2');
                        jsonController.update_fil(id, "tint", relative(newUrl))
                        await sharp(url)
                            .tint({ r: 255, g: 0, b: 0 })
                            .toFile(newUrl);
                        resolve(img)
                    }
                    else {
                        resolve("Filter doesn't exist")
                    }
                }
                else {
                    resolve("url_not_found")
                }

            } catch (err) {
                reject(err.message)
            }
        })

    },
    getimage: (req, res) => {

        const ReadFile = (url) => {
            fs.readFile(url, (err, data) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "application/json" })
                    res.end(JSON.stringify({ message: `Error reading image file: ${err.message}` }))
                } else {
                    let type = "application/octet-stream";
                    if (data[0] == 0x89 && data[1] == 0x50) type = "image/png";
                    else if (data[0] == 0xFF && data[1] == 0xD8) type = "image/jpeg";
                    res.writeHead(200, {
                        "Content-Type": type,
                        "Content-Disposition": `inline; filename=${path.basename(url)}`
                    })
                    res.end(data);
                }
            });
        }

        let id = req.url.split("/")[3]
        let filter = req.url.split("/")[5]
        let img = Images.find(obj => obj.id == id);
        let url = path.join(path.dirname(__dirname), img.url.replace('http://localhost:3000/', ''));

        if (filter) {
            if (filter == "rotate") {
                let newUrl = url.replace(/(.*)(\.[\w\d_-]+)$/i, '$1-ROTATED$2');
                ReadFile(newUrl)
            }
            else if (filter == "resize") {
                let newUrl = url.replace(/(.*)(\.[\w\d_-]+)$/i, '$1-RESIZED$2');
                ReadFile(newUrl)
            }
            else if (filter == "reformat") {
                let newUrl = url.replace(/(.*)(\.[\w\d_-]+)$/i, '$1-REFORMATTED.png');
                ReadFile(newUrl)
            }
            else if (filter == "crop") {
                let newUrl = url.replace(/(.*)(\.[\w\d_-]+)$/i, '$1-CROPPED$2');
                ReadFile(newUrl)
            }
            else if (filter == "grayscale") {
                let newUrl = url.replace(/(.*)(\.[\w\d_-]+)$/i, '$1-GRAYSCALE$2');
                ReadFile(newUrl)
            }
            else if (filter == "flip") {
                let newUrl = url.replace(/(.*)(\.[\w\d_-]+)$/i, '$1-FLIPPED$2');
                ReadFile(newUrl)
            }
            else if (filter == "flop") {
                let newUrl = url.replace(/(.*)(\.[\w\d_-]+)$/i, '$1-FLOPPED$2');
                ReadFile(newUrl)
            }
            else if (filter == "negate") {
                let newUrl = url.replace(/(.*)(\.[\w\d_-]+)$/i, '$1-NEGATE$2');
                ReadFile(newUrl)
            }
            else if (filter == "tint") {
                let newUrl = url.replace(/(.*)(\.[\w\d_-]+)$/i, '$1-TINT$2');
                ReadFile(newUrl)
            }
            else {
                res.writeHead(404, { "Content-Type": "application/json" })
                res.end(JSON.stringify({ message: "Filter doesn't exist" }))
            }
        }
        else {
            ReadFile(url)
        }
    },
}

export default filtersController;