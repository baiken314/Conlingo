<template>
    <div class="section">
        <div class="level">
            <div class="level-left">
                <div class="level-item">
                    <h1 class="title">{{ title }}</h1>
                </div>
            </div>
            <div class="level-right">
                <div class="level-item">
                    <div class="buttons">
                        <button class="button is-link" @click="$emit('go-to-course-list')">
                            <span class="icon is-small">
                                <i class="fa fa-chevron-left"></i>
                            </span>
                            <span>Back</span>
                        </button>
                        <button class="button is-primary" type="button" @click="saveCourse">
                            <span class="icon is-small">
                                <i class="fa" :class="course ? 'fa-check' : 'fa-plus'"></i>
                            </span>
                            <span>{{ course ? 'Save Course' : 'Create Course' }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
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
    </div>
    <div v-if="course">
        <ModuleList 
            :course="course" 
            :mode="'create'" 
            @update-course="$emit('update-course', $event)"
            @module-clicked="$emit('module-clicked', $event)" />
    </div>
    <div v-if="course" class="section pt-0">
        <h2 class="title">Danger Zone</h2>
        <button class="button is-danger" type="button" @click="deleteCourse">
            <span class="icon is-small">
                <i class="fa fa-times-circle"></i>
            </span>
            <span>Delete Course</span>
        </button>
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
            updatedCourse: JSON.parse(JSON.stringify(this.course)) || {}
        };
    },
    props: {
        course: Object
    },
    watch: {
        course(newCourse) {
            this.updatedCourse = JSON.parse(JSON.stringify(newCourse));
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