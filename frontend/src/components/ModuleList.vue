<template>
    <div v-if="mode == 'learn'" class="section">
        <h1 class="title">{{ course.name }}</h1>
        <div>{{ course.description }}</div>
    </div>
    <div class="section pt-0">
        <h2>Modules</h2>
        <div v-if="loading">Loading modules...</div>
        <div v-else-if="modules.length === 0">No modules available.</div>
        <div v-else>
            <ModuleItem 
                v-for="moduleItem in modules" 
                @module-clicked="$emit('module-clicked', $event)" 
                :mode="mode"
                :key="moduleItem._id" 
                :module="moduleItem" />
        </div>
        <div v-if="mode == 'create'">
            <button class="button is-primary mt-4" type="button" @click="createNewModule">Create Module</button>
        </div>
    </div>
</template>

<script>
import ModuleItem from './ModuleItem.vue';

export default {
    props: {
        course: Object,
        modules: Array[Object],
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
            loading: false,
        };
    },
    methods: {
        async createNewModule() {
            const moduleCreateRequest = await fetch(`https://conlingo-api.cake.builders/courses/${this.course._id}/addModule`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const course = await moduleCreateRequest.json();
            this.$emit('update-course', course);
        }
    }
};
</script>
