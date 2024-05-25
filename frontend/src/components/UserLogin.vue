<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="login">
            <label for="username">Username: *</label>
            <input type="text" id="username" v-model="username" required>
            <br/>
            <label for="password">Password: *</label>
            <input type="password" id="password" v-model="password" required>
            <br/>
            <label for="email">Email: *</label>
            <input type="email" id="email" v-model="email" required>
            <br/>
            <button @click="login">Log In</button>
        </form>
        <button @click="signUp">Sign Up</button>
    </div>
</template>

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