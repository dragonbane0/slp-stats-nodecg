"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findWinner = void 0;
/**
 * Given the last frame of the game, determine the winner first based on stock count
 * then based on remaining percent.
 * If percents are tied, return the player with the lower port number by default.
 *
 * @returns the player index of the winner
 */
var findWinner = function (lastFrame) {
    var postFrameEntries = Object.keys(lastFrame.players).map(function (i) { return lastFrame.players[i].post; });
    var winnerPostFrame = postFrameEntries.reduce(function (a, b) {
        // Determine winner based on stock count
        if (a.stocksRemaining > b.stocksRemaining) {
            return a;
        }
        if (a.stocksRemaining < b.stocksRemaining) {
            return b;
        }
        // Stocks are the same so determine winner based off remaining percent
        if (a.percent < b.percent) {
            return a;
        }
        if (a.percent > b.percent) {
            return b;
        }
        // Just return a by default
        return a;
    });
    return winnerPostFrame.playerIndex;
};
exports.findWinner = findWinner;
