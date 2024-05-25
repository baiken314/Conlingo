const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
// Middleware
app.use(cors({
    origin: '*', // replace with your frontend origin
    credentials: true,
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, Access-Control-Allow-Origin'
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

const User = require('./models/user');

const courseRouter = require('./routes/courseRouter');
const entryRouter = require('./routes/entryRouter');
const lessonRouter = require('./routes/lessonRouter');
const moduleRouter = require('./routes/moduleRouter');
const sentenceRouter = require('./routes/sentenceRouter');

const MONGO_URI = 'mongodb://127.0.0.1:27017/conlingo';
const PORT = 5000

// Create Express app
const httpServer = require("http").Server(app);

app.use(express.json());

app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        url: MONGO_URI
    })
}));

// Routes
app.use('/courses', courseRouter);
app.use('/entries', entryRouter);
app.use('/lessons', lessonRouter);
app.use('/modules', moduleRouter);
app.use('/sentences', sentenceRouter);

app.get('/', (req, res) => {
    res.send('Hello from Conlingo backend!');
});

app.post('/signup', async (req, res) => {
    console.log('POST /signup', req.body);

    if (!req.body.username || !req.body.email || !req.body.password) {
        res.send('Error: Not all fields are filled out.');
        return;
    }

    const userCheck = await User.findOne({ username: req.body.username });
    if (userCheck) {
        res.send('Error: User ' + userCheck.username + ' already exists.');
        return;
    }

    const emailCheck = await User.findOne({ email: req.body.email });
    if (emailCheck) {
        res.send('Error: User with email ' + emailCheck.email + ' already exists.');
        return;
    }

    const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    res.json(newUser);
});

app.post('/login', async (req, res) => {
    console.log('GET /login');

    if (!req.body.username || !req.body.password) {
        res.json({ error: 'Not all fields are filled out.' });
        return;
    }

    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        res.json({ error: 'User ' + req.body.username + ' does not exist.' });
        return;
    }

    if (user.password != req.body.password) {
        console.log(user, req.body.password);
        res.json({ error: 'Password is incorrect.' });
        return;
    }

    res.json(user);
});

app.get('/logout', async (req, res) => {
    console.log('GET /logout');
});

app.get('/user-session/:id', async (req, res) => {
    console.log('GET /user-session');

    let currentUser = await User.findById(req.params.id);

    if (!currentUser) {
        res.json({ error: 'Unable to find specified user.' });
        return;
    }

    res.json(currentUser);
});

// Connect to MongoDB
mongoose.connect(MONGO_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Start the server
const listener = httpServer.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});