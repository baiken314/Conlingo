<template>
    <div class="container">
        <div class="section">
            <div v-if="mode == 'learn'">
                <h1>{{ course.name }}</h1>
                <div>{{ course.description }}</div>
            </div>
        </div>
    </div>
    <div class="section pt-0">
        <h2>Modules</h2>
        <div v-if="loading">Loading modules...</div>
        <div v-else-if="modules.length === 0">No modules available</div>
        <div v-else>
            <ModuleItem 
                v-for="moduleItem in modules" 
                @module-clicked="$emit('module-clicked', $event)" 
                :key="moduleItem._id" 
                :module="moduleItem" />
        </div>
        <div v-if="mode == 'create'">
            <button type="button" @click="createNewModule">Create Module</button>
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
    }
};
</script>
