<template>
    <div class="box" @click="isActive = !isActive">
        <p><strong>{{ sentence.cleanTargetText }}</strong></p>
        <p>{{ sentence.cleanNativeText }}</p>
    </div>
    <div class="modal" :class="{ 'is-active': isActive }" style="overflow: visible;">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Edit sentence</p>
                <button class="delete" aria-label="close" @click="isActive = false"></button>
            </header>
            <section class="modal-card-body">
                <div class="field">
                    <label class="label">Target sentence</label>
                    <textarea class="textarea" placeholder="Target sentence here" v-model="updatedSentence.targetText" rows="2"></textarea>
                </div>
                <label class="label is-size-5">
                    <HoverWord v-for="(tooltip, word) in sentence.targetHoverWords" :key="tooltip" :text="word" :tooltip-text="tooltip"/>
                </label>
                <div class="field">
                    <label class="label">Native sentence</label>
                    <textarea class="textarea" placeholder="Native sentence here" v-model="updatedSentence.nativeText" rows="2"></textarea>
                </div>
                <label class="label is-size-5">
                    <HoverWord v-for="(tooltip, word) in sentence.nativeHoverWords" :key="tooltip" :text="word" :tooltip-text="tooltip"/>
                </label>
            </section>
            <footer class="modal-card-foot">
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <div class="buttons">
                                <button class="button is-success" @click="onSaveChanges">Save changes</button>
                                <button class="button" @click="isActive = false">Close</button>
                            </div>
                        </div>
                    </div>
                    <div class="level-right">
                        <div class="level-item">
                            <button class="button is-danger">Delete</button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    </div>
</template>

<script>
import HoverWord from './HoverWord.vue';

export default {
    components: {
        HoverWord
    },
    emits: ['update-course'],
    props: {
        course: Object,
        module: Object,
        lesson: Object,
        sentence: Object,
        entries: Array[Object]
    },
    data() {
        return {
            isActive: false,
            updatedSentence: JSON.parse(JSON.stringify(this.sentence)) || {},
            targetHoverWords: {},
            nativeHoverWords: {}
        }
    },
    mounted() {
        this.updatedSentence = JSON.parse(JSON.stringify(this.sentence));
    },
    methods: {
        async onSaveChanges() {
            console.log('PUT: ', `https://conlingo-api.cake.builders/sentences/${this.sentence._id}`);
            const sentenceUpdateRequest = await fetch(`https://conlingo-api.cake.builders/sentences/${this.sentence._id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.updatedSentence)
            });
            this.updatedSentence = await sentenceUpdateRequest.json();
            this.$emit('update-course', this.course);
        }
    }
}
</script>