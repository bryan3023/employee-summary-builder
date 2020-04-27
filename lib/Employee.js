class Employee {
  constructor(name, id, email) {
    this.name = name.trim()
    this.id = parseInt(id)
    this.email = email.trim()
  }

  getName() {
    return this.name
  }

  getId() {
    return this.id
  }

  getEmail() {
    return this.email
  }

  getRole() {
    return this.constructor.name;
  }
}

module.exports = Employee