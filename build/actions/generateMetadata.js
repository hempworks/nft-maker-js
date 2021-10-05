"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const fs_1 = __importDefault(require("fs"));
const delay_1 = __importDefault(require("delay"));
const lodash_1 = require("lodash");
async function default_1(task) {
    const manifest = (0, util_1.resolveManifest)();
    const config = (0, util_1.resolveConfiguration)();
    // Generate assets folder...
    if (task) {
        task.output = 'Generating assets folder...';
    }
    if (!fs_1.default.existsSync('./assets')) {
        fs_1.default.mkdirSync('./assets');
    }
    // Generate asset metadata...
    for (const item of manifest) {
        const { tokenId } = item;
        const fileNumber = tokenId - 1;
        let filePath = `./assets/${fileNumber}.json`;
        (0, lodash_1.tap)(createToken(tokenId, item, config), token => {
            if (task) {
                task.output = `Generating asset metadata '${filePath}'`;
            }
            fs_1.default.writeFileSync(filePath, JSON.stringify(token, null, 2), { flag: 'w' });
        });
        await (0, delay_1.default)(10);
    }
}
exports.default = default_1;
function createToken(number, item, config) {
    const token = {
        name: `${config.name} #${number}`,
        symbol: config.symbol ?? '',
        description: config.description,
        seller_fee_basis_points: config.sellerFeeBasisPoints,
        image: 'image.png',
        external_url: '',
        attributes: [],
        collection: config.collection.name,
        properties: {
            files: [
                {
                    uri: 'image.png',
                    type: 'image/png',
                },
            ],
        },
        category: 'image',
        creators: config.creators,
    };
    Object.keys(item).forEach((k) => {
        if ((0, util_1.shouldIncludeTrait)(k)) {
            // @ts-ignore
            token['attributes'].push({ trait_type: k, value: item[k] });
        }
    });
    return token;
}
