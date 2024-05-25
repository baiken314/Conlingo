<template>
    <div>
        <p><i>Welcome, {{ user.username }}!</i></p>
        <button @click="goToCreate">Create</button>
        <button @click="goToLearn">Learn</button>
        <button @click="logout">Logout</button>
    </div>
    <hr/>
</template>

<script>
export default {
    props: {
        user: Object
    },
    methods: {
        logout() {
            this.$emit('user-update', null);
        },
        goToCreate() {
            this.$emit('go-to-create', null);
        },
        goToLearn() {
            this.$emit('go-to-learn', null);
        }
    }
};
</script>