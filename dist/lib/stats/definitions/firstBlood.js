"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firstBlood = void 0;
var lodash_1 = __importDefault(require("lodash"));
exports.firstBlood = {
    name: "First Blood",
    type: "number",
    betterDirection: "higher",
    recommendedRounding: 0,
    calculate: function (games, playerIndex) {
        // For each game return either the first blood stock if taken or null if lost
        var firstBloodStocks = games.map(function (game, i) {
            var deathStocks = game.stats.stocks.filter(function (stock) {
                var hasEndPercent = stock.endPercent !== null;
                return hasEndPercent;
            });
            var orderedDeathStocks = lodash_1.default.orderBy(deathStocks, ["endFrame"], ["asc"]);
            var firstStock = orderedDeathStocks[0];
            if (!firstStock || firstStock.playerIndex === playerIndex) {
                // console.log(`player ${playerIndex} did not draw first blood in game ${i + 1}`);
                return null;
            }
            return firstStock;
        });
        var firstBloodCount = firstBloodStocks.reduce(function (count, item) { return (item !== null ? count + 1 : count); }, 0);
        var ratio = firstBloodCount / firstBloodStocks.length;
        var simple = {
            text: isNaN(ratio) ? "N/A" : "".concat((ratio * 100).toFixed(this.recommendedRounding), "%"),
            number: ratio,
        };
        return {
            result: firstBloodStocks,
            simple: simple,
        };
    },
};
