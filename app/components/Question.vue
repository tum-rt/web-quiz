<template>
<div>
    <navbar>
        <div class="columns">
            <div class="column col-10">
                <quiz-progress :max="totalNum" :value="currentNum + 1"></quiz-progress>
            </div>
            <div class="column col-2">
                <button class="btn float-right" @click="cancel">{{ $t("close") }}</button>
            </div>
        </div>
    </navbar>
    <form @submit.prevent>
        <snippet v-for="(snippet, index) in content" :key="index"
            :snippet="snippet" :index="index" @input="input" />
    </form>
    <button class="btn btn-primary btn-block" style="margin-top:3rem;" @click="submit">{{ $t("submit_answers") }}</button>
    <quiz-dialog v-show="showCancelDialog" :title="title"
        :positive-text="$t('close_quiz')" :negative-text="$t('cancel')" @click="dialogClick">
        {{ $t("close_quiz_hint") }}
    </quiz-dialog>
</div>
</template>

<script>
declare var require: any;

const Snippet = require('./Snippet.vue').default;
const Progress = require('./Progress.vue').default;
const Dialog = require("./Dialog.vue").default;
const Navbar = require("./Navbar.vue").default;

import config from "../config";

export default {
    props: ["content", "currentNum", "totalNum"],
    data() {
        return {
            title: config.title,
            answers: {},
            showCancelDialog: false
        };
    },
    methods: {
        submit() {
            this.$emit('next', this.answers);
        },
        input(index, value) {
            this.answers[index] = value;
        },
        cancel() {
            this.showCancelDialog = true;
        },
        dialogClick(type) {
            this.showCancelDialog = false;
            if(type === "positive") {
                this.$emit("cancel");
            }
        }
    },
    components: {
        "snippet": Snippet,
        "quiz-progress": Progress,
        "quiz-dialog": Dialog,
        "navbar": Navbar
    }
}
</script>
