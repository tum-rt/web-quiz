/* eslint-env mocha */
const expect = require("chai").expect;
const fixSvgSize = require("../svg-size-fix");

describe("svg-size-fix", () => {
    it("should remove ex unit", () => {
        const input = `
            <svg xmlns:xlink="http://www.w3.org/1999/xlink"
            width="8.9ex" height="2.6ex"
            style="vertical-align: -0.338ex;" viewBox="0 -1006.6 3864.5 1152.1"
            role="img" focusable="false" xmlns="http://www.w3.org/2000/svg">
            <path stroke-width="1" d="M492 213Z"></path>
            <path width="12ex"></path>
            </svg>`;

        const EX_IN_PIXEL = 10;
        const output = fixSvgSize(input, EX_IN_PIXEL);

        expect(output).to.contain('width="89"');
        expect(output).to.contain('height="26"');
        expect(output).to.contain("vertical-align: -3;");
        expect(output).to.contain('width="12ex"',
            "preserve equally named attributes");
        expect(output).to.contain('stroke-width="1"',
            "preserve similar named attributes");
    });
});
