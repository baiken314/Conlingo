<template>
    <div id="app" class="content">
        <UserLogin v-if="!user" :user="user" @user-update="handleUserUpdate" />
        <div v-if="user">
            <CourseList 
                v-if="state == 'courseList'" 
                :courses="courses" 
                :mode="mode" 
                @course-clicked="handleCourseClicked"
                @go-to-course-create="goToCourseCreate" />
            <ModuleList v-if="state == 'moduleList'" :course="selectedCourse" 
                @go-to-course-list="goToCourseList"
                @module-clicked="handleModuleClicked" />
            <LessonComponent ref="lesson" v-if="state == 'lesson'" :lesson="selectedLesson"
                @back-to-course="backToCourse" />
            <CourseCreate v-if="state == 'courseCreate'" :course="selectedCourse" @update-course="handleCourseUpdate" />
        </div>
        <footer class="footer">
            <div class="content has-text-centered">
                <p>
                    <strong>Conlingo</strong> by <a href="https://bradleyaiken.com">Bradley Aiken</a>. 
                    The source code is licensed <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
                </p>
            </div>
        </footer>
    </div>
</template>

<script>
import { toRaw } from 'vue';
import axios from 'axios';
axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';

import CourseCreate from './components/CourseCreate.vue';
import CourseList from './components/CourseList.vue';
import ModuleList from './components/ModuleList.vue';
import NavbarComponent from './components/NavbarComponent.vue';
import LessonComponent from './components/LessonComponent.vue';
import UserLogin from './components/UserLogin.vue';

export default {
    name: 'App',
    components: {
        CourseCreate,
        CourseList,
        LessonComponent,
        ModuleList,
        NavbarComponent,
        UserLogin
    },
    data() {
        return {
            mode: 'learn',
            state: 'courseList',
            user: null,
            courses: [],
            selectedCourse: null,
            modules: [],
            selectedModule: null,
            lessons: [],
            selectedLesson: null,
            entries: null,
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

            axios.get(`https://conlingo-api.cake.builders/entries/course/${toRaw(course)._id}`)
                .then(response => {
                    console.log('Entries:', response.data);
                    this.entries = response.data;
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
                    this.lessons = response.data;
                    this.selectedLesson = this.lessons[0];
                    console.log('Current lesson:', this.selectedLesson);
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