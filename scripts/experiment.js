// Global variables used in this file
let timeline = [];
let bandit = null;
let EARS = null;
let participantID = 0;
let condition = "";
let trialType = "";
let filenameParent = "";
let filename = "";
let banditPrize = {};
let prize = 0;

// Global variables used in plugins
let banditTrial = 0;
let EARSTrial = 0;
let totalPoints = 0;
let outcomeArray = [];

// Trial settings
const useFullscreen = true;
const testBandit = false;

let nTrials = 120;
let nBlocks = 6;
if (testBandit) {
    nTrials = 10;
    nBlocks = 1;
} 
const pointsPerDollar = 10;
const options = ["safe", "risky"];
const colours = ["red", "blue"];
const shapes = ["circle", "square", "pentagon", "triangle"];

// Randomise order of options and colours
const shuffledOptions = jsPsych.randomization.sampleWithoutReplacement(options);
const shuffledColours = jsPsych.randomization.sampleWithoutReplacement(colours);

// Randomly sample stimuli used in low stimulus variability condition
const leftStimulusGlobal = generateStimuli("left");
const rightStimulusGlobal = generateStimuli("right");

//exp consent

var expConsent = {
    type: "survey-text",
    questions: [{ prompt: "Have you read and agreed to the consent form?:", value: "", columns: 20, name: "Consent"}],
    required: true,
    };


    let id = [
        {
            type: "survey-text",
            questions: [{ prompt: "ID:", value: "", columns: 14 }],
        },
    ];

// Predetermined condition allocation based on participant ID
// const participantOrder = [
//     0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1,
//     0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
//     1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1,
//     1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
//     1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1,
// ];

const zeroes = Array(100).fill(0)
const ones = Array(100).fill(1)
const twos = Array(100).fill(2)
const threes = Array(100).fill(3)

const participantOrderUnshuffled = zeroes.concat(ones, twos, threes)
const participantOrder = jsPsych.randomization.shuffle(participantOrderUnshuffled)


// Start experiment--inputID triggers runExperiment
inputID();

// Participant ID
function inputID() {
    let id = [
        {
            type: "survey-text",
            questions: [{ prompt: "ID:", value: "", columns: 14 }],
        },
    ];




    jsPsych.init({
        timeline: id,
        on_finish: function () {
            if (
                (participantID <= participantOrder.length) |
                (participantID == 6661) |
                (participantID == 6662) |
                (participantID == 6663) |
                (participantID == 6664)
            ) {
                // add check for existing participant data
                condition = assignCondition(participantID, participantOrder);
                runExperiment();
            } else {
                inputID();
            }
        },
    });
}

function runExperiment() {
    // Warn on exit or reload
    window.onbeforeunload = function () {
        return "Are you sure you want to leave the experiment?";
    };

    // Add participant ID and condition to data
    jsPsych.data.addProperties({
        participant: participantID,
        condition: condition,
    });

    // Instructions ---------------------------------------------------------------------------------------------


    // Demographics
    const demographics = {
        type: "survey-text",
        task: null,
        preamble:
            "<strong>Please answer the following demographic questions:</strong><br>(or click Next if you would prefer not to answer):",
        questions: [
            { prompt: "Age:", value: "", columns: 17 },
            { prompt: "Gender:", value: "", columns: 17 },
            { prompt: "Have you read and agree to the consent form", value: "", columns: 17}
        ],

        data: { task: "demographics" },
           
    };

    // Instructions
    const mainInstructions = {
        type: "instructions",
        pages: [
            `<strong>Here's some information about the experiment:</strong> <br><br>
      This experiment consists of a simple game in which you will make choices between pairs of options.`,
            `You can select an option by clicking on it. Choices might look something like this: <br>
      <img id="instructions-screenshot" src="images/screenshot-new.png" style="width:100%";>`,
            `Selecting an option will result in winning a number of points. 
      At the beginning of the game, you will not know how many points can be earned by choosing each option. 
      You can learn about options by selecting them.`,
            `Your goal is to win as many points as possible.
      Every choice influences the amount of <strong>real money</strong> that you could earn.`,
            `At the end of the experiment, one of your choices will be randomly selected for a bonus payment. 
      You will be given <strong>$1 for every ten points earned from that choice</strong>, so you should try to earn as many points as possible.`,
            `The next screen contains a short quiz to check your understanding of the task. You can review the instructions by clicking the Previous button
      or click Next when you're ready for the quiz.`,
        ],
        show_clickable_nav: true,
        show_page_number: true,
    };

    // Instructions attention check -- participants must answer all questions correctly to continue
    let quizIncorrect = true;
    let quizRepeats = 0;
    const question1 = `What is your main objective in the game?`;
    const question2 = `Is it possible to earn real money in the game?`;
    const question3 = `How will you be able to learn about each option?`;
    const options1 = [
        "To win the smallest possible number of points.",
        "To choose options based on your favourite colours.",
        "To win as many points as possible.",
        "To figure out the meaning of life.",
    ];
    const options2 = [
        "No, it is not possible to earn a bonus payment of real money during this experiment.",
        "Yes! I can earn a bonus payment of $1 for every ten points earned for one randomly selected choice.",
        "Yes! I can earn a bonus payment of $1 for every 1000 points earned for one randomly selected choice.",
        "Yes! I can earn a bonus payment of $1 for every ten points earned during the entire game.",
    ];
    const options3 = [
        "During the game, choosing an option will provide an opportunity to learn about its outcome.",
        "There will be written instructions describing the possible outcomes associated with each option.",
        "It will not be possible to learn about the options during the game.",
        "Select this option to review the instructions.",
    ];
    const quizAnswers = `{"Q1":"To win as many points as possible.","Q2":"Yes! I can earn a bonus payment of $1 for every ten points earned for one randomly selected choice.","Q3":"During the game, choosing an option will provide an opportunity to learn about its outcome."}`;

    const instructionsQuiz = {
        type: "survey-multi-choice",
        questions: [
            {
                prompt: question1,
                name: "Q1",
                options: options1,
                required: true,
            },
            {
                prompt: question2,
                name: "Q2",
                options: options2,
                required: true,
            },
            {
                prompt: question3,
                name: "Q3",
                options: options3,
                required: true,
            },
        ],
        button_label: "Next",
        randomize_question_order: false,
        data: { task: "quiz", repeats: quizRepeats },
        on_finish: function (data) {
            if (data.responses == quizAnswers) {
                quizIncorrect = false;
            } else {
                quizRepeats++;
            }
        },
    };

    // Additional instructions shown before looping (if the participants get at least one question wrong)
    const conditionalInstructions = {
        timeline: [
            {
                type: "instructions",
                pages: [
                    `At least one of your answers was incorrect. Please review the instructions and try again.`,
                ],
                show_clickable_nav: true,
                show_page_number: true,
            },
        ],
        conditional_function: function (data) {
            return quizIncorrect;
        },
    };

    // jsPsych looping function for instructions and quiz
    const instructionsLoop = {
        timeline: [mainInstructions, instructionsQuiz, conditionalInstructions],
        loop_function: function (data) {
            return quizIncorrect;
        },
    };

    // Full screen mode
    const fullscreen = {
        type: "fullscreen",
        message: `Great work! You answered the questions correctly. Click START when you're ready to begin the game.`,
        button_label: "START",
        fullscreen_mode: true,
    };

    // Optional comments
    const comments = {
        type: "survey-text",
        task: "comments",
        preamble: `
    <span style="font-size:15pt; line-height: 1.6em;">Finally, you can use the textbox below to write any thoughts you have regarding the experiment. 
    Did you use any particular strategies? Were there specific things that influenced your choices? 
    Did you encounter any technical problems or instructions that were unclear? 
    <strong>(Optional)</strong></span>`,
        questions: [{ value: "", rows: 10, columns: 50 }],
        data: function () {
            return { task: "comments", prize: prize };
        },
    };

    const instructionsEnd = {
        type: "instructions",
        pages: function () {
            banditPrize.points = jsPsych.randomization.sampleWithoutReplacement(
                outcomeArray,
                1
            );
            banditPrize.amount = banditPrize.points / pointsPerDollar;
            return [
                `
        <span style="font-weight:bold;font-size:130%">You have finished the experiment!</span> <br><br> 
        Thanks for participating! One of your choices was randomly selected for payment. 
        The outcome of this choice was <strong>${
            banditPrize.points
        } points</strong> so you will receive 
        <strong>\$${banditPrize.amount.toFixed(
            2
        )}</strong> for this task. <br><br>
        <span style="font-weight:bold;font-size:130%">Please let the experimenter know that you have finished.</span>
        `,
            ];
        },
        show_clickable_nav: true,
        show_page_number: false,
    };

    // Bandit task --------------------------------------------------------------------------------------------------------------------------

    function generateBanditTask(condition) {
        let leftStimulus = null
        let rightStimulus = null
        if (condition.startsWith("static")) {
            leftStimulus = leftStimulusGlobal
            rightStimulus = rightStimulusGlobal
        } else if (condition.startsWith("dynamic")) {
            leftStimulus = () => generateStimuli("left")
            rightStimulus = () => generateStimuli("right")
        } else {
            throw new Error("error: unknown static/dynamic value, aborting experiment during generateBanditTask()")
        }

        if (condition.endsWith("risky-high")) {

        } else if (condition.endsWith("risky-low")) {

        } else {
            throw new Error("error: unknown risky-low/risky-high value, aborting experiment during generateBanditTask()")
        }

        return {
            timeline: [
                {
                    type: "bandit-task",
                    stimulus1: leftStimulus,
                    stimulus2: rightStimulus,
                    outcomes1: () => generateOutcomes(shuffledOptions[0]),
                    outcomes2: () => generateOutcomes(shuffledOptions[1]),
                    probs1: [0.5, 0.5],
                    probs2: [0.5, 0.5],
                    feedbackDuration: 2000,
                    preTrialInterval: 0,
                },
            ],
            repetitions: nTrials / nBlocks,
        };
    }

    bandit = generateBanditTask(condition)

    // EARS questionnaire --------------------------------------------------------------------------------------------------------------------------
    function createEARSInstructions(side) {
        return `
      On the next screen, you will be asked to imagine that you are going to select the option presented on the ${side}-hand side of the screen.
      You will be asked a number of questions about the <strong>outcome (number of points)</strong> that would occur if you were to select that option.
    `;
    }
    
    const generateEARS = (condition, fullEARS=null) => {
        const EARSPreamble = `<strong>Imagine you are going to select the option presented here.</strong> Please answer the following questions regarding the <strong>outcome (number of points)</strong> that would result from your choice:`;
    
        const scale = ["Not at all", "", "", "", "", "", "Very much"];
    
        const questionsShortEars = [
            "The outcome is something that has an element of randomness.",
            "The outcome is determined by chance factors.",
            "The outcome is knowable in advance, given enough information.",
            "The outcome is something that well-informed people would agree on.",
        ];
    
        const questionsFullEars = [
            "The outcome is something that has an element of randomness.",
            "The outcome is unpredictable.",
            "The outcome is determined by chance factors.",
            "The outcome could play out in different ways on similar occasions.",
            "The outcome is, in principle, knowable in advance.",
            "The outcome is something that has been determined in advance.",
            "The outcome is knowable in advance, given enough information.",
            "The outcome is something that well-informed people would agree on.",
            "The outcome is something that could be better predicted by consulting an expert.",
            "The outcome is something that becomes more predictable with additional knowledge or skills."
          ];
          
        // const questionOrder = jsPsych.randomization.shuffle([0, 1, 2, 3]);
    
        let questionArray = [];
        let questions = null
        if (fullEARS) {
            questions = questionsFullEars
        } else {
            questions = questionsShortEars
        }

        for (let q = 0; q < questions.length; q++) {
            questionArray.push({
                prompt: questions[q],
                labels: scale,
                required: true,
            });
        }


        let leftStimulus = null
        let rightStimulus = null
        if (condition.startsWith("static")) {
            leftStimulus = leftStimulusGlobal
            rightStimulus = rightStimulusGlobal
        } else if (condition.startsWith("dynamic")) {
            leftStimulus = generateStimuli("left")
            rightStimulus = generateStimuli("right")
        } else {
            throw new Error("unknown static/dynamic value, aborting experiment")
        }

        return {
            type: "survey-likert",
            timeline: [
                {
                    instructions: jsPsych.timelineVariable("instructions"),
                    stimulus: jsPsych.timelineVariable("stimulus"),
                    side: jsPsych.timelineVariable("side"),
                    questions: questionArray,
                    preamble: EARSPreamble,
                    data: {
                        stimulus: jsPsych.timelineVariable("stimulusName"),
                        risky: jsPsych.timelineVariable("risky"),
                        colour: jsPsych.timelineVariable("colour"),
                        side: jsPsych.timelineVariable("side"),
                    },
                },
            ],
            timeline_variables: [
                {
                    instructions: createEARSInstructions("left"),
                    stimulus: leftStimulus,
                    stimulusName: leftStimulus
                        .replace("images/stimuli/", "")
                        .replace(".jpg", ""),
                    side: "left",
                    risky: shuffledOptions[0],
                    colour: shuffledColours[0],
                },
                {
                    instructions: createEARSInstructions("right"),
                    stimulus: rightStimulus,
                    stimulusName: rightStimulus
                        .replace("images/stimuli/", "")
                        .replace(".jpg", ""),
                    side: "right",
                    risky: shuffledOptions[1],
                    colour: shuffledColours[1],
                },
            ],
            randomize_order: true,
        };
    }

    const shortEARS = generateEARS(condition)
    const fullEARS = generateEARS(condition, true)

    // Push to timeline -----------------------------------------------------------------------------------------------
    if (!testBandit) {
        timeline.push(expConsent, demographics, instructionsLoop);

        if (useFullscreen) {
            timeline.push(fullscreen);
        }
    }

    for (let i = 0; i < nBlocks; i++) {
        console.log(`block ${i}`)
        if (i != nBlocks - 1) {
            timeline.push(bandit, shortEARS);
        } else {
            timeline.push(bandit, fullEARS);
        }
    }

    timeline.push(comments, instructionsEnd);

    // Generate file name for saveData
    const uniqueID = (Math.floor(Math.random() * 899999) + 100000).toString();
    filenameParent = `epistemic-id-${participantID}-${uniqueID}`;

    // Run timeline and store data
    jsPsych.init({
        timeline: timeline,
        show_preload_progress_bar: false,
        on_finish: function () {
            jsPsych.data
            .get()
            .ignore(["internal_node_id"])
            .localSave(
                "csv",
                ".myData.csv"
                );
        },
        on_trial_finish: saveTrialData,
    });
}

// FUNCTIONS -----------------------------------------------------------------------------------------------------------

// Function to assign participants to conditions
function assignCondition(participantID, participantOrder) {
    // 666 to test low variation, 6666 to test high variation, else assign by participantOrder
    const conditionNames = ["dynamic-risky-low", "dynamic-risky-high", "static-risky-low", "static-risky-high"];
    let condition = null;
    if (participantID == 6661) {
        condition = conditionNames[0]
    } else if (participantID == 6662) {
        condition = conditionNames[1]
    } else if (participantID == 6663) {
        condition = conditionNames[2]
    } else if (participantID == 6664) {
        condition = conditionNames[3]
    } else {
        let conditionIndex = participantOrder[participantID - 1];
        condition = conditionNames[conditionIndex];
    }
    console.log(`testing ${condition}`)

    return condition;
}

// Function to generate stimuli
function generateStimuli(side) {
    const shape = jsPsych.randomization.sampleWithoutReplacement(shapes, 1);

    if (side == "left") {
        return `images/stimuli/${shuffledColours[0]}_${shape}.jpg`;
    } else if (side == "right") {
        return `images/stimuli/${shuffledColours[1]}_${shape}.jpg`;
    }
}

const getSafeValue = (condition) => {
    // safe outcome is repeated to allow the function to consistently output an array with two elements
    if (condition.endsWith("risky-low")) {
        const outcome = randomGaussian(60, 1);
        return [outcome, outcome]
    } else if (condition.endsWith("risky-high")) {
        const outcome = randomGaussian(50, 1);
        return [outcome, outcome]
    } else {
        throw new Error("error: unknown risky-low/risky-high, aborting experiment during getSafeValue()")
    }
}

const getTruncatedDistribution = (mean, sd, min, max) => {
    let outcome = randomGaussian(mean, sd);
    while (outcome < min || outcome > max) {
        outcome = randomGaussian(mean, sd);
    }
    return outcome;
}

const getRiskyValue = (risky_high_or_risky_low) => {
    let lowOutcome = 0;
    let highOutcome = 0;
    if (risky_high_or_risky_low.endsWith("risky-low")) {
        lowOutcome = getTruncatedDistribution(30, 10, 10, 90)
        highOutcome = getTruncatedDistribution(70, 10, 10, 90)
        return [lowOutcome, highOutcome]
    } else if (risky_high_or_risky_low.endsWith("risky-high")) {
        lowOutcome = getTruncatedDistribution(40, 10, 10, 90)
        highOutcome = getTruncatedDistribution(80, 10, 10, 90)
    } else {
        throw new Error("error: unknown risky-low/risky-high, returning zeros during getRiskyValue()")
    }
    return [lowOutcome, highOutcome];
}

// Function that generates outcomes for the safe and risk options based on shuffledOptions as the option parameter
function generateOutcomes(option) {
    let getValue = null
    if (option == "safe") {
        getValue = getSafeValue
    } else if (option == "risky") {
        getValue = getRiskyValue
    }

    let valuesPair = null
    if (condition.endsWith("risky-low")) {
        valuesPair = getValue("risky-low")
    } else if (condition.endsWith("risky-high")) {
        valuesPair = getValue("risky-high")
    } else {
        throw new Error("error: unknown high/low, aborting experiment during generateOutcomes()")
    }
    return valuesPair
}

// Function that uses the Box-Muller transformation to generate a random sample from a gaussian distribution
function randomGaussian(mean, sd) {
    const u1 = Math.random();
    const u2 = Math.random();

    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(Math.PI * 2 * u2);

    return Math.round(z * sd + mean);
}

// Function to detect the trial type and save to the right foldder with the right filename
function saveTrialData(data) {
    trialType = jsPsych.data
        .getLastTrialData()
        .select("trial_type")
        .values.toString();
    switch (trialType) {
        case "survey-text":
            filename = `demographics/${filenameParent}-demographics`;
            saveData(
                filename,
                jsPsych.data.get().filter({ trial_type: "survey-text"}).csv()
            );
            break;
        case "bandit-task":
            filename = `choices/${filenameParent}-choices`;
            saveData(
                filename,
                jsPsych.data.get().filter({ trial_type: "bandit-task" }).csv()
            );
            break;
        case "survey-likert":
            filename = `EARS/${filenameParent}-EARS`;
            saveData(
                filename,
                jsPsych.data.get().filter({ trial_type: "survey-likert" }).csv()
            );
            break;
    }
}

// Function to save data
function saveData(name, data) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "save_data.php");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ filename: filename, filedata: data }));
}
