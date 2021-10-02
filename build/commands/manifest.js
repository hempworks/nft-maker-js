"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.desc = exports.command = void 0;
const generateManifest_1 = __importDefault(require("../actions/generateManifest"));
exports.command = 'manifest';
exports.desc = 'Generate an NFT configuration manifest';
const handler = (argv) => {
    (0, generateManifest_1.default)();
    process.exit(0);
};
exports.handler = handler;
