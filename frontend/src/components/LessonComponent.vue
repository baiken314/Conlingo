<template>
    <div class="section container">
        <button class="button is-link" @click="$emit('back-to-course')">&lt; Back</button>
        <div class="section">
            <div>
                <progress class="progress is-primary" :value="currentIndex + (hasResponded && isResponseCorrect ? 1 : 0)" :max="sentences.length"></progress>
                <!-- <span>{{ currentIndex  + (hasResponded && isResponseCorrect ? 1 : 0) }} / {{ sentences.length }}</span> -->
            </div>
            <div v-if="currentIndex < sentences.length">
                <SentenceTranslate ref="sentenceTranslate" :sentence="sentences[currentIndex]" @response="handleResponse" />
            </div>
            <button
                v-show="hasResponded"
                ref="nextButton"  
                class="button is-link"
                @click="nextSentence"
            >Next</button>
            <div ref="results" v-if="currentIndex >= sentences.length">
                <h2>Results</h2>
                <h3>Percent correct</h3>
                <p>{{ Math.round((correctSentences.length / sentences.length) * 100) }}%</p>
                <h3>Time spent</h3>
                <p>{{ timeSpent }} seconds</p>
            </div>
            <br/>
        </div>
    </div>
</template>

<style>
    .progress::-webkit-progress-value {
        transition: width 0.5s ease;
    }

    .progress::-moz-progress-bar {
        transition: width 0.5s ease;
    }
</style>

<script>
import SentenceTranslate from './SentenceTranslate.vue';
import { nextTick, toRaw } from 'vue';

export default {
    components: {
        SentenceTranslate
    },
    props: {
        lesson: Object
    },
    data() {
        return {
            sentences: [
                {'Loading...': 'Please wait...'}
            ],

            correctSentences: [],
            incorrectSentences: [],

            currentIndex: 0,
            hasResponded: false,
            isResponseCorrect: false,

            beginTime: null,
            endTime: null,
            timeSpent: null,
        };
    },
    mounted() {
        this.beginTime = new Date();
    },
    watch: {
        async lesson() {
            let sentenceResponse = await fetch(`https://conlingo-api.cake.builders/lessons/${toRaw(this.lesson)._id}/sentences`);
            this.sentences = await sentenceResponse.json();
        },
        hasResponded(newValue) {
            console.log(newValue);
            if (newValue == true) {
                nextTick(() => {
                    this.$refs.nextButton.focus();
                });
            }
        }
    },
    methods: {
        handleResponse(isResponseCorrect) {
            // Handle the response from the SentenceTranslate component
            console.log('Response:', isResponseCorrect);
            this.isResponseCorrect = isResponseCorrect;
            let currentSentence = this.sentences[this.currentIndex];
            
            // move sentences to correct or incorrect counts
            if (!this.incorrectSentences.includes(currentSentence)) {
                if (this.isResponseCorrect) {
                    this.correctSentences.push(currentSentence);
                } else {
                    this.incorrectSentences.push(currentSentence);
                }
            }
            
            this.hasResponded = true;

            // get end time
            if (this.currentIndex + 1 === this.sentences.length) {
                this.endTime = new Date();
                this.timeSpent = Math.round((this.endTime - this.beginTime) / 1000).toString();
                console.log('Begin Time:', this.beginTime);
                console.log('End Time:', this.endTime);
                console.log('Time Spent:', this.endTime - this.beginTime);
            }
        },
        nextSentence() {
            // Move to the next sentence
            this.hasResponded = false;
            if (this.isResponseCorrect) {
                this.currentIndex++;
            } else {
                // move incorrect sentences to the end
                let incorrectSentence = this.sentences[this.currentIndex];
                this.sentences.splice(this.currentIndex, 1);
                this.sentences.push(incorrectSentence);
            }
            this.$refs.sentenceTranslate.showFeedback = false;
            this.$refs.sentenceTranslate.userInput = null;
            this.$refs.sentenceTranslate.focusUserInput();
        }
    }
};
</script>