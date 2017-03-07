declare var require: any;

import Vue from "vue";
const Progress = require("../components/Progress.vue").default;
import { expect } from "chai";

describe("Progress.vue", () => {
    const buildProgress = (value, max) => {
        return new Vue({
            render: function(h) {
                return h(Progress, { props: { value, max } });
            },
            components: { "quiz-progress": Progress }
        }).$mount();
    };

    it("should render correct bar length", () => {
        const vm = buildProgress(1, 10);

        expect((<HTMLElement>vm.$el.querySelector(".progress-bar")).style.width).to.equal("10%");
    });

    it("should display current state", () => {
        const vm = buildProgress(2, 3);

        expect(vm.$el.querySelector(".progress-bar").textContent).to.contain("2 / 3");
    });
});
