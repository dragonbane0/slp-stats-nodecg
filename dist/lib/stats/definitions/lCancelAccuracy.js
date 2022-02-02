"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lCancelAccuracy = void 0;
exports.lCancelAccuracy = {
    name: "L-Cancel Accuracy",
    type: "number",
    betterDirection: "higher",
    recommendedRounding: 0,
    calculate: function (games, playerIndex) {
        var lCancelsPerGame = games.map(function (game) {
            var actionCounts = game.stats.actionCounts.find(function (counts) { return counts.playerIndex === playerIndex; });
            if (!actionCounts) {
                return {
                    success: 0,
                    fail: 0,
                };
            }
            return actionCounts.lCancelCount;
        });
        var totalLCancels = lCancelsPerGame.reduce(function (tally, val) { return ({
            success: tally.success + val.success,
            fail: tally.fail + val.fail,
        }); }, { success: 0, fail: 0 });
        var ratio = totalLCancels.success / (totalLCancels.success + totalLCancels.fail);
        return {
            result: totalLCancels,
            simple: {
                text: isNaN(ratio) ? "N/A" : "".concat((ratio * 100).toFixed(this.recommendedRounding), "%"),
                number: ratio,
            },
        };
    },
};
