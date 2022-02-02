"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStatParams = void 0;
var lodash_1 = require("lodash");
var portColor_1 = require("../portColor");
var compute_1 = require("./compute");
var filterGames_1 = require("./filterGames");
var extractNameAndCode = function (playerPort, details) {
    var settings = details.settings;
    var metadata = details.metadata;
    var index = playerPort - 1;
    var player = settings.players.find(function (player) { return player.playerIndex === index; });
    var playerTag = player ? player.nametag : null;
    var netplayName = (0, lodash_1.get)(metadata, ["players", index, "names", "netplay"], null);
    var netplayCode = (0, lodash_1.get)(metadata, ["players", index, "names", "code"], null);
    var name = playerTag || netplayName || "";
    return [name, netplayCode || ""];
};
function generateStatParams(gameDetails, statsList) {
    var filtered = (0, filterGames_1.filterGames)(gameDetails);
    if (!filtered || filtered.length === 0) {
        throw new Error("No valid games");
    }
    var stats;
    try {
        stats = (0, compute_1.generateOutput)(statsList, filtered);
    }
    catch (err) {
        console.error(err);
        throw new Error(err);
    }
    var games = stats.games, summary = stats.summary;
    console.log("generated stats: ", stats);
    var params = {}; // "mckm1": , "mckm2", "mcno1", "mcno2", "opk1", "opk2", "tdd1", "tdd2", "dpo1", "dpo2", "ipm1", "ipm2", "akp1", "akp2", "nw1", "nw2"};
    // Set character info
    var lastGame = games[games.length - 1];
    var leftPlayer = lastGame.players[0];
    var rightPlayer = lastGame.players[1];
    params.leftColor = (0, portColor_1.getPortColor)(leftPlayer.port);
    params.rightColor = (0, portColor_1.getPortColor)(rightPlayer.port);
    params.char1 = leftPlayer.characterId;
    params.char2 = rightPlayer.characterId;
    params.color1 = leftPlayer.characterColor;
    params.color2 = rightPlayer.characterColor;
    // Set name tags
    var lastGameDetails = filtered[filtered.length - 1];
    var _a = extractNameAndCode(leftPlayer.port, lastGameDetails), leftTag = _a[0], leftCode = _a[1];
    var _b = extractNameAndCode(rightPlayer.port, lastGameDetails), rightTag = _b[0], rightCode = _b[1];
    params.name1 = leftTag.toUpperCase() || leftPlayer.characterName;
    params.name2 = rightTag.toUpperCase() || rightPlayer.characterName;
    params.sub1 = leftCode;
    params.sub2 = rightCode;
    // Set game info
    params.gt = games.length; // Set the total number of games
    games.forEach(function (game, i) {
        // console.log("processing game: ", game);
        var gameKey = "g".concat(i + 1);
        var stageId = game.stage.id;
        var gameDuration = game.duration;
        var playerInfo = game.players.map(function (p) { return [p.characterId, p.characterColor, p.gameResult].join(","); });
        var gameValue = __spreadArray([stageId, gameDuration], playerInfo, true).join(",");
        // console.log(`${gameKey} : ${gameValue}`);
        params[gameKey] = gameValue;
    });
    params.stats = statsList.join(",");
    // Set the stat values
    summary.forEach(function (s) {
        // Stats can be null if the id is invalid or not specified
        if (!s) {
            return;
        }
        switch (s.id) {
            // Put any custom logic here
            default: {
                s.results.forEach(function (result, i) {
                    params["".concat(s.id).concat(i + 1)] = result.simple.text;
                });
                break;
            }
        }
    });
    console.log("returning these params: ", params);
    return params;
}
exports.generateStatParams = generateStatParams;
