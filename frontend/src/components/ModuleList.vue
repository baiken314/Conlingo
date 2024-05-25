<template>
    <div class="course-details">
        <div v-if="mode == 'learn'">
            <button @click="goToCourseList">Courses</button>
            <div class="course-info">
                <h1>{{ course.name }}</h1>
                <div v-html="course.description"></div>
            </div>
        </div>
        <div class="module-list">
            <h2>Modules</h2>
            <div v-if="loading">Loading modules...</div>
            <div v-else-if="modules.length === 0">No modules available</div>
            <div v-else>
            <ModuleItem v-for="moduleItem in modules" @module-clicked="moduleClicked" :key="moduleItem._id" :module="moduleItem" />
            </div>
        </div>
        <div v-if="mode == 'create'">
            <button type="button" @click="createNewModule">Create Module</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';

import ModuleItem from './ModuleItem.vue';

export default {
    props: {
        course: Object,
        mode: {
            type: String,
            default: "learn"
        }
    },
    components: {
        ModuleItem,
    },
    data() {
        return {
            modules: [],
            loading: false,
        };
    },
    mounted() {
        this.fetchModules(); // Fetch modules when the component is mounted
    },
    methods: {
        async fetchModules() {
            this.loading = true; // Set loading state to true
            try {
                const response = await axios.get(`https://conlingo-api.cake.builders/modules/course/${this.course._id}/modules`);
                console.log('Modules:', response.data);
                this.modules = response.data; // Set modules data
            } catch (error) {
                console.error('Error fetching modules:', error);
            } finally {
                this.loading = false; // Set loading state to false
            }
        },
        goToCourseList() {
            this.$emit("go-to-course-list");
        },
        moduleClicked(module) {
            console.log('Module clicked from ModuleList:', module);
            this.$emit("module-clicked", module);
        },
        createNewModule() {

        }
    },
};
</script>

<style scoped>
.course-details {
    max-width: 800px;
    margin: 0 auto;
}

.course-info {
    margin-bottom: 20px;
}

.module-list {
    margin-top: 20px;
}

.module-list h2 {
    margin-bottom: 10px;
}
</style>
