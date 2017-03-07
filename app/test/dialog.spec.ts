declare var require: any;

import Vue from "vue";
const Dialog = require("../components/Dialog.vue").default;
import { expect } from "chai";

describe("Dialog.vue", () => {
    it("should render correct contents", () => {
        const vm = new Vue({
            render: function(h) {
                return h(Dialog, {
                    props: {
                        title: "Karma",
                        positiveText: "OK",
                        negativeText: "Cancel"
                    }
                }, [
                    h("span", "Close this chapter?")
                ]);
            },
            components: { "quiz-dialog": Dialog }
        }).$mount();
        expect(vm.$el.querySelector(".modal-title").textContent).to.equal("Karma");
        expect(vm.$el.querySelector("button:not(.btn-primary)").textContent).to.equal("Cancel");
        expect(vm.$el.querySelector("button.btn-primary").textContent).to.equal("OK");
        expect(vm.$el.querySelector(".modal-body").textContent).to.equal("Close this chapter?");
    });

    it("should forward positive button click", (done) => {
        const vm = new Vue({
            render: function(h) {
                return h(Dialog, {
                    props: {
                        positiveText: "OK"
                    },
                    on: {
                        click: (option) => {
                            expect(option).to.equal("positive");
                            done();
                        }
                    }
                });
            },
            components: { "quiz-dialog": Dialog }
        }).$mount();

        (<HTMLElement>vm.$el.querySelector("button.btn-primary")).click();
    });

    it("should forward negative button click", (done) => {
        const vm = new Vue({
            render: function(h) {
                return h(Dialog, {
                    props: {
                        negativeText: "Cancel"
                    },
                    on: {
                        click: (option) => {
                            expect(option).to.equal("negative");
                            done();
                        }
                    }
                });
            },
            components: { "quiz-dialog": Dialog }
        }).$mount();

        (<HTMLElement>vm.$el.querySelector("button:not(.btn-primary)")).click();
    });

    it("should trigger negative action when clicking overlay", (done) => {
        const vm = new Vue({
            render: function(h) {
                return h(Dialog, {
                    on: {
                        click: (option) => {
                            expect(option).to.equal("negative");
                            done();
                        }
                    }
                });
            },
            components: { "quiz-dialog": Dialog }
        }).$mount();

        (<HTMLElement>vm.$el.querySelector(".modal-overlay")).click();
    });
});
