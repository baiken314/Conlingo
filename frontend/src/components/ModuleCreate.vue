<template>
    <div class="section">
        <div class="level">
            <div class="level-left">
                <div class="level-item">
                    <h1 class="title">Edit module - {{ module.name }}</h1>
                </div>
            </div>
            <div class="level-right">
                <div class="level-item">
                    <div class="buttons">
                        <button class="button is-link" @click="$emit('go-to-course-create', course)">
                            <span class="icon is-small">
                                <i class="fa fa-chevron-left"></i>
                            </span>
                            <span>Back</span>
                        </button>
                        <button class="button is-primary" type="button" @click="saveModule">
                            <span class="icon is-small">
                                <i class="fa fa-check"></i>
                            </span>
                            <span>Save Module</span>
                        </button>
                    </div>     
                </div>
            </div>
        </div>
        <div class="field">
            <label class="label" for="moduleName">Module Name:</label>
            <div class="control">
                <input class="input" type="text" id="moduleName" v-model="updatedModule.name" required>
            </div>
        </div>
        <div class="field">
            <label class="label" for="description">Description:</label>
            <div class="control">
                <textarea class="textarea" id="description" v-model="updatedModule.description" required></textarea>
            </div>
        </div>
        <LessonList
            :course="course"
            :module="module"
            @update-course="console.log('ModuleCreate update course emit'); $emit('update-course', $event)" />
    </div>
</template>

<script>
import LessonList from './LessonList.vue';

export default ({
    components: {
        LessonList
    },
    props: {
        course: Object,
        module: Object
    },
    data() {
        return {
            updatedModule: JSON.parse(JSON.stringify(this.module)) || {}
        }
    },
    methods: {
        async saveModule() {
            console.log('Saving module ', this.updatedModule);
            const updateModuleRequest = await fetch(`https://conlingo-api.cake.builders/modules/${this.module._id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.updatedModule)
            });

            const module = await updateModuleRequest.json();
            this.$emit('update-module', module);
        }
    }

})
</script>