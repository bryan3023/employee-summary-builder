const Employee = require("./Employee");

class Manager extends Employee {
  constructor(name, id, email, officeNumber) {
    super(name, id, email)
    this.officeNumber = parseInt(officeNumber)
  }

  getOfficeNumber() {
    return this.officeNumber
  }
}

module.exports = Manager