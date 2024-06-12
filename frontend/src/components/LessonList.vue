<template>
    <div class="level">
        <div class="level-left">
            <div class="level-item">
                <h2 class="title">Lessons</h2>
            </div>
        </div>
        <div class="level-right">
            <div class="level-item">
                <button class="button is-primary" @click="onCreateLesson">
                    <span class="icon is-small">
                        <i class="fa fa-plus"></i>
                    </span>
                    <span>Create Lesson</span>
                </button>
            </div>
        </div>
    </div>
    <LessonItem 
        v-for="(lesson, index) in module.lessons"
            :key="index"
            :index="index"
            :course="course"
            :module="module"
            :lesson="lesson"
            :entries="entries"
            @update-course="$emit('update-course', $event)" />
</template>

<script>
import LessonItem from './LessonItem.vue';

export default {
    components: {
        LessonItem
    },
    props: {
        course: Object,
        module: Object,
        entries: Array[Object]
    },
    methods: {
        async onCreateLesson() {
            const lessonCreateRequest = await fetch(`https://conlingo-api.cake.builders/modules/${this.module._id}/addLesson`, { method: 'POST' });
            const lessonCreateResponse = await lessonCreateRequest.json();
            this.$emit('update-course', this.course);
            console.log('LessonList update-course emit', lessonCreateResponse);
        }
    }
}
</script>