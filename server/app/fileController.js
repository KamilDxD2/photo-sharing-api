import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const handleUpload = (req) => {
    return new Promise((resolve, reject) => {
        const form = new formidable.IncomingForm();
        form.uploadDir = path.join(path.dirname(__dirname), 'uploads');

        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err);
                return;
            }
            if (!files.file) {
                resolve({ message: "No file sent (use the form field \"file\")" });
                return;
            }
            if (!/^[\w-]+$/.test(fields.album || "")) {
                fs.unlink(files.file.path, () => { });
                resolve({ message: "Invalid album name" });
                return;
            }

            let oldPath = files.file.path;
            let extension = path.extname(files.file.name).toLowerCase() || '.jpg';
            let FormatedPath = path.basename(files.file.path) + extension;

            let albumPath = `uploads/${fields.album}/album`;
            let newPath = path.join(path.dirname(__dirname), albumPath, FormatedPath);

            if (!fs.existsSync(path.join(path.dirname(__dirname), `uploads/${fields.album}`))) {
                fs.unlink(files.file.path, () => { });
                resolve({ message: "User doesn't exist" });
                return;
            }

            fs.rename(oldPath, newPath, function (err) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve({
                    id: new Date().getTime(),
                    album: fields.album,
                    originalName: files.file.name,
                    url: `${albumPath}/${FormatedPath}`,
                    lastChange: 'original',
                    history: [
                        {
                            status: 'original',
                            timestamp: new Date().getTime()
                        }
                    ]
                });
            });
        });
    });
};

export default handleUpload;
