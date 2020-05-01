"use strict"

const
  Engineer = require("./lib/Engineer"),
  Intern = require("./lib/Intern"),
  Manager = require("./lib/Manager"),
  render = require("./lib/htmlRenderer"),
  inquirer = require("inquirer"),
  path = require("path"),
  fs = require("fs");

const
  employees = [],
  OUTPUT_DIR = path.resolve(__dirname, "output"),
  outputPath = path.join(OUTPUT_DIR, "team.html");


/*
  Program entry point.
 */
function init() {
  console.log("Please build your team.")
  promptEmployeeInfo("Manager")
}


/*
  Ask the user questions appropriate for the specified employee type.
 */
function promptEmployeeInfo(employeeType) {
  const prompts = getEmployeeQuestions(employeeType)

  inquirer.prompt(prompts).then(response => {
    response = sanitizeInput(response)
    const employee = employeeBuilder[employeeType](response)
    employees.push(employee)
    promptAddAnother()
  })
}


/*
  Ask if we should add another employee. If so, begin the question sequence.
  If not, save the report.
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
  Ask what type of employee we should add.
 */
function promptEmployeeType() {
  inquirer.prompt([
    {
      type: "list",
      message: "What type of employee would you like to add?",
      choices: [
        "Engineer",
        "Intern"
      ],
      name: "employeeType"
    }
  ]).then(({employeeType}) => {
    promptEmployeeInfo(employeeType)
  })
}


/*
  Render the report from the list of employees and save it under the
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
  Get a set of questions appropriate for the specified employee type.
 */
function getEmployeeQuestions(employeeType) {
  const prompts = questions["Common"].slice()
  prompts.push(questions[employeeType])

  return prompts.map(q => {
    return {
      name: q.name,
      message: q.message.replace('{0}', employeeType.toLowerCase()),
      validate: q.validate
    }
  })
}


/*
  Questions needed to create an employee.
 */
const questions = {
  Common: [
    {
      message: "What is the {0}'s name?",
      name: "name",
      validate: validateMinimal
    },
    {
      message: "What is the {0}'s ID number?",
      name: "id",
      validate: validateId
    },
    {
      message: "What is the {0}'s email address?",
      name: "email",
      validate: validateEmailAddress
    }
  ],
  Engineer: {
    message: "What is the engineer's Github username?",
    name: "github",
    validate: validateMinimal
  },
  Intern: {
    message: "What school is the intern from?",
    name: "school",
    validate: validateMinimal
  },
  Manager: {
    message: "What is the manager's office number?",
    name: "officeNumber",
    validate: validateOfficeNumber
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
  For prompt responses, ensure numbers are converted to integers and trim
  whitespace around strings.
 */
function sanitizeInput(response) {
  for (let item in response) {
    const value = response[item]
    if (parseInt(value)) {
      response[item] = parseInt(value)
    } else {
      response[item] = value.trim()
    }
  }
  return response
}


/*
  For more unstructured questions, validate the user at least entered something.
 */
function validateMinimal(answer) {
  return answer.trim().length ? true : "Please provide an answer."
}


/*
  Validate the office number is a unique integer.
 */
function validateOfficeNumber(answer) {  
  return validateUniquePositiveInteger(answer, "getOfficeNumber", "office number")
}


/*
  Validate the ID is a unique integer.
 */
function validateId(answer) {
  return validateUniquePositiveInteger(answer, "getId", "ID")
}


/**
  Validate the answer is a unique integer within a set of objects
    @param {string} answer the answer returned from the prompt
    @param {string} getter the getter method name of the property to
      compare against
    @param {string} name the friendly name of the object property
 */
function validateUniquePositiveInteger(answer, getter, name) {
  const match = employees.filter(e =>
    getter in e ? parseInt(answer) === e[getter]() : false
  )

  return isPositiveInteger(answer) && 0 === match.length ?
    true :
    `Please enter a unique, positive integer for the ${name}.`
}


/*
  Is answer an integer of 1 or higher?
 */
function isPositiveInteger(answer) {
  const answerInt = parseInt(answer)
  return answerInt && answerInt > 0
}


/*
  Validate an email address. Regex taken from:
    https://stackoverflow.com/questions/5601647/html5-email-input-pattern-attribute
 */
function validateEmailAddress(answer) {
  const match = answer
    .trim()
    .toLowerCase()
    .match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)

  return match && isUniqueEmailAddress(answer) ?
    true :
    "Please provide a unique, valid email address."
}


/*
  Is the email address unique among the set of existing employees?
 */
function isUniqueEmailAddress(answer) {
  const match = employees.filter(e => answer.trim() === e.getEmail())
  return 0 === match.length
}


init();