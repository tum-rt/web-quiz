"use strict";
const widthRegex = /(width)="([0-9\.]+)ex"/;
const heightRegex = /(height)="([0-9\.]+)ex"/;
const verticalAlignRegex = /(vertical-align):\s([0-9\.\-]+)ex;/;

/**
 * Fixes length units in SVGs emitted by MathJaX.
 *
 * MathJaX uses `ex` units per default. Unfortunately,
 * this leads to compatibility problems with the Android stock browser.
 * Hence, use this function to convert `ex` into pixels.
 *
 * For more information see https://github.com/tum-rt/web-quiz/issues/17
 *
 * @param {String} svg String of SVG as emitted by Mathjax
 * @param {Number} factor Ratio between `ex` and `pixel`, usually around 10
 * @returns {String} String of SVG with fixed lengths
 */
module.exports = (svg, factor) => {
    const replaceAttributeFn = (_, attr, size) =>
        attr + '="' + Math.round(parseFloat(size) * factor) + '"';
    const replaceStyleFn = (_, key, size) =>
        key + ": " + Math.round(parseFloat(size) * factor) + ";";

    return svg
        .replace(widthRegex, replaceAttributeFn)
        .replace(heightRegex, replaceAttributeFn)
        .replace(verticalAlignRegex, replaceStyleFn);
};
