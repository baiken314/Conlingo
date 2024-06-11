<template>
    <div id="app">
        <NavbarComponent 
            :user="user"
            @learn-clicked="mode = 'learn'; state = 'courseList'"
            @create-clicked="mode = 'create'; state = 'courseList'"
            @logout-clicked="user = null" />
        <div class="flex-container">
            <div class="main-content">
                <div class="hero">
                    <div class="container">
                        <UserLogin v-if="!user" :user="user" @user-update="user = $event" />
                        <div v-if="user">
                            <CourseList 
                                v-if="state == 'courseList'" 
                                :courses="courses" 
                                :mode="mode" 
                                @course-clicked="loadSelectedCourse($event._id); state = 'moduleList'; "
                                @go-to-course-create="state = 'courseCreate'; if ($event) loadSelectedCourse($event._id);" />
                            <ModuleList 
                                v-if="state == 'moduleList' && selectedCourse && selectedCourse.modules" 
                                :course="selectedCourse"
                                @go-to-course-list="state = 'courseList'"
                                @module-clicked="state = 'lesson'; selectedModule = $event" />
                            <LessonComponent 
                                v-if="state == 'lesson' && selectedLesson" 
                                ref="lesson" 
                                :lesson="selectedLesson"
                                @go-to-module-list="state = 'moduleList'" />
                            <CourseCreate 
                                v-if="state == 'courseCreate'"
                                :course="selectedCourse"
                                @go-to-course-list="state = 'courseList'"
                                @update-course="loadSelectedCourse($event._id)"
                                @delete-course="state = 'courseList'; selectedCourse = null"
                                @module-clicked="state = 'moduleCreate'; selectedModule = $event" />
                            <ModuleCreate 
                                v-if="state == 'moduleCreate'"
                                :course="selectedCourse"
                                :module="selectedModule"
                                @update-course="console.log('YTESSDGSD'); loadSelectedCourse($event._id)"
                                @update-module="selectedModule = $event"
                                @delete-module="state = 'courseCreate'; selectedModule = null"
                                @go-to-course-create="state = 'courseCreate'; if ($event) loadSelectedCourse($event._id);" />
                        </div>
                    </div>
                </div>
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
    </div>
</template>

<style>
#app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.flex-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.main-content {
    flex-grow: 1;
}

.footer {
    flex-shrink: 0;
}
</style>

<script>
import { toRaw } from 'vue';
import axios from 'axios';
axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';

import CourseCreate from './components/CourseCreate.vue';
import CourseList from './components/CourseList.vue';
import ModuleCreate from './components/ModuleCreate.vue'
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
        ModuleCreate,
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
            selectedModule: null,
            selectedLesson: null,
        };
    },
    async mounted() {
        await this.loadSelectedCourses();
    },
    watch: {
        async selectedModule(newModule) {
            if (!newModule) return;
            this.selectedLesson = this.selectedCourse.modules.find(module => module._id == newModule._id).lessons[0];
        },
        user(newUser) {
            document.cookie = newUser ? newUser._id : 'null';
        },
        async state(newState) {
            if (newState == 'courseList') {
                await this.loadSelectedCourses();
                this.selectedCourse = null;
            }
        }
    },
    methods: {
        async loadSelectedCourses() {
            const coursesRequest = await fetch(`https://conlingo-api.cake.builders/courses`);
            this.courses = await coursesRequest.json();
        },
        async loadSelectedCourse(courseId) {
            console.log('Loading course: ', courseId);
            const courseRequest = await fetch(`https://conlingo-api.cake.builders/courses/${courseId}`);
            const courseProxy = await courseRequest.json();
            this.selectedCourse = toRaw(courseProxy);

            if (this.selectedModule) {
                this.selectedModule = this.selectedCourse.modules.find(module => module._id == this.selectedModule._id);
            }
        }
    }
};
</script>