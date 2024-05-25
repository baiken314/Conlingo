<template>
    <div class="translate-challenge">
        <h1>Translate the following:</h1>
        <!-- Prompt sentence with hover translations -->
        <div class="prompt-sentence">
            <span v-for="(tooltip, word) in hoverWords" :key="tooltip">
                <HoverWord :text="word" :tooltip-text="tooltip"/>
            </span>
        </div>
        <br/>

        <!-- Input field for user's translation -->
        <input ref="userInput" type="text" v-model="userInput" @keyup.enter="submitTranslation">

        <!-- Submit button -->
        <button @click="submitTranslation" :disabled="!userInput">Submit</button>
        <br/>
        <br/>

        <!-- Submission feedback -->
        <div v-if="showFeedback" class="feedback">
            {{ isCorrect ? 'Correct!' : `Incorrect: ${this.isTargetToNative ? this.native : this.target}` }}
        </div>
    </div>
</template>
  
<script>
import HoverWord from './HoverWord.vue';

export default {
    data() {
        return {
            isTargetToNative: true,
            target: "Ĉi tio estas frazo.",
            native: "This is a sentence.",
            hoverWords: {
                "Ĉi tio": "this",
                "estas": "(v.) to be/to exist",
                "frazo.": "sentence",
            },

            userInput: "",
            isCorrect: false,
            showFeedback: false
        };
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
            this.$refs.userInput.focus();
        }
    },
    components: {
        HoverWord
    }
};
</script>
