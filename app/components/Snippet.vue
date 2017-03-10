<template>
<div>
    <div v-if="snippet.text" class="form-group mt-10">
        <label class="form-label"><fl-text :value="snippet.text" /></label>
    </div>
    <h4 v-if="snippet.header1">
        <fl-text :value="snippet.header1" />
    </h4>
    <h5 v-if="snippet.header2">
        <fl-text :value="snippet.header2" />
    </h5>
    <h6 v-if="snippet.header3">
        <fl-text :value="snippet.header3" />
    </h6>
    <div v-if="snippet === 'separator'" class="divider"></div>
    <resp-img v-if="snippet.image" :snippet="snippet.image" />
    <div v-if="snippet.hint" class="hint">
        <button v-show="!showHint" class="btn btn-block" @click="triggerHint">{{ $t("show_hint") }}</button>
        <span v-show="showHint" class="toast">
            <fl-text :value="snippet.hint" />
        </span>
    </div>
    <div v-if="snippet.task_text" class="input-group">
        <fl-text v-if="snippet.task_text.before"
            :value="snippet.task_text.before" clazz="input-group-addon" />
        <input type="text" class="form-input" v-model="taskText">
        <fl-text v-if="snippet.task_text.after"
            :value="snippet.task_text.after" clazz="input-group-addon" />
    </div>
    <div v-if="snippet.task_number" class="input-group">
        <fl-text v-if="snippet.task_number.before"
            :value="snippet.task_number.before" clazz="input-group-addon" />
        <input type="number" class="form-input" v-model="taskNumber">
        <fl-text v-if="snippet.task_number.after"
            :value="snippet.task_number.after" clazz="input-group-addon" />
    </div>
    <template v-if="snippet.task_mc_multiple_correct">
        <div v-for="(answer, answerIndex) in snippet.task_mc_multiple_correct.answers"
            class="form-group">
            <label class="form-checkbox quiz-answer-box" :class="{'quiz-answer-box-highlight': taskMCMultiple.indexOf(answerIndex) >= 0}">
                <i class="icon-check-square-o" v-if="taskMCMultiple.indexOf(answerIndex) >= 0"></i>
                <i class="icon-square-o" v-else></i>
                <input type="checkbox" v-model="taskMCMultiple" :value="answerIndex">
                <fl-text :value="answer.value" />
            </label>
        </div>
    </template>
    <template v-if="snippet.task_mc_one_correct">
        <div v-for="(answer, answerIndex) in snippet.task_mc_one_correct.answers"
            class="form-group">
            <label class="form-radio quiz-answer-box" :class="{'quiz-answer-box-highlight': taskMCOne === answerIndex}">
                <input type="radio" :name="index" :value="answerIndex" v-model="taskMCOne">
                <i class="icon-dot-circle-o" v-if="taskMCOne == answerIndex"></i>
                <i class="icon-circle-o" v-else></i>
                <fl-text :value="answer.value" />
            </label>
        </div>
    </template>
</div>
</template>

<script>
declare var require: any;

const FlavoredText = require("./FlavoredText.vue").default;
const ResponsiveImage = require("./ResponsiveImage.vue").default;

export default {
    data() {
        return {
            taskMCOne: undefined,
            taskMCMultiple: [],
            taskNumber: "",
            taskText: "",
            showHint: false
        };
    },
    props: ["snippet", "index"],
    methods: {
        triggerHint() {
            this.showHint = true;
        }
    },
    watch: {
        taskMCOne() {
            this.$emit("input", this.index, this.taskMCOne);
        },
        taskMCMultiple() {
            this.$emit("input", this.index, this.taskMCMultiple);
        },
        taskNumber() {
            this.$emit("input", this.index, this.taskNumber);
        },
        taskText() {
            this.$emit("input", this.index, this.taskText);
        }
    },
    components: {
        "fl-text": FlavoredText,
        "resp-img": ResponsiveImage
    }
}
</script>
