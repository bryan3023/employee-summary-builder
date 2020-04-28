# Employee Summary Builder

## Synopsis

The program enables a user to create a report of all employees on a team.

## Description

First, you'll be asked to provide information on the manager. Then you'll be asked to provide information on each of the engineers and interns on the team. Once done, you'll be given an HTML roster for that team.

This program validates input. Specifically:

* For each employee, ID numbers, office numbers, and email addresses must be unique.
* ID numbers and office numbers must be positive integers.
* Email addresses must be in a correct format.
* Name, githubusername, and school name must not be blank.

[Watch it in action.](https://drive.google.com/file/d/1pNqjO14d4_NQ3DCc0DIycJkoI5roicMR/view)

## Installation

After copying this repo, run the following in install its dependenacies:

```sh
npm install
```

## Usage

To run this program, type the following:

```sh
node app.js
```

You'll first be prompted for information about the team manager. Then, you'll be asked if you'd like to add any engineers or interns. Add as many of either as you like, providing the information requested. When done, you'll be given the path to team's roster page.

## Testing

This project includes suites of tests than can be run to confirm correctness. To run these suites, type:

```sh
npm run test
```