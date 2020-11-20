// const questionstions = [
// ];
// function writeToFile(fileName, data) {
// }
// function init() {
// }
// init();

const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");
const generateHTML = require("./generateHTML");
const writeFileAsync = util.promisify(fs.writeFile);
const pdf = require('html-pdf');

//Global Object Definition
const questions = [
    {
        type: "input",
        message: "Enter your GitHub username?",
        name: "username"
    },
    {
        type: "list",
        message: "What's your favorite color?",
        name: "color",
        choices: [
            "green",
            "blue",
            "pink",
            "red"
        ]
    }
];

// Initialize with questions to user
function init() {
    inquirer
        .prompt(questions)
        .then(function (input) {
            // console.log(answers);
            username = input.username;
            favColor = input.color;
            const queryUrl = `https://api.github.com/users/${username}`;
            return queryUrl;
        })
        .then(function (queryUrl) {
            axios.get(queryUrl)
                .then(function (response) {
                    response.data.color = favColor; // sets data color property for html
                    writeToFile(response.data); // Writes to html file
                })
                .then(function () {
                    console.log(`Successfully wrote to index.html`);
                })
                .catch(function (error) {
                    console.log("Please enter a valid Github username", error);
                    return;
                });
        });
};


//Writes to the index.html file
function writeToFile(info) {
    const html = generateHTML(info);
    writeFileAsync("index.html", html);
    convertToPdf(html);
};

//Converts generated html file to pdf format
function convertToPdf(htmlPdf) {
    options = { format: 'Letter' };
    pdf.create(htmlPdf, options).toFile('./resume.pdf', function (err, res) {
        if (err)
            return console.log(err);
        console.log("Pdf Successfully generated", res);
    })
};

//Starts the process
init();
  ]);
}

function generateHTML(answers) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Document</title>
</head>
<body>
  <div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-4">Hi! My name is ${answers.name}</h1>
    <p class="lead">I am from ${answers.location}.</p>
    <h3>Example heading <span class="badge badge-secondary">Contact Me</span></h3>
    <ul class="list-group">
      <li class="list-group-item">My GitHub username is ${answers.github}</li>
      <li class="list-group-item">LinkedIn: ${answers.linkedin}</li>
    </ul>
  </div>
</div>
</body>
</html>`;
}

promptUser()
  .then(function(answers) {
    const html = generateHTML(answers);

    return writeFileAsync("index.html", html);
  })
  .then(function() {
    console.log("Successfully wrote to index.html");
  })
  .catch(function(err) {
    console.log(err);
  });
