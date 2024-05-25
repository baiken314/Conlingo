<template>
    <div class="course-list">
        <h1>{{ title }}</h1>
        <div v-if="courses.length === 0">No courses available</div>
        <div v-if="mode == 'create'">
            <button v-if="mode === 'create'" @click="handleCreateCourse">Create Course</button>
            <br><br>
        </div>
        <div>
            <CourseItem 
                v-for="course in courses" 
                :key="course._id" 
                :course="course" 
                :mode="mode"
                @course-clicked="handleCourseClicked" />
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
            if (this.mode == 'create') {
                return 'Edit your courses';
            } else {
                return 'Course list';
            }
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