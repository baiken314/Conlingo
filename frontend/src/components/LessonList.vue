<template>
    <h2 class="title">Lessons</h2>
    <LessonItem 
        v-for="(lesson, index) in module.lessons"
        :key="index"
        :lesson="lesson" />
</template>

<script>
import LessonItem from './LessonItem.vue';

export default {
    components: {
        LessonItem
    },
    props: {
        course: Object,
        module: Object
    }
}
</script>