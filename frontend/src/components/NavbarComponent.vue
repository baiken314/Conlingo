<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="https://conlingo.cake.builders">
                <img src="conlingo_logo_title.png">
            </a>
            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>
        <div v-if="user" class="navbar-menu">
            <div class="navbar-start">
                <a class="navbar-item" @click="$emit('learn-clicked')">Learn</a>
                <a class="navbar-item" @click="$emit('create-clicked')">Create</a>
            </div>
            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons">
                        <a class="button is-danger" @click="$emit('log-out-clicked')">Log out</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    props: {
        user: Object
    }
}
</script>