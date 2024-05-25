<template>
    <div>
        <h1>{{ title }}</h1>
        <label for="courseName">Course Name:</label>
        <input type="text" id="courseName" v-model="courseName" required>
        <br>
        <label for="description">Description:</label>
        <textarea id="description" v-model="description" required></textarea>
        <br>
        <button type="button" @click="saveCourse">{{ course ? 'Save Course' : 'Create Course' }}</button>
        <div v-if="course">
            <ModuleList :course="course" :mode="'create'" />
        </div>
    </div>
</template>

<script>
import { toRaw } from 'vue';
import ModuleList from './ModuleList.vue';

export default {
    components: {
        ModuleList
    },
    data() {
        return {
            courseName: '',
            description: ''
        };
    },
    props: {
        course: Object
    },
    watch: {
        course: {
            immediate: true,
            handler(newValue) {
                if (newValue) {
                    this.courseName = newValue.name;
                    this.description = newValue.description;
                } else {
                    this.courseName = '';
                    this.description = '';
                }
            }
        }
    },
    computed: {
        title() {
            return this.course ? 'Edit Course' : 'Create Course';
        }
    },
    methods: {
        async saveCourse() {
            // create a new course and load it into the component
            if (!this.course) {
                const courseCreateRequest = await fetch('https://conlingo-api.cake.builders/courses', {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: this.courseName,
                        description: this.description,
                        userId: document.cookie
                    })
                });
                const course = await courseCreateRequest.json();
                console.log('Created course: ', course);
                this.$emit('update-course', course);
            }
            // save updated fields to the course
            else {
                this.course.name = this.courseName;
                this.course.description = this.description;

                console.log('Sending update course to server', toRaw(this.course));

                const courseUpdateRequest = await fetch('https://conlingo-api.cake.builders/courses/update', {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(toRaw(this.course))
                });

                const course = await courseUpdateRequest.json()
                console.log('Updated course: ', course);
                this.$emit('update-course', course);
            }
        }
    }
};
</script>