import model from './model.js'
const { Images } = model;

const jsonController = {
    add: (obj) => {
        Images.push(obj);
        return obj;
    },
    delete: (ID) => {
        let index = Images.findIndex(obj => obj.id == ID);
        if (index !== -1) {
            Images.splice(index, 1);
            return true;
        }
        return false
    },
    update: (ID) => {
        let index = Images.findIndex(obj => obj.id == ID);
        if (index !== -1) {
            let obj = {
                "status": `edited (${Images[index].history.length})`,
                "timestamp": new Date().getTime()
            }
            Images[index].history.push(obj);
            Images[index].lastChange = obj.status;


            return Images[index];
        }
        return null;
    },
    update_fil: (ID, filter, url) => {
        let index = Images.findIndex(obj => obj.id == ID);
        if (index !== -1) {
            let obj = {
                "status": filter,
                "timestamp": new Date().getTime(),
                "url": url
            }
            Images[index].history.push(obj);
            Images[index].lastChange = obj.status;


            return Images[index];
        }
        return null;
    },
    getall: () => {
        return Images;
    },
    getone: (ID) => {
        return Images.find(obj => obj.id == ID) || null;
    },
    gettags: (ID) => {
        let img = Images.find(obj => obj.id == ID);
        let obj = {
            "id": img.id,
            "tags": img.tags
        }
        return obj;
    },
    addtags: (ID, TAGS) => {
        let tags_parsed = JSON.parse(TAGS);
        let index = Images.findIndex(obj => obj.id == ID);

        if (index !== -1) {
            let obj = {
                "status": `edited (${Images[index].history.length})`,
                "timestamp": new Date().getTime()
            }
            Images[index].history.push(obj);
            Images[index].lastChange = obj.status;

            if (!Images[index].tags) {
                if (Array.isArray(tags_parsed)) {
                    Images[index].tags = tags_parsed;
                    return Images[index];
                }
                else {
                    Images[index].tags = [tags_parsed];
                    return Images[index];
                }

            }
            else {
                if (!Array.isArray(tags_parsed)) {
                    Images[index].tags.push(tags_parsed);
                }
                else {
                    tags_parsed.forEach(element => {
                        Images[index].tags.push(element);
                    });
                }

                return Images[index];
            }
        }
        return null;
    },

}

export default jsonController;