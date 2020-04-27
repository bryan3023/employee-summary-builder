const
  Engineer = require("./lib/Engineer"),
  Intern = require("./lib/Intern"),
  Manager = require("./lib/Manager"),
  render = require("./lib/htmlRenderer"),
  inquirer = require("inquirer"),
  path = require("path"),
  fs = require("fs");

const
  OUTPUT_DIR = path.resolve(__dirname, "output"),
  outputPath = path.join(OUTPUT_DIR, "team.html");

let employees = []

function init() {
  promptEmployeeType()
}

function promptEmployeeType() {
  inquirer.prompt([
    {
      type: "list",
      message: "What type of employee would you like to add?",
      choices: [
        "Engineer",
        "Intern",
        "Manager"
      ],
      name: "employeeType"
    }
  ]).then(({employeeType}) => {
    promptEmployeeInfo(employeeType)
  })
}


function promptEmployeeInfo(employeeType) {
  const prompts = questions["Common"].slice()
  prompts.push(questions[employeeType])

  inquirer.prompt(prompts).then(response => {
      let employee = employeeBuilder[employeeType](response)
      employees.push(employee)
      promptContinue()
  })
}


function promptContinue() {
  inquirer.prompt([
    {
      message: "Would you like to add another employee (y/n)?",
      name: "addAnother",
      validate: validateYesNo
    }
  ]).then(({addAnother}) => {
    if (addAnother.includes('y')) {
      promptEmployeeType()
    } else {
      saveTeamReport(employees)
    }
  })
}

function saveTeamReport(employees) {
  createFolder(OUTPUT_DIR)

  fs.writeFile(outputPath, render(employees), "utf8", (error) => {
    if (error) {
      return console.error(error)
    }
    console.log(`File saved in: ${outputPath}`)
  })
}

/*
  Create a folder under the project directory if it does not exist.
 */
function createFolder(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}


/*
  Questions needed to create an employee.
 */
const questions = {
  Common: [
    {
      message: "What is the employee's name?",
      name: "name",
      validate: validateMinimal
    },
    {
      message: "What is the employee's ID number?",
      name: "id",
      validate: validatePositiveNumber
    },
    {
      message: "What is the employee's email address?",
      name: "email",
      validate: validateEmailAddress
    }
  ],
  Engineer: {
    message: "What is the employee's Github username?",
    name: "github",
    validate: validateMinimal
  },
  Intern: {
    message: "What school is the employee from?",
    name: "school",
    validate: validateMinimal
  },
  Manager: {
    type: "number",
    message: "What is the employee's office number?",
    name: "officeNumber",
    validate: validatePositiveNumber
  }
}


/*
  Constructor lookup to create the appropriate employee type.
 */
const employeeBuilder = {
  Engineer({name, id, email, github}) {
    return new Engineer(name, id, email, github)
  },

  Intern({name, id, email, school}) {
    return new Intern(name, id, email, school)
  },

  Manager({name, id, email, officeNumber}) {
    return new Manager(name, id, email, officeNumber)
  }
}


// -- Prompt input validation functions ---

/*
  Validate a yes or no answer.
 */
function validateYesNo(answer) {
  return ['y', 'n', 'yes', 'no'].includes(answer.toLowerCase()) ?
    true :
    "Please answer yes or no."
}


/*
  For more unstructured questions, validate the user at least entered something.
 */
function validateMinimal(answer) {
  return answer.trim().length ? true : "Please provide an answer."
}

/*
  Validate an integer of 0 or higher.
 */
function validatePositiveNumber(answer) {
  return parseInt(answer) && answer >= 0 ?
    true :
    `Please provide a positive integer.`
}


/*
  Validate an email address. Regex taken from:
    https://stackoverflow.com/questions/5601647/html5-email-input-pattern-attribute
 */
function validateEmailAddress(answer) {
  return answer.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/) ?
    true :
    "Please provide a valid email address."
}

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

init();