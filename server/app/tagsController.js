import model from './model.js'
let { Tags, ModdedTags } = model;

const tagsController = {
    add: (obj) => {
        let OBJ = JSON.parse(obj);
        OBJ.id = ModdedTags.length;
        ModdedTags.push(OBJ);
        return OBJ;
    },
    getall: () => {
        if (ModdedTags.length == 0) {
            return Tags;
        }
        else {
            return ModdedTags;
        }

    },
    getmodded: () => {
        let MTags = Tags.map((tag, index) => {
            return {
                id: index,
                name: tag,
                popularity: Math.floor(Math.random() * (1000 - 100 + 1) + 100)
            };
        });
        if (ModdedTags.length == 0) {
            ModdedTags = MTags;
        }
        return ModdedTags;

    },
    getone: (ID) => {
        return ModdedTags.find(obj => obj.id == ID) || null;
    }

}

export default tagsController;