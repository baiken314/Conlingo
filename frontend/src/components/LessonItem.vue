<template>
    <div class="block box" @click="$emit('lesson-clicked', lesson)">
        <div class="level">
            <div class="level-left">
                <div class="level-item">
                    <div class="content">
                        <h4 class="title is-4">Lesson {{ index + 1 }}</h4>
                    </div>
                    
                </div>
            </div>
            <div class="level-right">
                <div class="level-item">
                    <button class="button is-danger is-small">
                        <span class="icon is-small">
                            <i class="fa fa-times-circle"></i>
                        </span>
                    </button>
                </div>
            </div>
        </div>
        <div class="level is-mobile block mb-1">
            <div class="level-left">
                <div class="level-item">
                    <div class="content">
                        <h6 class="title is-6">Keywords</h6>
                    </div>
                </div>
                <div class="level-item">
                    <button class="button is-primary is-small" @click="onAddKeyword">
                        <span class="icon is-small">
                            <i class="fa fa-plus"></i>
                        </span>
                    </button>
                </div>
            </div>
        </div>
        <div v-if="!lesson.keywords.length">
            <p>No keywords. Click the <i class="fa fa-plus"></i> to add more.</p>
        </div>
        <div class="level is-mobile mt-3 mb-1">
            <div class="level-left">
                <div class="level-item">
                    <div class="content">
                        <h6 class="title is-6">Sentences</h6>
                    </div>
                </div>
                <div class="level-item">
                    <button class="button is-primary is-small" @click="onAddSentence">
                        <span class="icon is-small">
                            <i class="fa fa-plus"></i>
                        </span>
                    </button>
                </div>
            </div>
        </div>
        <div v-if="!lesson.sentences.length">
            <p>No sentences. Click the <i class="fa fa-plus"></i> to add more.</p>
        </div>
        <div v-else>
            <SentenceItem 
                v-for="sentence in sentences"
                :key="sentence._id"
                :course="course"
                :module="module"
                :lesson="lesson"
                :sentence="sentence"
                :entries="entries"
                @update-course="loadSentences(); $emit('update-course', $event)" />
        </div>
    </div>
</template>

<script>
import SentenceItem from './SentenceItem.vue'

export default {
    components: {
        SentenceItem
    },
    props: {
        course: Object,
        module: Object,
        lesson: Object,
        index: Number,
        entries: Array[Object]
    },
    data() {
        return {
            sentences: []
        }
    },
    mounted() {
        this.loadSentences();
    },
    methods: {
        async loadSentences() {
            let sentenceResponse = await fetch(`https://conlingo-api.cake.builders/lessons/${this.lesson._id}/sentences`);
            this.sentences = await sentenceResponse.json();
        },
        async onAddKeyword() {

        },
        async onAddSentence() {

        }
    }
}
</script>