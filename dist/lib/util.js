"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorder = exports.convertFrameCountToDurationString = void 0;
var moment_1 = __importDefault(require("moment"));
function convertFrameCountToDurationString(frameCount) {
    // Enforce positive numbers only
    var totalFrames = Math.max(frameCount, 0);
    var duration = moment_1.default.duration(totalFrames / 60, "seconds");
    return moment_1.default.utc(duration.as("milliseconds")).format("m:ss");
}
exports.convertFrameCountToDurationString = convertFrameCountToDurationString;
function reorder(list, startIndex, endIndex) {
    var result = Array.from(list);
    var removed = result.splice(startIndex, 1)[0];
    result.splice(endIndex, 0, removed);
    return result;
}
exports.reorder = reorder;
