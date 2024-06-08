<template>
    <div class="section pl-0 pr-0">
        <h1 class="title">Translate the following:</h1>
        <div class="field">
            <label class="label is-size-5">
                <span v-for="(tooltip, word) in hoverWords" :key="tooltip">
                    <HoverWord :text="word" :tooltip-text="tooltip"/>
                </span>
            </label>
            <input ref="userInput" class="input is-size-5" type="text" v-model="userInput" @keyup.enter="submitTranslation">
        </div>
        <button class="button is-primary" @click="submitTranslation" v-show="userInput && !showFeedback">Submit</button>
        <div v-if="showFeedback" class="notification feedback is-size-5" :class="{ 'is-info': isCorrect, 'is-danger': !isCorrect }">
            {{ isCorrect ? 'Correct!' : `Incorrect: ${this.isTargetToNative ? this.native : this.target}` }}
        </div>
    </div>
</template>
  
<script>
import { nextTick } from 'vue';
import HoverWord from './HoverWord.vue';

export default {
    data() {
        return {
            isTargetToNative: true,
            target: "",
            native: "",
            hoverWords: {},
            userInput: "",
            isCorrect: false,
            showFeedback: false
        };
    },
    components: {
        HoverWord
    },
    watch: {
        sentence() {
            console.log('Sentence changed:', this.sentence);
            this.target = this.sentence.cleanTargetText;
            this.native = this.sentence.cleanNativeText;
            this.hoverWords = this.sentence.targetHoverWords;
        }
    },
    props: {
        sentence: Object
    },
    methods: {
        extractLetters(str) {
            if (!str) return false;
            return str.replace(/[^a-zA-Z]/g, '').toLowerCase();
        },
        submitTranslation() {
            if (!this.userInput || this.userInput.length == 0) {
                return;
            }
            
            let acceptableAnswers = []
            if (this.isTargetToNative) {
                acceptableAnswers.push(this.extractLetters(this.native));
                if (this.sentence.acceptableNativeAnswers) {
                    for (let acceptableAnswer of this.sentence.acceptableNativeAnswers) {
                        acceptableAnswers.push(this.extractLetters(acceptableAnswer));
                    }
                }
            } else {
                acceptableAnswers.push(this.extractLetters(this.target));
                if (this.sentence.acceptableTargetAnswers) {
                    for (let acceptableAnswer of this.sentence.acceptableTargetAnswers) {
                        acceptableAnswers.push(this.extractLetters(acceptableAnswer));
                    }
                }
            }

            this.isCorrect = false;
            for (let acceptableAnswer of acceptableAnswers) {
                if (this.extractLetters(this.userInput) === acceptableAnswer) {
                    this.isCorrect = true;
                    break;
                }
            }

            this.showFeedback = true;
            this.$emit("response", this.isCorrect);
        },
        focusUserInput() {
            nextTick(() => {
                this.$refs.userInput.focus();
            });
        }
    }
};
</script>
