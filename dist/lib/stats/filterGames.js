"use strict";
/* eslint-disable */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterGames = void 0;
/*
 * Taken from: https://github.com/project-slippi/slippi-set-stats/blob/master/main.js
 */
var lodash_1 = __importDefault(require("lodash"));
function filterGames(games) {
    // console.log(games);
    var gamesByIsSingles = lodash_1.default.groupBy(games, function (game) {
        var numberOfPlayers = game.settings.players.length;
        return numberOfPlayers === 2;
    });
    var nonSinglesGames = lodash_1.default.get(gamesByIsSingles, false) || [];
    if (lodash_1.default.some(nonSinglesGames)) {
        console.log("The following games have been excluded because they are not singles games:");
        lodash_1.default.forEach(nonSinglesGames, function (game) {
            console.log(game.filePath);
        });
        console.log();
    }
    var singlesGames = lodash_1.default.get(gamesByIsSingles, true) || [];
    var gamesByPorts = lodash_1.default.chain(singlesGames)
        .groupBy(function (game) {
        var ports = lodash_1.default.map(game.settings.players, "port");
        return lodash_1.default.join(ports, "-");
    })
        .orderBy(["length"], ["desc"])
        .value();
    var gamesWithSamePorts = gamesByPorts.shift();
    if (lodash_1.default.some(gamesByPorts)) {
        console.log("The following games have been excluded because the player ports differ:");
        var flatGames = lodash_1.default.flatten(gamesByPorts);
        lodash_1.default.forEach(flatGames, function (game) {
            console.log(game.filePath);
        });
        console.log();
    }
    if (lodash_1.default.isEmpty(gamesWithSamePorts)) {
        throw new Error("There were no valid games found to compute stats from.");
    }
    console.log("Including ".concat(gamesWithSamePorts.length, " games for stat calculation..."));
    return gamesWithSamePorts;
}
exports.filterGames = filterGames;
