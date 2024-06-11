<template>
    <div v-if="mode == 'learn'" class="section">
        <div class="level">
            <div class="level-left">
                <div class="level-item">
                    <h1 class="title">{{ course.name }}</h1>
                </div>
            </div>
            <div class="level-right">
                <div class="level-item">
                    <button class="button is-link" @click="$emit('go-to-course-list')">
                        <span class="icon is-small">
                            <i class="fa fa-chevron-left"></i>
                        </span>
                        <span>Back</span>
                    </button>
                </div>
            </div>
        </div>
        <div>{{ course.description }}</div>
    </div>
    <div class="section pt-0">
        <div class="level">
            <div class="level-left">
                <div class="level-item">
                    <h2 class="title">Modules</h2>
                </div>
            </div>
            <div v-if="mode == 'create'" class="level-right">
                <div class="level-item">
                    <button class="button is-primary" type="button" @click="createNewModule">
                        <span class="icon is-small">
                            <i class="fa fa-plus"></i>
                        </span>
                        <span>Create Module</span>
                    </button>
                </div>
            </div>
        </div>
        <div v-if="loading">Loading modules...</div>
        <div v-else-if="course.modules.length === 0">No modules available.</div>
        <div v-else>
            <ModuleItem 
                v-for="moduleItem in course.modules" 
                @module-clicked="$emit('module-clicked', $event)" 
                :mode="mode"
                :key="moduleItem._id" 
                :module="moduleItem" />
        </div>
    </div>
</template>

<script>
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
