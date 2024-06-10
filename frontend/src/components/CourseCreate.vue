<template>
    <div class="section">
        <h1 class="title">{{ title }}</h1>
        <div class="field">
            <label class="label" for="courseName">Course Name:</label>
            <div class="control">
                <input class="input" type="text" id="courseName" v-model="updatedCourse.name" required>
            </div>
        </div>
        <div class="field">
            <label class="label" for="description">Description:</label>
            <div class="control">
                <textarea class="textarea" id="description" v-model="updatedCourse.description" required></textarea>
            </div>
        </div>
        <button class="button is-primary" type="button" @click="saveCourse">{{ course ? 'Save Course' : 'Create Course' }}</button>
    </div>
    <div v-if="course">
        <ModuleList 
            :course="course" 
            :mode="'create'" 
            :modules="modules" 
            @update-course="$emit('update-course', $event)"
            @module-clicked="$emit('module-clicked', $event)" />
    </div>
    <div class="section pt-0">
        <h2>Danger Zone</h2>
        <button class="button is-danger" type="button" @click="deleteCourse">Delete Course</button>
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
            updatedCourse: this.course || {}
        };
    },
    props: {
        course: Object,
        modules: Array[Object]
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
            return this.course ? `Edit Course - ${this.course.name}` : 'Create Course';
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
                        name: this.updatedCourse.name,
                        description: this.updatedCourse.description,
                        userId: document.cookie
                    })
                });

                const course = await courseCreateRequest.json();
                console.log('Created course: ', course);
                this.$emit('update-course', course);
            }
            // save updated fields to the course
            else {
                const courseUpdateRequest = await fetch('https://conlingo-api.cake.builders/courses/update', {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(toRaw(this.updatedCourse))
                });

                const course = await courseUpdateRequest.json()
                console.log('Updated course: ', course);
                this.$emit('update-course', course);
            }
        },
        async deleteCourse() {
            if (confirm('Are you sure you want to delete this course?') == false) return;

            await fetch(`https://conlingo-api.cake.builders/courses/${this.course._id}`, {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                }
            });

            this.$emit('delete-course');
        }
    }
};
</script>