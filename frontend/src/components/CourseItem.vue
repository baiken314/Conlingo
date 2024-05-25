<template>
    <div v-if="isVisible" class="course-item" @click="courseClicked">
        <div class="course-content">
            <h2>{{ course.name }}</h2>
            <div v-html="course.description"></div>
        </div>
        <div class="module-count">{{ course.modules.length }} Modules</div>
        <div v-if="course.createdBy" class="module-count">Created by {{ course.createdBy.username }} </div>
    </div>
</template>

<script>
    export default {
        props: {
            course: Object,
            mode: String
        },
        computed: {
            isVisible() {
                return this.mode == 'learn' || (this.course && this.course.createdBy && this.course.createdBy._id == document.cookie);
            }
        },
        methods: {
            courseClicked() {
                this.$emit('course-clicked', this.course);
            },
        },
    };
</script>

<style scoped>
.course-item {
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    transition: background-color 0.3s ease;
    width: 300px; /* Adjust the width as needed */
    margin: 0 auto; /* Center the cards horizontally */
    margin-bottom: 10px;
}

.course-item:hover {
    background-color: #f0f0f0;    
}

.course-content {
    margin-bottom: 5px;
}

.module-count {
    font-size: 14px;
    color: #666;
}
</style>