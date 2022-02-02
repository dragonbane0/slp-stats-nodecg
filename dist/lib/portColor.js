"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPortColor = exports.PortColor = void 0;
var PortColor;
(function (PortColor) {
    PortColor["P1"] = "#f52e2e";
    PortColor["P2"] = "#5463ff";
    PortColor["P3"] = "#ffc717";
    PortColor["P4"] = "#1f9e40";
})(PortColor = exports.PortColor || (exports.PortColor = {}));
function getPortColor(portNumber) {
    switch (portNumber) {
        case 1:
            return PortColor.P1;
        case 2:
            return PortColor.P2;
        case 3:
            return PortColor.P3;
        case 4:
            return PortColor.P4;
        default:
            return PortColor.P1;
    }
}
exports.getPortColor = getPortColor;
