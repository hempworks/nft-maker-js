"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapWithKeys = exports.resolveManifest = exports.resolveConfiguration = exports.fail = exports.info = exports.error = exports.log = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
function log(msg) {
    return console.log(msg);
}
exports.log = log;
function error(msg) {
    return console.error(chalk_1.default.red(msg));
}
exports.error = error;
function info(msg) {
    return console.log(msg);
}
exports.info = info;
function fail(msg) {
    info(chalk_1.default.red(msg));
    process.exit(1);
}
exports.fail = fail;
function resolveConfiguration() {
    let configLocation = path_1.default.resolve('./project.config.js');
    return fs_1.default.existsSync(configLocation)
        ? require(configLocation)
        : fail('Could not find the project configuration.');
}
exports.resolveConfiguration = resolveConfiguration;
function resolveManifest() {
    let manifestLocation = path_1.default.resolve('./manifest.json');
    return fs_1.default.existsSync(manifestLocation)
        ? require(manifestLocation)
        : fail('Could not find the project manifest.');
}
exports.resolveManifest = resolveManifest;
function mapWithKeys(myObject, iterator) {
    return Object.keys(myObject).map((key, index) => {
        return iterator(key, index);
    });
}
exports.mapWithKeys = mapWithKeys;
