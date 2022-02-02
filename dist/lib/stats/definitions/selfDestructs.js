"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selfDestructs = void 0;
var lodash_1 = __importDefault(require("lodash"));
exports.selfDestructs = {
    // Only show this one if greater than 2 for one player
    name: "Total Self-Destructs",
    type: "number",
    betterDirection: "lower",
    recommendedRounding: 0,
    calculate: function (games, playerIndex) {
        var sdCounts = lodash_1.default.map(games, function (game) {
            var stocks = lodash_1.default.get(game, ["stats", "stocks"]) || [];
            var playerEndedStocks = lodash_1.default.filter(stocks, function (stock) {
                var isPlayer = stock.playerIndex === playerIndex;
                var hasEndPercent = stock.endPercent !== null;
                return isPlayer && hasEndPercent;
            });
            var conversions = lodash_1.default.get(game, ["stats", "conversions"]) || [];
            var oppKillConversions = lodash_1.default.filter(conversions, function (conversion) {
                var isOpp = conversion.playerIndex === playerIndex;
                var didKill = conversion.didKill;
                return isOpp && didKill;
            });
            return playerEndedStocks.length - oppKillConversions.length;
        });
        var sdSum = lodash_1.default.sum(sdCounts);
        return {
            result: sdSum,
            simple: {
                number: sdSum,
                text: "".concat(sdSum),
            },
        };
    },
};
