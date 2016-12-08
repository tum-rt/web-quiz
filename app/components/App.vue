<template>
<div class="container grid-480">
<startpage v-on:start="start" v-show="showStartpage"></startpage>
<question v-on:next="next" v-if="showQuestion"
    :content="currentQuestion.content" :currentNum="currentQuestionIndex"
    :totalNum="questions.length" v-on:cancel="cancel" />
<evaluation v-if="showEvaluation" :questions="questions" @close="closeEval" />
</div>
</template>

<script>
declare var require: any;

const Startpage = require('./Startpage.vue').default;
const Question = require('./Question.vue').default;
const Evaluation = require('./Evaluation.vue').default;

export default {
    data: () => {
        return {
            showStartpage: true,
            showQuestion: false,
            showEvaluation: false,
            questions: [],
            currentQuestionIndex: 0,
            currentQuestion: []
        };
    },
    methods: {
        start: function(tags) {
            const req = new XMLHttpRequest();
            req.addEventListener("load", () => {
                this.questions = JSON.parse(req.responseText).data;
                localStorage.setItem("quiz", req.responseText);
                this.currentQuestion = this.questions[0];
                this.currentQuestionIndex = 0;
                this.allAnswers = [];
                this.showStartpage = false;
                this.showQuestion = true;
                this.scrollUp();
            });
            req.open("GET", "/api/quiz?tags=" + tags.join("|"));
            req.send();
        },
        next: function(answers) {
            // HACK: force rendering on Question component
            // first: destroy old component (via v-if)
            this.showQuestion = false;

            this.mergeAnswers(answers);

            this.$nextTick(() => { // second: wait one time slot
                this.currentQuestionIndex ++;
                if(this.currentQuestionIndex < this.questions.length) {
                    this.currentQuestion = this.questions[this.currentQuestionIndex];
                    this.showQuestion = true; // third: create new component (via v-if)
                } else {
                    console.log("show eval");
                    this.showEvaluation = true;
                }
                this.scrollUp();
            });
        },
        cancel: function() {
            this.showQuestion = false;
            this.showStartpage = true;
        },
        closeEval: function() {
            this.showEvaluation = false;
            this.showStartpage = true;
        },
        mergeAnswers: function(userAnswers) {
            let totalTasks = 0;
            let correctTasks = 0;

            this.currentQuestion.content.forEach((snippet, index) => {
                const userAnswer = userAnswers[index];

                if(snippet.task_text) {
                    const task = snippet.task_text;
                    const trimmedUserAnswer = userAnswer ? userAnswer.trim() : "";
                    task.user_answer = trimmedUserAnswer;
                    task.user_correct =
                        task.correct_answers
                        .map((answer) => answer.toLowerCase())
                        .indexOf(trimmedUserAnswer.toLowerCase()) > -1;
                    totalTasks ++;
                    correctTasks += task.user_correct ? 1 : 0;
                } else if(snippet.task_number) {
                    const task = snippet.task_number;
                    task.user_answer = userAnswer;
                    task.user_correct =
                        Math.abs(task.correct_answer - userAnswer)
                        <= task.abs_tol;
                    totalTasks ++;
                    correctTasks += task.user_correct ? 1 : 0;
                } else if(snippet.task_mc_one_correct) {
                    const task = snippet.task_mc_one_correct;
                    task.answers.forEach(
                    (answer, answerIndex) => {
                        answer.user_checked = answerIndex === userAnswer;
                        correctTasks +=
                            answer.user_checked && answer.correct ? 1 : 0;
                    });
                    totalTasks ++;
                } else if(snippet.task_mc_multiple_correct) {
                    let allAnswersCorrect = true;
                    snippet.task_mc_multiple_correct.answers.forEach(
                    (answer, answerIndex) => {
                        answer.user_checked = userAnswer &&
                            userAnswer.indexOf(answerIndex) !== -1;
                        if(answer.user_checked !== answer.correct) {
                            allAnswersCorrect = false;
                        }
                    });
                    totalTasks ++;
                    correctTasks += allAnswersCorrect ? 1 : 0;
                }
            });

            this.currentQuestion.total_tasks = totalTasks;
            this.currentQuestion.correct_tasks = correctTasks;
        },
        scrollUp: function() {
            window.scrollTo(0, 0);
        }
    },
    components: {
        'startpage': Startpage,
        'question': Question,
        'evaluation': Evaluation
    }
}
</script>
