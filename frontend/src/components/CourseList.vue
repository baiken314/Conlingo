<template>
    <div class="section">
        <div class="level">
            <div class="level-left">
                <div class="level-item">
                    <h1 class="title">{{ title }}</h1>
                </div>
            </div>
            <div v-if="mode == 'create'" class="level-right">
                <div class="level-item">
                    <button class="button is-primary" @click="handleCreateCourse">
                        <span class="icon is-small">
                            <i class="fa fa-plus"></i>
                        </span>
                        <span>Create Course</span>
                    </button>
                </div>
            </div>
        </div>
        <div v-if="courses.length === 0">No courses available.</div>
        <div class="fixed-grid has-3-cols has-1-cols-mobile">
            <div class="grid">
                <CourseItem 
                    v-for="course in courses" 
                    class="cell is-col-min-4"
                    :key="course._id" 
                    :course="course" 
                    :mode="mode"
                    @course-clicked="handleCourseClicked" />
            </div>
        </div>
    </div>
</template>

<script>
import CourseItem from './CourseItem.vue';

export default {
    components: {
        CourseItem
    },
    props: {
        courses: Array,
        mode: String
    },
    computed: {
        title() {
            return this.mode == 'create' ? 'Edit your courses' : 'Courses';
        }
    },
    methods: {
        handleCourseClicked(course) {
            if (this.mode == 'learn') {
                this.$emit('course-clicked', course);
            } else if (this.mode == 'create') {
                this.$emit('go-to-course-create', course);    
            }
        },
        handleCreateCourse() {
            this.$emit('go-to-course-create', null);
        }
    }
};
</script>