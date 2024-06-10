<template>
    <div class="module-item card is-clickable" @click="$emit('module-clicked', module)">
        <div class="card-content">
            <div class="content">
                <h4>{{ module.name }}</h4>
                <div v-html="module.description"></div>
                <div class="lesson-count">{{ module.lessons ? module.lessons.length : '0' }} Lessons</div>
            </div>
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
        }
    };
</script>
    
<style scoped>
    .module-item {
        transition: background-color 0.3s ease, scale 0.3s ease;
    }
    
    .module-item:hover {
        scale: 1.025;
    }
    
    .lesson-count {
        font-size: 14px;
        color: #666;
    }
</style>
    