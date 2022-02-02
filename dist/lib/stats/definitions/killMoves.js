"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.killMoves = void 0;
var slippi_js_1 = require("@slippi/slippi-js");
var lodash_1 = __importDefault(require("lodash"));
exports.killMoves = {
    name: "Most Common Kill Move",
    type: "text",
    calculate: function (games, playerIndex) {
        var killMoves = lodash_1.default.flatMap(games, function (game) {
            var conversions = lodash_1.default.get(game, ["stats", "conversions"]) || [];
            var conversionsForPlayer = lodash_1.default.filter(conversions, function (conversion) {
                var isForPlayer = conversion.lastHitBy === playerIndex;
                var didKill = conversion.didKill;
                return isForPlayer && didKill;
            });
            return conversionsForPlayer.map(function (conversion) { return lodash_1.default.last(conversion.moves); });
        });
        var killMovesByMove = lodash_1.default.groupBy(killMoves, "moveId");
        var killMoveCounts = lodash_1.default.map(killMovesByMove, function (moves) {
            var move = moves[0];
            if (move) {
                return {
                    count: moves.length,
                    id: move.moveId,
                    name: slippi_js_1.moves.getMoveName(move.moveId),
                    shortName: slippi_js_1.moves.getMoveShortName(move.moveId),
                };
            }
            // Move is undefined so apparently this means it was a grab release??
            return {
                count: moves.length,
                id: -1,
                name: "Grab Release",
                shortName: "grab release",
            };
        });
        var orderedKillMoveCounts = lodash_1.default.orderBy(killMoveCounts, ["count"], ["desc"]);
        var topKillMove = lodash_1.default.first(orderedKillMoveCounts);
        var simpleText = "N/A";
        if (topKillMove) {
            simpleText = "".concat(topKillMove.shortName, " - ").concat(topKillMove.count);
        }
        return {
            result: orderedKillMoveCounts,
            simple: {
                text: simpleText.toUpperCase(),
            },
        };
    },
};
