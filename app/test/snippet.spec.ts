declare var require: any;

import Vue from "vue";
const Snippet = require("../components/Snippet.vue").default;
import { expect } from "chai";

describe("Snippet.vue", () => {
    const buildSnippet = (snippet) => {
        return new Vue({
            render: function(h) {
                return h(Snippet, { props: { snippet }});
            },
            components: { "snippet": Snippet }
        }).$mount();
    };

    it("should render text snippet", () => {
        const vm = buildSnippet({
            text: "Karma"
        });

        expect(vm.$el.textContent.trim()).to.equal("Karma");
    });

    it("should render header1 snippet", () => {
        const vm = buildSnippet({
            header1: "Big header"
        });

        expect(vm.$el.textContent.trim()).to.equal("Big header");
    });

    it("should render header2 snippet", () => {
        const vm = buildSnippet({
            header2: "Medium header"
        });

        expect(vm.$el.textContent.trim()).to.equal("Medium header");
    });

    it("should render header3 snippet", () => {
        const vm = buildSnippet({
            header3: "Small header"
        });

        expect(vm.$el.textContent.trim()).to.equal("Small header");
    });

    it("should render image snippet", () => {
        const vm = buildSnippet({
            image: "/graph.png"
        });

        expect(vm.$el.querySelector("img")).to.not.be.null;
        expect(vm.$el.querySelector("img").src).to.contain("/graph.png");
    });

    it("should render task_text snippet", () => {
        const vm = buildSnippet({
            task_text: {
                before: "His name is ",
                after: "Mustermann",
                correct_answers: ["Max"]
            }
        });

        expect(vm.$el.querySelector("input[type=text]")).to.not.be.null;
        expect(vm.$el.textContent).to.contain("His name is");
        expect(vm.$el.textContent).to.contain("Mustermann");
    });

    it("should render task_number snippet", () => {
        const vm = buildSnippet({
            task_number: {
                before: "theta =",
                after: "Kelvin",
                correct_answer: 12,
                abs_tol: 1
            }
        });

        expect(vm.$el.querySelector("input[type=number]")).to.not.be.null;
        expect(vm.$el.textContent).to.contain("theta =");
        expect(vm.$el.textContent).to.contain("Kelvin");
    });

    it("should render task_mc_one_correct", () => {
        const vm = buildSnippet({
            task_mc_one_correct: {
                answers: [
                    { value: "A", correct: false },
                    { value: "B", correct: true },
                    { value: "C", correct: false },
                    { value: "D", correct: false }
                ]
            }
        });

        expect(vm.$el.querySelectorAll("input[type=radio]")).to.have.lengthOf(4);
        expect(vm.$el.textContent).to.contain("A");
        expect(vm.$el.textContent).to.contain("B");
        expect(vm.$el.textContent).to.contain("C");
        expect(vm.$el.textContent).to.contain("D");
    });

    it("should render task_mc_multiple_correct", () => {
        const vm = buildSnippet({
            task_mc_multiple_correct: {
                answers: [
                    { value: "12", correct: false },
                    { value: "34", correct: true },
                    { value: "56", correct: true }
                ]
            }
        });

        expect(vm.$el.querySelectorAll("input[type=checkbox]")).to.have.lengthOf(3);
        expect(vm.$el.textContent).to.contain("12");
        expect(vm.$el.textContent).to.contain("34");
        expect(vm.$el.textContent).to.contain("56");
    });
});
