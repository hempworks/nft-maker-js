"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.desc = exports.command = void 0;
const util_1 = require("../util");
exports.command = 'traits';
exports.desc = 'Generate trait count statistics for the project';
const builder = yargs => yargs;
exports.builder = builder;
const handler = (argv) => {
    const config = (0, util_1.resolveConfiguration)();
    const manifest = (0, util_1.resolveManifest)();
    // console.log(config, manifest)
    const { traits } = config;
    // console.log(traits)
    let fart = new Map();
    traits.forEach(trait => {
        trait.items.forEach(item => { });
        // fart[trait.]
    });
    // let counts = mapWithKeys(traits, (wew, whoa) => {
    //   console.log(whoa)
    //   return
    // })
    // info(chalk.blue(`Generating NFT manifest with ${amount} items...`))
    //
    // fs.writeFileSync('./manifest.json', JSON.stringify(imageData, null, 2), {
    //   flag: 'w',
    // })
    //
    // log(chalk.green(`Finished generating NFT manifest.`))
    process.exit(0);
};
exports.handler = handler;
