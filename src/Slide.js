"use strict";
exports.__esModule = true;
var Slide = /** @class */ (function () {
    function Slide(container, elements, controls, time) {
        if (time === void 0) { time = 5000; }
        this.container = container;
        this.elements = elements;
        this.controls = controls;
        this.time = time;
    }
    return Slide;
}());
exports["default"] = Slide;
