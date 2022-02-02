"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.highDamagePunishes = void 0;
var exists_1 = require("../../exists");
var lodash_1 = __importDefault(require("lodash"));
exports.highDamagePunishes = {
    name: "Highest Damage Punish",
    type: "number",
    betterDirection: "higher",
    recommendedRounding: 1,
    calculate: function (games, playerIndex) {
        var punishes = lodash_1.default.flatMap(games, function (game) {
            var conversions = lodash_1.default.get(game, ["stats", "conversions"]) || [];
            return lodash_1.default.filter(conversions, function (conversion) {
                var isForPlayer = conversion.playerIndex !== playerIndex;
                var hasEndPercent = conversion.endPercent !== null;
                return isForPlayer && hasEndPercent;
            });
        });
        var getDamageDone = function (punish) {
            if ((0, exists_1.exists)(punish.endPercent)) {
                return punish.endPercent - punish.startPercent;
            }
            return 0;
        };
        var orderedPunishes = lodash_1.default.orderBy(punishes, [getDamageDone], "desc");
        var topPunish = lodash_1.default.first(orderedPunishes);
        var simple = {
            text: "N/A",
            number: null,
        };
        if (topPunish) {
            simple.number = getDamageDone(topPunish);
            simple.text = simple.number.toFixed(this.recommendedRounding);
        }
        return {
            result: lodash_1.default.take(orderedPunishes, 5),
            simple: simple,
        };
    },
};
