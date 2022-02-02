"use strict";
/* eslint-disable */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.damageDone = exports.averageKillPercent = exports.inputsPerMinute = exports.lateDeaths = exports.earlyKills = exports.neutralWins = exports.damagePerOpening = exports.openingsPerKill = void 0;
/*
 * Taken from: https://github.com/project-slippi/slippi-set-stats/blob/master/main.js
 */
var _ = require("lodash");
__exportStar(require("./firstBlood"), exports);
__exportStar(require("./lCancelAccuracy"), exports);
__exportStar(require("./neutralOpenerMoves"), exports);
__exportStar(require("./killMoves"), exports);
__exportStar(require("./selfDestructs"), exports);
__exportStar(require("./highestDamagePunish"), exports);
exports.openingsPerKill = {
    name: "Openings / Kill",
    type: "number",
    betterDirection: "lower",
    recommendedRounding: 1,
    calculate: function (games, playerIndex) {
        return genOverallRatioStat(games, playerIndex, "openingsPerKill", this.recommendedRounding);
    },
};
exports.damagePerOpening = {
    name: "Damage / Opening",
    type: "number",
    betterDirection: "higher",
    recommendedRounding: 1,
    calculate: function (games, playerIndex) {
        return genOverallRatioStat(games, playerIndex, "damagePerOpening", this.recommendedRounding);
    },
};
exports.neutralWins = {
    name: "Neutral Wins",
    type: "number",
    betterDirection: "higher",
    recommendedRounding: 0,
    calculate: function (games, playerIndex) {
        return genOverallRatioStat(games, playerIndex, "neutralWinRatio", this.recommendedRounding, "count");
    },
};
exports.earlyKills = {
    name: "Earliest Kill",
    type: "number",
    betterDirection: "lower",
    recommendedRounding: 1,
    calculate: function (games, playerIndex) {
        var oppStocks = _.flatMap(games, function (game) {
            var stocks = _.get(game, ["stats", "stocks"]) || [];
            return _.filter(stocks, function (stock) {
                var isOpp = stock.playerIndex !== playerIndex;
                var hasEndPercent = stock.endPercent !== null;
                return isOpp && hasEndPercent;
            });
        });
        var orderedOppStocks = _.orderBy(oppStocks, ["endPercent"], ["asc"]);
        var earliestKillStock = _.first(orderedOppStocks);
        var simple = {
            text: "N/A",
            number: null,
        };
        if (earliestKillStock) {
            simple.number = earliestKillStock.endPercent;
            simple.text = simple.number.toFixed(this.recommendedRounding);
        }
        return {
            result: _.take(orderedOppStocks, 5),
            simple: simple,
        };
    },
};
exports.lateDeaths = {
    name: "Latest Death",
    type: "number",
    betterDirection: "higher",
    recommendedRounding: 0,
    calculate: function (games, playerIndex) {
        var playerStocks = _.flatMap(games, function (game) {
            var stocks = _.get(game, ["stats", "stocks"]) || [];
            return _.filter(stocks, function (stock) {
                var isPlayer = stock.playerIndex === playerIndex;
                var hasEndPercent = stock.endPercent !== null;
                return isPlayer && hasEndPercent;
            });
        });
        var orderedPlayerStocks = _.orderBy(playerStocks, ["endPercent"], ["desc"]);
        var latestDeathStock = _.first(orderedPlayerStocks);
        var simple = {
            text: "N/A",
            number: null,
        };
        if (latestDeathStock) {
            simple.number = latestDeathStock.endPercent;
            simple.text = simple.number.toFixed(this.recommendedRounding);
        }
        return {
            result: _.take(orderedPlayerStocks, 5),
            simple: simple,
        };
    },
};
exports.inputsPerMinute = {
    name: "Inputs / Minute",
    type: "number",
    betterDirection: "higher",
    recommendedRounding: 0,
    calculate: function (games, playerIndex) {
        return genOverallRatioStat(games, playerIndex, "inputsPerMinute", this.recommendedRounding);
    },
};
exports.averageKillPercent = {
    name: "Average Kill Percent",
    type: "number",
    betterDirection: "lower",
    recommendedRounding: 0,
    calculate: function (games, playerIndex) {
        var oppStocks = _.flatMap(games, function (game) {
            var stocks = _.get(game, ["stats", "stocks"]) || [];
            return _.filter(stocks, function (stock) {
                var isOpp = stock.playerIndex !== playerIndex;
                var hasEndPercent = stock.endPercent !== null;
                return isOpp && hasEndPercent;
            });
        });
        var result = {
            total: oppStocks.length,
            count: _.sumBy(oppStocks, "endPercent") || 0,
        };
        result.ratio = result.total ? result.count / result.total : null;
        return {
            result: result,
            simple: genSimpleFromRatio(result, this.recommendedRounding),
        };
    },
};
exports.damageDone = {
    name: "Total Damage Done",
    type: "number",
    betterDirection: "higher",
    recommendedRounding: 0,
    calculate: function (games, playerIndex) {
        return genOverallRatioStat(games, playerIndex, "damagePerOpening", this.recommendedRounding, "count");
    },
};
function genOverallRatioStat(games, playerIndex, field, fixedNum, type) {
    if (type === void 0) { type = "ratio"; }
    var statRatios = _.map(games, function (game) {
        var overallStats = _.get(game, ["stats", "overall"]);
        var overallStatsByPlayer = _.keyBy(overallStats, "playerIndex");
        var overallStatsForPlayer = overallStatsByPlayer[playerIndex];
        return overallStatsForPlayer[field];
    });
    var avg = averageRatios(statRatios);
    var simple = genSimpleFromRatio(avg, fixedNum, type);
    return {
        result: avg,
        simple: simple,
    };
}
function averageRatios(ratios) {
    var result = {};
    result.count = _.sumBy(ratios, "count") || 0;
    result.total = _.sumBy(ratios, "total") || 0;
    result.ratio = result.total ? result.count / result.total : null;
    return result;
}
function genSimpleFromRatio(ratio, fixedNum, type) {
    if (type === void 0) { type = "ratio"; }
    var result = {};
    switch (type) {
        case "ratio":
            result.number = ratio.ratio;
            result.text = ratio.ratio !== null ? ratio.ratio.toFixed(fixedNum) : "N/A";
            break;
        case "count":
            result.number = ratio.count;
            result.text = ratio.count.toFixed(fixedNum);
            break;
    }
    return result;
}
