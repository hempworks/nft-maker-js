"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.desc = exports.command = void 0;
const listr2_1 = require("listr2");
const actions_1 = require("../actions");
exports.command = 'run';
exports.desc = 'Run the generator';
const tasks = new listr2_1.Listr([
    {
        title: 'Generate Manifest',
        task: () => (0, actions_1.generateManifest)(),
    },
    {
        title: 'Generate Stats',
        task: () => (0, actions_1.generateStats)(),
    },
    {
        title: 'Generate Metadata',
        task: async (ctx, task) => {
            await (0, actions_1.generateMetadata)(task);
        },
    },
    {
        title: 'Generate Images',
        task: async (ctx, task) => {
            await (0, actions_1.generateImages)(task);
        },
    },
]);
const handler = () => {
    tasks
        .run()
        .catch(err => {
        console.error(err);
    })
        .finally(() => {
        process.exit(0);
    });
};
exports.handler = handler;
