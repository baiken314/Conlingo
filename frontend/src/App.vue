<template>
    <div id="app">
        <p><i>Conlingo TEST</i></p>
        <UserLogin v-if="!user" :user="user" @user-update="handleUserUpdate" />
        <div v-if="user">
            <UserInfo v-if="user" :user="user" 
                @go-to-learn="mode = 'learn'; goToCourseList()"
                @go-to-create="mode = 'create'; goToCourseList()"
                @user-update="handleUserUpdate"/>
            <CourseList 
                v-if="state == 'courseList'" 
                :courses="courses" 
                :mode="mode" 
                @course-clicked="handleCourseClicked"
                @go-to-course-create="goToCourseCreate" />
            <ModuleList v-if="state == 'moduleList'" :course="selectedCourse" 
                @go-to-course-list="goToCourseList"
                @module-clicked="handleModuleClicked" />
            <LessonComponent ref="lesson" v-if="state == 'lesson'" :lesson="currentLesson"
                @back-to-course="backToCourse" />
            <CourseCreate v-if="state == 'courseCreate'" :course="selectedCourse" @update-course="handleCourseUpdate" />
        </div>
    </div>
</template>

<script>
import { toRaw } from 'vue';
import axios from 'axios';
axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';

import CourseCreate from './components/CourseCreate.vue';
import CourseList from './components/CourseList.vue';
import ModuleList from './components/ModuleList.vue';
import LessonComponent from './components/LessonComponent.vue';
import UserInfo from './components/UserInfo.vue';
import UserLogin from './components/UserLogin.vue';

export default {
    name: 'App',
    components: {
        CourseCreate,
        CourseList,
        ModuleList,
        LessonComponent,
        UserInfo,
        UserLogin
    },
    data() {
        return {
            user: null,
            mode: 'learn',
            courses: [],
            selectedCourse: null,
            selectedModule: null,
            currentLessons: null,
            currentLesson: null,
            currentEntries: null,
            state: "courseList"
        };
    },
    mounted() {
        this.loadCourses();
    },
    methods: {
        async loadCourses() {
            await axios.get('https://conlingo-api.cake.builders/courses')
                .then(response => {
                    console.log('Courses:', response.data);
                    this.courses = response.data;
                })
                .catch(error => {
                    console.error('Error fetching courses:', error);
                });
        },
        handleCourseClicked(course) {
            this.selectedCourse = course;
            this.state = "moduleList";

            // Fetch Entires for selected Course
            axios.get(`https://conlingo-api.cake.builders/entries/course/${toRaw(course)._id}`)
                .then(response => {
                    console.log('Entries:', response.data);
                    this.currentEntries = response.data;
                })
                .catch(error => {
                    console.error('Error fetching entries:', error);
                });
        },
        backToCourse() {
            console.log('Back to course', this.selectedCourse);
            this.handleCourseClicked(this.selectedCourse);
        },
        handleModuleClicked(module) {
            let moduleId = toRaw(module._id);
            this.selectedModule = module;
            this.state = "lesson";
            console.log('Selected module:', module, 'Module ID:', moduleId);
            axios.get(`https://conlingo-api.cake.builders/modules/${moduleId}/lessons`)
                .then(response => {
                    this.currentLessons = response.data;
                    this.currentLesson = this.currentLessons[0];
                    console.log('Current lesson:', this.currentLesson);
                })
                .catch(error => {
                    console.error('Error fetching lessons:', error);
                });
        },
        async goToCourseList() {
            await this.loadCourses();
            this.selectedCourse = null;
            this.state = "courseList";
        },
        goToCourseCreate(course) {
            console.log('Go to courseCreate', course);
            this.state = 'courseCreate';
            this.selectedCourse = course;
        },
        handleUserUpdate(user) {
            this.user = user;
            
            if (!user) { 
                document.cookie = '';
            } else {
                document.cookie = user._id;
            }

            console.log('User updated:', user);
        },
        handleCourseUpdate(course) {
            this.selectedCourse = course;
            console.log('Course updated:', course);
        }
    }
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
