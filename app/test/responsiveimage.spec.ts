declare var require: any;

import Vue from "vue";
const ResponsiveImage = require("../components/ResponsiveImage.vue").default;
import { expect } from "chai";

describe("ResponsiveImage.vue", () => {
    const buildRespImg = (snippet) => {
        return new Vue({
            render: function(h) {
                return h(ResponsiveImage, { props: { snippet } });
            },
            components: { "resp-img": ResponsiveImage }
        }).$mount();
    };

    it("should render simple image", () => {
        const vm = buildRespImg("http://example.org/test.png");

        const img = <HTMLImageElement>vm.$el;
        expect(img.src).to.equal("http://example.org/test.png");
    });

    it("should render simple image with object syntax", () => {
        const vm = buildRespImg({
            src: "http://example.org/test.png"
        });

        const img = <HTMLImageElement>vm.$el;
        expect(img.src).to.equal("http://example.org/test.png");
    });

    it("should render image with srcset attribute", () => {
        const vm = buildRespImg({
            src: "http://example.org/test.png",
            srcset: {
                "http://example.org/test-small.png": "1x",
                "http://example.org/test-large.png": "2x"
            }
        });

        const img = <HTMLImageElement>vm.$el;
        expect(img.src).to.equal("http://example.org/test.png");
        expect(img.srcset).to.contain("http://example.org/test-small.png");
        expect(img.srcset).to.contain("http://example.org/test-large.png");
        expect(img.srcset).to.contain("1x");
        expect(img.srcset).to.contain("2x");
        expect(img.srcset).to.contain(",");
    });

    it("should render image with alt attribute", () => {
        const vm = buildRespImg({
            src: "http://example.org/test.png",
            alt: "Description text"
        });

        const img = <HTMLImageElement>vm.$el;
        expect(img.src).to.equal("http://example.org/test.png");
        expect(img.alt).to.equal("Description text");
    });
});
