<template>
    <div class="module-item" @click="moduleClicked">
        <div class="module-content">
            <h2>{{ module.name }}</h2>
            <div v-html="module.description"></div>
        </div>
        <div class="lesson-count">{{ module.lessons.length }} Lessons</div>
        <div v-if="mode == 'create'">
            <button type="button" @click="editModule">Edit</button>
            <button type="button" @click="deleteModule">Delete</button>
        </div>
    </div>
</template>
    
<script>
    export default {
        props: {
            module: Object,
            mode: {
                type: String,
                default: "learn"
            } 
        },
        methods: {
            moduleClicked() {
                console.log('Module clicked from ModuleItem:', this.module);
                this.$emit('module-clicked', this.module);
            }
        },
    };
</script>
    
<style scoped>
    .module-item {
        cursor: pointer;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 10px;
        transition: background-color 0.3s ease;
        width: 300px; /* Adjust the width as needed */
        margin: 0 auto; /* Center the cards horizontally */
    }
    
    .module-item:hover {
        background-color: #f0f0f0;
    }
    
    .module-content {
        margin-bottom: 5px;
    }
    
    .lesson-count {
        font-size: 14px;
        color: #666;
    }
</style>
    