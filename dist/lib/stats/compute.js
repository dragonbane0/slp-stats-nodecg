"use strict";
/*
 * Based on: https://github.com/project-slippi/slippi-set-stats/blob/master/main.js
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOutput = exports.STAT_DEFINITIONS = void 0;
var slippi_js_1 = require("@slippi/slippi-js");
var lodash_1 = __importDefault(require("lodash"));
var util_1 = require("../util");
var winner_1 = require("../winner");
var definitions_1 = require("./definitions");
var types_1 = require("./types");
exports.STAT_DEFINITIONS = new Map();
exports.STAT_DEFINITIONS.set(types_1.Stat.OPENINGS_PER_KILL, definitions_1.openingsPerKill);
exports.STAT_DEFINITIONS.set(types_1.Stat.DAMAGE_PER_OPENING, definitions_1.damagePerOpening);
exports.STAT_DEFINITIONS.set(types_1.Stat.NEUTRAL_WINS, definitions_1.neutralWins);
exports.STAT_DEFINITIONS.set(types_1.Stat.KILL_MOVES, definitions_1.killMoves);
exports.STAT_DEFINITIONS.set(types_1.Stat.NEUTRAL_OPENER_MOVES, definitions_1.neutralOpenerMoves);
exports.STAT_DEFINITIONS.set(types_1.Stat.FIRST_BLOOD, definitions_1.firstBlood);
exports.STAT_DEFINITIONS.set(types_1.Stat.L_CANCEL, definitions_1.lCancelAccuracy);
exports.STAT_DEFINITIONS.set(types_1.Stat.EARLY_KILLS, definitions_1.earlyKills);
exports.STAT_DEFINITIONS.set(types_1.Stat.LATE_DEATHS, definitions_1.lateDeaths);
exports.STAT_DEFINITIONS.set(types_1.Stat.SELF_DESTRUCTS, definitions_1.selfDestructs);
exports.STAT_DEFINITIONS.set(types_1.Stat.INPUTS_PER_MINUTE, definitions_1.inputsPerMinute);
exports.STAT_DEFINITIONS.set(types_1.Stat.AVG_KILL_PERCENT, definitions_1.averageKillPercent);
exports.STAT_DEFINITIONS.set(types_1.Stat.HIGH_DAMAGE_PUNISHES, definitions_1.highDamagePunishes);
exports.STAT_DEFINITIONS.set(types_1.Stat.DAMAGE_DONE, definitions_1.damageDone);
function computeStats(statsList, games) {
    var firstGame = lodash_1.default.first(games);
    if (!firstGame) {
        return [];
    }
    // console.log(firstGame);
    var orderIndices = lodash_1.default.map(firstGame.settings.players, "playerIndex");
    var reversedIndices = lodash_1.default.chain(orderIndices).clone().reverse().value();
    var indices = [orderIndices, reversedIndices];
    var statResults = statsList.map(function (statKey) {
        var def = exports.STAT_DEFINITIONS.get(statKey);
        if (!def || !def.calculate) {
            return null;
        }
        var calculate = def.calculate, output = __rest(def, ["calculate"]);
        var results = lodash_1.default.map(indices, function (iIndices) {
            var result = def.calculate(games, iIndices[0] /*, iIndices[1]*/);
            result.port = iIndices[0] + 1;
            return result;
        });
        return __assign(__assign({}, output), { id: statKey, results: results });
    });
    return statResults;
}
function generateGameInfo(games) {
    var getStartAt = function (game) { return game.metadata.startAt; };
    var orderedGames = lodash_1.default.orderBy(games, [getStartAt], ["asc"]);
    var getResultForPlayer = function (game, playerIndex) {
        var gameEnd = game.gameEnd;
        if (gameEnd) {
            // Handle LRAS
            switch (gameEnd.gameEndMethod) {
                case 7:
                    return gameEnd.lrasInitiatorIndex === playerIndex ? "loser" : "winner";
            }
        }
        var latestFrame = game.latestFrame;
        if (!latestFrame) {
            return "unknown";
        }
        var winner = (0, winner_1.findWinner)(latestFrame);
        return winner === playerIndex ? "winner" : "loser";
    };
    var generatePlayerInfo = function (game) { return function (player) {
        // console.log(player);
        var characterName = player.characterId !== null ? slippi_js_1.characters.getCharacterName(player.characterId) : "Player ".concat(player.port);
        var characterColor = player.characterId !== null && player.characterColor !== null
            ? player.characterColor
            : "Default";
        return {
            port: player.port,
            characterId: player.characterId,
            nametag: player.nametag,
            characterName: characterName,
            characterColor: characterColor,
            gameResult: getResultForPlayer(game, player.playerIndex),
        };
    }; };
    return lodash_1.default.map(orderedGames, function (game) {
        var playerInfoGen = generatePlayerInfo(game);
        return {
            stage: {
                id: game.settings.stageId,
                name: game.settings.stageId !== null ? slippi_js_1.stages.getStageName(game.settings.stageId) : "",
            },
            players: lodash_1.default.map(game.settings.players, playerInfoGen),
            startTime: game.metadata.startAt,
            duration: (0, util_1.convertFrameCountToDurationString)(game.stats.lastFrame),
        };
    });
}
function generateOutput(statsList, games) {
    return {
        games: generateGameInfo(games),
        summary: computeStats(statsList, games),
    };
}
exports.generateOutput = generateOutput;
