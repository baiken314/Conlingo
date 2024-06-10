<template>
    <div class="card is-clickable" @click="$emit('lesson-clicked', lesson)">
        <h3>Lesson {{ key }}</h3>
    </div>
</template>

<script>
export default {
    props: {
        lesson: Object
    }
}
</script>