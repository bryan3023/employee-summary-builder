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


/*
  Program entry point.
 */
function init() {
  promptEmployeeType()
}


/*
  Ask what type of employee we should add.
 */
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


/*
  Create the list of questions for the specified employee type and then
  ask the user.
 */
function promptEmployeeInfo(employeeType) {
  const prompts = questions["Common"].slice()
  prompts.push(questions[employeeType])

  inquirer.prompt(prompts).then(response => {
    const employee = employeeBuilder[employeeType](response)
    employees.push(employee)
    promptAddAnother()
  })
}


/*
  Ask if we should add another employee. If so, begin the question sequence
  again. If not, save the report.
 */
function promptAddAnother() {
  inquirer.prompt([
    {
      type: "confirm",
      message: "Would you like to add another employee?",
      name: "addAnother"
    }
  ]).then(({addAnother}) => {
    if (addAnother) {
      promptEmployeeType()
    } else {
      saveTeamReport(employees)
    }
  })
}


/*
  Reneder the report from the list of employees and save it under the
  output folder.
 */
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
  Create a directory if it does not exist.
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


init();