<template>
<div class="input-group">
    <span v-if="snippet.before" class="input-group-addon">
        <fl-text :value="snippet.before" />
    </span>
    <input readonly :value="snippet.user_answer" class="form-input"
        :style="style"/>
    <input readonly :value="answer" class="form-input"
        v-if="!snippet.user_correct" />
    <span v-if="snippet.after" class="input-group-addon">
        <fl-text :value="snippet.after" />
    </span>
</div>
</template>

<script>
declare var require: any;

const FlavoredText = require("./FlavoredText.vue").default;

export default {
    props: ["snippet"],
    computed: {
        style: function() {
            return {
                "background-color": this.snippet.user_correct ?
                    "#8A97F9" : "#FFA500"
            };
        },
        answer: function() {
            return this.snippet.correct_answer ?
                this.snippet.correct_answer : this.snippet.correct_answers[0];
        }
    },
    components: {
        "fl-text": FlavoredText
    },
}
</script>
