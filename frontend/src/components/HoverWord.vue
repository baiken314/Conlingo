<template>
    <span class="hover-word" @mouseover="showTooltip" @mouseleave="hideTooltip">
        {{ text }}
        <div v-if="doShowTooltip" class="tooltip">
            {{ tooltipText }}
        </div>
    </span>
</template>
    
<script>
export default {
    props: {
        text: String,
        tooltipText: String
    },
    data() {
        return {
            doShowTooltip: false
        };
    },
    methods: {
        showTooltip() {
            this.doShowTooltip = true;
        },
        hideTooltip() {
            this.doShowTooltip = false;
        }
    }
};
</script>
    
<style scoped>
.hover-word {
    position: relative;
    cursor: pointer;
}

.tooltip {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
    z-index: 1;
    display: none;
    white-space: nowrap; /* Prevent tooltip text from wrapping */
}

.hover-word:hover .tooltip {
    display: block;
}
</style>
