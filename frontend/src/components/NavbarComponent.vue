<template>
    <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="https://conlingo.cake.builders">
                <img src="conlingo_logo_title.png">
            </a>
            <a v-if="user" role="button" class="navbar-burger" :class="{ 'is-active': isMobileActive }" @click="isMobileActive = !isMobileActive; console.log(isMobileActive)" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>
        <div v-if="user" class="navbar-menu" :class="{ 'is-active': isMobileActive }">
            <div class="navbar-start">
                <a class="navbar-item" @click="$emit('learn-clicked'); isMobileActive = false;">Learn</a>
                <a class="navbar-item" @click="$emit('create-clicked'); isMobileActive = false;">Create</a>
                <a class="navbar-item">Community</a>
            </div>
            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons">
                        <a class="button is-danger" @click="$emit('logout-clicked'); isMobileActive = false;">Log out</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    data() {
        return {
            isMobileActive: false
        }
    },
    props: {
        user: Object
    }
}
</script>