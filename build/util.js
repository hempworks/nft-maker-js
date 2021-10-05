"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldIncludeTrait = exports.resolveManifest = exports.resolveConfiguration = exports.fail = exports.info = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
function info(msg) {
    return console.info(msg);
}
exports.info = info;
function fail(msg) {
    info(chalk_1.default.red(msg));
    process.exit(1);
}
exports.fail = fail;
function resolveConfiguration() {
    let configLocation = path_1.default.resolve('./config.js');
    return fs_1.default.existsSync(configLocation)
        ? require(configLocation)
        : fail('Could not find the project configuration.');
}
exports.resolveConfiguration = resolveConfiguration;
function resolveManifest() {
    let manifestLocation = path_1.default.resolve('./manifest.json');
    if (fs_1.default.existsSync(manifestLocation)) {
        let rawData = fs_1.default.readFileSync(manifestLocation);
        return JSON.parse(rawData.toString());
    }
    fail('Could not find the project manifest.');
}
exports.resolveManifest = resolveManifest;
function shouldIncludeTrait(trait) {
    return resolveConfiguration()
        .traits.map((t) => t.name)
        .includes(trait);
}
exports.shouldIncludeTrait = shouldIncludeTrait;
