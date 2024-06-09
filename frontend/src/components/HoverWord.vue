<template>
    <span class="hover-word underline">
        {{ text }}
        <div class="tooltip is-info notification pl-3 pr-3">
            {{ tooltipText }}
        </div>
    </span>
</template>
    
<script>
export default {
    props: {
        text: String,
        tooltipText: String
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
    top: -150%;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 5px;
    padding: 5px;
    z-index: 1;
    opacity: 0%;
    white-space: nowrap;
    display: block;
    transition: opacity 0.2s ease;
}

.hover-word:hover .tooltip {
    opacity: 100%;
}

.underline {
    position: relative;
    padding-bottom: 2px;
}

.underline::after {
    content: '';
    position: absolute;
    left: 3px;
    right: 3px;
    bottom: 0;
    border-bottom: 2px dotted currentColor;
}

:root {
    --underline-color-light: rgba(0, 0, 0, 0.6);
    --underline-color-dark: rgba(255, 255, 255, 0.6);
}

html:not(.has-background-dark) .hover-word .underline::after {
    border-bottom-color: var(--underline-color-light);
}

html.has-background-dark .hover-word .underline::after {
    border-bottom-color: var(--underline-color-dark);
}
</style>
