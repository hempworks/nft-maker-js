"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const fs_1 = __importDefault(require("fs"));
const manifest = (0, util_1.resolveManifest)();
const config = (0, util_1.resolveConfiguration)();
function default_1() {
    manifest.forEach((item) => {
        const { tokenId } = item;
        const fileNumber = tokenId - 1;
        const token = createToken(tokenId, item);
        if (!fs_1.default.existsSync('./assets')) {
            fs_1.default.mkdirSync('./assets');
        }
        fs_1.default.writeFileSync(`./assets/${fileNumber}.json`, JSON.stringify(token, null, 2), {
            flag: 'w',
        });
        (0, util_1.info)(`Generated '/assets/${fileNumber}.json'`);
    });
}
exports.default = default_1;
function createToken(number, item) {
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
