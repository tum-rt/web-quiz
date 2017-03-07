<template>
<div>
    <navbar>
        <div class="columns">
            <div class="column col-10">
                <div class="btn-group btn-group-block">
                    <button  v-for="(question, index) in questions" :key="index"
                        class="btn" @click="scrollTo(index)">{{ index + 1 }}</button>
                </div>
            </div>
            <div class="column col-2">
                <button class="btn float-right" @click="close">{{ $t("close") }}</button>
            </div>
        </div>
    </navbar>
    <div class="big-number">{{ correctPercent }} %</div>
    <form @submit.prevent>
        <template v-for="(question, index) in questions">
            <h3 ref="header">{{ $t("question_x_result", {num: index + 1, correct: question.correct_tasks, total: question.total_tasks }) }}</h3>
            <snippet v-for="snippet in question.content" :key="index" :snippet="snippet" />
        </template>
    </form>
</div>
</template>

<script>
declare var require: any;

const ResultSnippet = require('./ResultSnippet.vue').default;
const Navbar = require("./Navbar.vue").default;

export default {
    props: ["questions"],
    data() {
        return {};
    },
    methods: {
        close() {
            this.$emit("close");
        },
        scrollTo(index) {
            const questionHeader = this.$refs.header[index];
            const NAVBAR_HEIGHT = 60;
            document.body.scrollTop +=
                questionHeader.getBoundingClientRect().top - NAVBAR_HEIGHT;
        }
    },
    computed: {
        correctPercent() {
            const total = this.questions
            .map((q) => q.total_tasks)
            .reduce((a, b) => a + b, 0);

            const correct = this.questions
            .map((q) => q.correct_tasks)
            .reduce((a, b) => a + b, 0);

            return Math.round(correct / total * 100);
        }
    },
    components: {
        "snippet": ResultSnippet,
        "navbar": Navbar
    }
}
</script>

<style>
.big-number {
    margin: auto;
    text-align: center;
    vertical-align: middle;
    font-size: 6rem;
    display: block;
    border-radius: 1rem;
    background-color: #8A97F9;
}
</style>
