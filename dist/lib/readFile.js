"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileAsGameDetails = void 0;
var fs = __importStar(require("fs"));
var slippi_js_1 = require("@slippi/slippi-js");
function readFileAsGameDetails(file) {
    var game = readFileAsSlippiGame(file);
    return generateGameDetails(file, game);
}
exports.readFileAsGameDetails = readFileAsGameDetails;
function readFileAsSlippiGame(file) {
    var buf = fs.readFileSync(file);
    return new slippi_js_1.SlippiGame(buf);
}
function generateGameDetails(name, game) {
    // For a valid SLP game, at the very least we should have valid settings
    var settings = game.getSettings();
    if (!settings) {
        throw new Error("Invalid SLP file. Could not find game settings in file: ".concat(name));
    }
    var stats = game.getStats();
    if (!stats) {
        throw new Error("Failed to process game stats for file: ".concat(name));
    }
    var metadata = game.getMetadata();
    if (!metadata) {
        throw new Error("Failed to load metadata for file: ".concat(name));
    }
    return {
        filePath: name,
        settings: settings,
        frames: game.getFrames(),
        stats: stats,
        metadata: metadata,
        latestFrame: game.getLatestFrame(),
        gameEnd: game.getGameEnd(),
    };
}
