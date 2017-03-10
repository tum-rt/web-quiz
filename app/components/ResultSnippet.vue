<template>
<div>
    <div v-if="snippet.text" class="form-group mt-10">
        <label class="form-label"><fl-text :value="snippet.text" /></label>
    </div>
    <div v-if="snippet.afterword" class="form-group mt-10">
        <div class="toast toast-primary"><fl-text :value="snippet.afterword" /></div>
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
    <div v-if="snippet.hint" class="toast">
        <fl-text :value="snippet.hint" />
    </div>
    <text-answer v-if="snippet.task_text" :snippet="snippet.task_text" />
    <text-answer v-if="snippet.task_number" :snippet="snippet.task_number" />
    <template v-if="snippet.task_mc_multiple_correct">
        <template v-for="answer in snippet.task_mc_multiple_correct.answers">
            <mc-answer :answer="answer" type="checkbox" />
        </template>
    </template>
    <template v-if="snippet.task_mc_one_correct">
        <template v-for="answer in snippet.task_mc_one_correct.answers">
            <mc-answer :answer="answer" type="radio" />
        </template>
    </template>
</div>
</template>

<script>
declare var require: any;

const FlavoredText = require("./FlavoredText.vue").default;
const MCAnswer = require("./ResultMCAnswer.vue").default;
const TextAnswer = require("./ResultTextAnswer.vue").default;
const ResponsiveImage = require("./ResponsiveImage.vue").default;

export default {
    props: ["snippet"],
    components: {
        "fl-text": FlavoredText,
        "mc-answer": MCAnswer,
        "text-answer": TextAnswer,
        "resp-img": ResponsiveImage
    }
}
</script>
