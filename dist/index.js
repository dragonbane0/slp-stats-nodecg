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
exports.computeSlpStats = void 0;
var readFile_1 = require("./lib/readFile");
var stats_1 = require("./lib/stats");
var types_1 = require("./lib/stats/types");
var ALL_STATS = [
    types_1.Stat.INPUTS_PER_MINUTE,
    types_1.Stat.DAMAGE_PER_OPENING,
    types_1.Stat.OPENINGS_PER_KILL,
    types_1.Stat.DAMAGE_DONE,
    types_1.Stat.AVG_KILL_PERCENT,
    types_1.Stat.NEUTRAL_WINS,
    types_1.Stat.L_CANCEL,
    types_1.Stat.FIRST_BLOOD,
    types_1.Stat.EARLY_KILLS,
    types_1.Stat.LATE_DEATHS,
    types_1.Stat.SELF_DESTRUCTS,
    types_1.Stat.HIGH_DAMAGE_PUNISHES,
];
var DEFAULT_STATS = [types_1.Stat.OPENINGS_PER_KILL, types_1.Stat.DAMAGE_DONE, types_1.Stat.AVG_KILL_PERCENT, types_1.Stat.NEUTRAL_WINS];
var getDefaultStats = function (extraStats) {
    if (extraStats === void 0) { extraStats = []; }
    var allStats = __spreadArray(__spreadArray([], DEFAULT_STATS, true), extraStats, true);
    var current = allStats.map(function (s) { return ({
        statId: s,
        enabled: true,
    }); });
    return validateStatOptions(current);
};
var validateStatOptions = function (current) {
    var newItems = ALL_STATS.filter(function (statId) { return !current.find(function (option) { return option.statId === statId; }); }).map(function (statId) { return ({ statId: statId, enabled: false }); });
    // Make sure the ones we're showing are supported
    var currentItems = current.filter(function (c) { return ALL_STATS.includes(c.statId); });
    return __spreadArray(__spreadArray([], currentItems, true), newItems, true);
};
var generateStatsList = function (options) {
    var statsList = options.filter(function (s) { return s.enabled; }).map(function (s) { return s.statId; });
    return __spreadArray([types_1.Stat.KILL_MOVES, types_1.Stat.NEUTRAL_OPENER_MOVES, ""], statsList, true);
};
function computeSlpStats(files, statKeys) {
    if (statKeys === void 0) { statKeys = []; }
    var defaultStats = getDefaultStats(statKeys);
    var statOptions = defaultStats;
    try {
        var data = [];
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var filePath = files_1[_i];
            var details = (0, readFile_1.readFileAsGameDetails)(filePath);
            data.push({ filename: filePath, details: details });
        }
        var gameDetails = data.filter(function (f) { return f.details !== null; }).map(function (f) { return f.details; });
        var params = (0, stats_1.generateStatParams)(gameDetails, generateStatsList(statOptions));
        return params;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}
exports.computeSlpStats = computeSlpStats;
