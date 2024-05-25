const Course = require('./models/course');
const Module = require('./models/module');
const Lesson = require('./models/lesson');
const Sentence = require('./models/sentence');
const Entry = require("./models/entry");

async function insertSampleData() {
    const esperantoCourse = await Course.findOne({name: "Esperanto"});
    const testModule = await Module.create({ 
        name: 'Test Module', 
        order: 0, 
        description: '# Welcome\nThis is a **test** module.', 
        lessons: []
    });

    await Course.findByIdAndUpdate(esperantoCourse._id, {
        $push: {
            modules: [testModule]
        }
    });

    const lesson1 = await Lesson.create({ sentences: [] }); // You can add sentences as needed

    await Module.findByIdAndUpdate(testModule._id, {
        $push: {
            lessons: [lesson1]
        }
    });

    // Insert sample sentences
    const sentence1 = await Sentence.create({ targetText: '(Bonan tagon).', nativeText: 'Good day.' });
    const sentence2 = await Sentence.create({ targetText: 'Mi parolas Esperanton.', nativeText: 'I speak Esperanto.' });
    const sentence3 = await Sentence.create({ targetText: '(Kiel vi fartas)?', nativeText: 'How are you?' });
    const sentence4 = await Sentence.create({ targetText: 'Mi trinkas akvon.', nativeText: 'I am drinking water.' });
    const sentence5 = await Sentence.create({ targetText: 'Ĉu vi laboras?', nativeText: 'Do you work?' });
    const sentence6 = await Sentence.create({ targetText: "Ĉi tio estas frazo.", nativeText: "This is a sentence."});

    // Update lessons with sentences
    await Lesson.findByIdAndUpdate(lesson1._id, { $push: { sentences: [sentence1._id, sentence2._id, sentence3._id, sentence4._id, sentence5._id, sentence6._id] } });

    const entries = [
        { entry: "bona", translation: "good", partOfSpeech: "adj"},
        { entry: "bonan" },
        { entry: "tago", translation: "day", partOfSpeech: "n"},
        { entry: "mi", translation: "I", partOfSpeech: "pron"},
        { entry: "paroli", translation: "to speak", partOfSpeech: "v"},
        { entry: "parolas", translation: "speak/speaks", partOfSpeech: "v" },
        { entry: "Esperanto", translation: "Esperanto", partOfSpeech: "n" },
        { entry: "Esperanton" },
        { entry: "kiel", translation: "how/in what manner", partOfSpeech: "adv" },
        { entry: "vi", translation: "you", partOfSpeech: "pron" },
        { entry: "farti", translation: "to fare", partOfSpeech: "v" },
        { entry: "fartas", translation: "fareing", partOfSpeech: "v"},
        { entry: "trinki", translation: "to drink", partOfSpeech: "v" },
        { entry: "trinkas", translation: "drinking", partOfSpeech: "v" },
        { entry: "labori", translation: "to work", partOfSpeech: "v" },
        { entry: "laboras", translation: "working", partOfSpeech: "v" },
        { entry: "ĉu", translation: "yes/no question word", partOfSpeech: "prep" },
        { entry: "kiel vi fartas", translation: "how are you", partOfSpeech: "exp" },
        { entry: "bonan tagon", translation: "good day", partOfSpeech: "exp" },
        { entry: "ĉi tio", translation: "this", partOfSpeech: "n" },
        { entry: "frazo", translation: "sentence", partOfSpeech: "n" }
    ];

    for (let entry of entries) {
        entry.couse = esperantoCourse._id;
    }

    const insertedEntires = await Entry.create(entries);

    let roots = {
        "bonan": "bona",
        "laboras": "labori",
        "fartas": "farti",
        "Esperanton": "Esperanto",
        "trinkas": "trinki",
        "parolas": "paroli"
    };
    
    for (let key in roots) {
        let rootWordName = roots[key];
        let rootWord = await Entry.findOne({ entry: rootWordName });
        if (rootWord) {
            await Entry.findOneAndUpdate({ entry: key }, { root: rootWord._id });
        } else {
            console.log(`Root word '${rootWordName}' not found for entry '${key}'`);
        }
    }    

    for (let word in [
        "bona",
        "tago",
        "mi",
        "vi",
        "fartas",
        "parolas",
        "trinkas",
        "laboras",
        "frazo"
    ]) {
        let entry = await Entry.findOne({ entry: word });
        await Lesson.findByIdAndUpdate(lesson1._id, { $push: { keywords: [entry._id] } });
    }

    console.log('Sample data inserted successfully!');
}

// Call the function to insert sample data
insertSampleData().catch(error => console.error('Error inserting sample data:', error));