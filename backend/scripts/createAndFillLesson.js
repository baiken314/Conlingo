const Lesson = require('../models/lesson');
const Sentence = require('../models/sentence');
const Module = require('../models/module');

// Import necessary modules and dependencies

// Function to create and fill a new lesson
async function createAndFillLesson() {
    try {
        // Create a new lesson
        const newLesson = new Lesson({
            // Set the properties of the new lesson
            // ...
        });

        // Save the new lesson to the database
        const savedLesson = await newLesson.save();

        // Get all sentences from the database
        const sentences = await Sentence.find();

        // Associate all sentences to the new lesson
        await Promise.all(
            sentences.map(async (sentence) => {
                sentence.lesson = savedLesson._id;
                await sentence.save();
            })
        );

        // Get the existing module from the database
        const existingModule = await Module.findOne();

        // Associate the existing module to the new lesson
        existingModule.lessons.push(savedLesson._id);
        await existingModule.save();

        console.log('Lesson created and associated successfully!');
    } catch (error) {
        console.error('Error creating and filling lesson:', error);
    }
}

// Call the function to create and fill the lesson
createAndFillLesson();