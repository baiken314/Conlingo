<template>
    <section class="section">
        <form class="box" @submit.prevent="login">
            <h1 class="is-centered">Log into Conlingo</h1>
            <div class="field">
                <label class="label" for="username">Username*</label>
                <div class="control has-icons-left">
                    <input class="input" type="text" id="username" v-model="username" placeholder="Enter username" required>
                    <span class="icon is-small is-left">
                        <i class="fas fa-user"></i>
                    </span>
                </div>
            </div>
            <div class="field">
                <label class="label" for="password">Password*</label>
                <div class="control has-icons-left">
                    <input class="input" type="password" id="password" v-model="password" placeholder="Enter password" required>
                    <span class="icon is-small is-left">
                        <i class="fas fa-lock"></i>
                    </span>
                </div>
            </div>
            <div class="field">
                <label class="label" for="email">Email*</label>
                <div class="control has-icons-left">
                    <input class="input" type="email" id="email" v-model="email" placeholder="Enter email" required>
                    <span class="icon is-small is-left">
                        <i class="fas fa-envelope"></i>
                    </span>
                </div>
            </div>
            <div class="buttons">
                <button class="button is-light" @click="login">Log In</button>
                <button class="button is-primary" @click="signUp">Sign Up</button>
            </div>
        </form>
    </section>
    <br/>
</template>

<style scoped>
    @media (min-width: 800px) {
        section {
            max-width: 600px;
            margin: auto;
        }
    }
</style>

<script>
export default {
    data() {
        return {
            username: '',
            password: '',
            email: ''
        };
    },
    props: {
        user: Object
    },
    async mounted() {
        // Check if user is already logged in
        if (document.cookie) {
            console.log('User is already logged in');

            const userSessionRequest = await fetch(`https://conlingo-api.cake.builders/user-session/${document.cookie}`);
            const user = await userSessionRequest.json()

            this.$emit('user-update', user);
        }
    },
    methods: {
        async login() {
            console.log('Logging in...');
            const loginRequest = await fetch('https://conlingo-api.cake.builders/login', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.username,
                    password: this.password
                })
            });
            const loginData = await loginRequest.json();

            if (loginData.error) {
                console.error('Error logging in:', loginData.error);
                return;
            }

            document.cookie = loginData._id;
            this.$emit('user-update', loginData);
        },
        async signUp() {
            console.log('signing up...');

            const signUpRequest = await fetch('https://conlingo-api.cake.builders/signup', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.username,
                    email: this.email,
                    password: this.password
                })
            });
            console.log('Sign up request:');
            const signUpData = await signUpRequest.json();
            console.log('Sign up data', signUpData);

            if (signUpData.error) {
                console.error('Error signing up:', signUpData.error);
                return;
            }

            document.cookie = signUpData._id;
            this.$emit('user-update', signUpData);
        },
        logout() {
            console.log('Logging out...');
            document.cookie = '';
            this.$emit('user-update', null);
        }
    }
};
</script>