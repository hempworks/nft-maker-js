"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.desc = exports.command = void 0;
exports.command = 'run <amount>';
exports.desc = 'Run the generator';
const builder = yargs => yargs.positional('amount', { type: 'string', demandOption: true });
exports.builder = builder;
const handler = (argv) => {
    // info(chalk.blue(`Generating NFT trait statistics...`))
    // Run all the steps
    // info(chalk.green(`Finished generating NFT trait statistics.`))
    process.exit(0);
};
exports.handler = handler;
