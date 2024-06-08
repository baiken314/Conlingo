<template>
    <div id="app" class="content">
        <NavbarComponent 
            :user="user" 
            @learn-clicked="mode = 'learn'; state = 'courseList'"
            @create-clicked="mode = 'create'; state = 'courseList'"
            @logout-clicked="user = null" />
        <div class="hero is-fullheight">
            <div class="container">
                <UserLogin v-if="!user" :user="user" @user-update="user = $event" />
                <div v-if="user">
                    <CourseList 
                        v-if="state == 'courseList'" 
                        :courses="courses" 
                        :mode="mode" 
                        @course-clicked="state = 'moduleList'; selectedCourse = $event"
                        @go-to-course-create="state = 'courseCreate'; selectedCourse = $event" />
                    <ModuleList 
                        v-if="state == 'moduleList'" 
                        :course="selectedCourse" 
                        :modules="modules"
                        @go-to-course-list="state = 'courseList'"
                        @module-clicked="selectedModule = $event; state = 'lesson'" />
                    <LessonComponent 
                        v-if="state == 'lesson'" 
                        ref="lesson" 
                        :lesson="selectedLesson"
                        @back-to-course="state = 'moduleList'" />
                    <CourseCreate 
                        v-if="state == 'courseCreate'"
                        :course="selectedCourse" 
                        :modules="modules"
                        @update-course="selectedCourse = $event" />
                </div>
            </div>
            <footer class="footer">
                <div class="content has-text-centered is-flex-align-items-flex-end mt-auto">
                    <p>
                        <strong>Conlingo</strong> by <a href="https://bradleyaiken.com">Bradley Aiken</a>. 
                        The source code is licensed <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
                    </p>
                </div>
            </footer>
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
    async mounted() {
        await this.loadCourses();
    },
    watch: {
        async selectedCourse(newCourse) {
            this.entries = [];
            this.modules = [];
            this.lessons = [];
            if (!newCourse) return;

            console.log('Selected course:', toRaw(newCourse));

            const modulesRequest = await fetch(`https://conlingo-api.cake.builders/modules/course/${toRaw(newCourse)._id}/modules`);
            this.modules = await modulesRequest.json();
            const entriesRequest = await fetch(`https://conlingo-api.cake.builders/entries/${toRaw(newCourse)._id}`);
            this.entries = await entriesRequest.json();
        },
        async selectedModule(newModule) {
            this.lessons = [];
            if (!newModule) return;

            const lessonsRequest = await fetch(`https://conlingo-api.cake.builders/modules/${newModule._id}/lessons`);
            this.lessons = await lessonsRequest.json();
            this.selectedLesson = this.lessons[0];
        },
        user(newUser) {
            document.cookie = newUser ? newUser._id : '';
        },
        async state(newState) {
            if (newState == 'courseList') {
                await this.loadCourses();
                this.selectedCourse = null;
            }
        }
    },
    methods: {
        async loadCourses() {
            const coursesRequest = await fetch(`https://conlingo-api.cake.builders/courses`);
            this.courses = await coursesRequest.json();
        }
    }
};
</script>