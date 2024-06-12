<template>
    <div class="block">
        <p><strong>{{ sentence.cleanTargetText }}</strong></p>
        <p>{{ sentence.cleanNativeText }}</p>
    </div>
</template>

<script>
export default {
    props: {
        course: Object,
        module: Object,
        lesson: Object,
        sentence: Object
    }
}
</script>