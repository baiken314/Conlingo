<template>
    <div v-if="isVisible" class="course-item card is-clickable" @click="courseClicked">
        <div class="card-content">
            <div class="content">
                <div class="course-content">
                    <h4>{{ course.name }}</h4>
                    <p>{{ course.description }}</p>
                </div>
                <div class="module-count">{{ course.modules.length }} Modules</div>
                <div v-if="course.createdBy" class="module-count">Created by {{ course.createdBy.username }} </div>
            </div>
        </div>
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
    transition: background-color 0.3s ease, scale 0.3s ease;
}

.course-item:last-child {
    margin-bottom: auto;
}

.course-item:hover {
    scale: 1.025;
}

.module-count {
    font-size: 14px;
    color: #666;
}
</style>