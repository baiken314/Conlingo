<template>
    <div>
        <button @click="backToCourse">&lt; Back</button>
        <div>
            <progress :value="currentIndex + (hasResponded && isResponseCorrect ? 1 : 0)" :max="sentences.length"></progress>
            <span>{{ currentIndex  + (hasResponded && isResponseCorrect ? 1 : 0) }} / {{ sentences.length }}</span>
        </div>
        <div v-if="currentIndex < sentences.length">
            <SentenceTranslate ref="sentenceTranslate" :sentence="sentences[currentIndex]" @response="handleResponse" />
        </div>
        <button ref="nextButton" 
            @click="nextSentence" 
            v-if="currentIndex < sentences.length" 
            :hidden="!hasResponded" 
            :disabled="!hasResponded"
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
</template>

<script>
import axios from 'axios';
axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';

import SentenceTranslate from './SentenceTranslate.vue';
import { toRaw } from 'vue';

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
        lesson() {
            this.loadSentences();
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
            this.$refs.nextButton.disabled = false;
            this.$refs.nextButton.hidden = false;
            this.$refs.nextButton.focus();

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
        },
        loadSentences() {
            // Load sentences from the server
            console.log('Loading sentences for lesson:', this.lesson._id);
            let lessonId = toRaw(this.lesson)._id
            axios.get(`https://conlingo-api.cake.builders/lessons/${lessonId}/sentences`)
                .then(response => {
                    this.sentences = response.data;
                    console.log('Sentences:', this.sentences);
                })
                .catch(error => {
                    console.error('Error fetching sentences:', error);
                });
        },
        backToCourse() {
            this.$emit('back-to-course');
        }
    }
};
</script>