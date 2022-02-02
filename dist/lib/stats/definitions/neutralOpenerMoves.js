"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.neutralOpenerMoves = void 0;
var slippi_js_1 = require("@slippi/slippi-js");
var lodash_1 = __importDefault(require("lodash"));
exports.neutralOpenerMoves = {
    name: "Most Common Neutral Opener",
    type: "text",
    calculate: function (games, playerIndex) {
        var neutralMoves = lodash_1.default.flatMap(games, function (game) {
            var _a;
            var conversions = (_a = lodash_1.default.get(game, ["stats", "conversions"])) !== null && _a !== void 0 ? _a : [];
            var conversionsForPlayer = lodash_1.default.filter(conversions, function (conversion) {
                var isForPlayer = conversion.lastHitBy === playerIndex;
                var isNeutralWin = conversion.openingType === "neutral-win";
                return isForPlayer && isNeutralWin;
            });
            return conversionsForPlayer.filter(function (_a) {
                var moves = _a.moves;
                return moves.length > 0;
            }).map(function (conversion) { return conversion.moves[0]; });
        });
        // TODO: This following code is repeated from kill move code, put in function
        var neutralMovesByMove = lodash_1.default.groupBy(neutralMoves, "moveId");
        var neutralMoveCounts = lodash_1.default.map(neutralMovesByMove, function (moves) {
            var move = lodash_1.default.first(moves);
            var moveId = move ? move.moveId : -1;
            return {
                count: moves.length,
                id: moveId,
                name: slippi_js_1.moves.getMoveName(moveId),
                shortName: slippi_js_1.moves.getMoveShortName(moveId),
            };
        });
        var orderedNeutralMoveCounts = lodash_1.default.orderBy(neutralMoveCounts, ["count"], ["desc"]);
        var topNeutralMove = lodash_1.default.first(orderedNeutralMoveCounts);
        var simpleText = "N/A";
        if (topNeutralMove) {
            simpleText = "".concat(topNeutralMove.shortName, " - ").concat(topNeutralMove.count);
        }
        return {
            result: orderedNeutralMoveCounts,
            simple: {
                text: simpleText.toUpperCase(),
            },
        };
    },
};
