# Eff
> Its a simple, stupid, and easy [test engine] (https://anduong96.github.io/Eff/)
### Installation
Prerequisite: [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and [Gatsby.js](https://www.gatsbyjs.org/tutorial/part-zero/)
```sh
$ git clone git@github.com:anduong96/Eff.git
$ cd Eff
$ npm install
$ npm dev
```

### Development
Want to contribute? Create a pull request

### Sample template
```javascript
[
   {
        "question": [
            "Examine the structure of the employees table.",
            "img[https://res.cloudinary.com/dtcgoqzol/image/upload/v1543024419/oracle12c/Oracle-1z0-061-30_2.png]",
            "You want to display the maximum and minimum salaries of employees hired 1 year ago.",
            "Which two statements would get the correct output?",
            "img[https://res.cloudinary.com/dtcgoqzol/image/upload/v1543024419/oracle12c/Oracle-1z0-061-31_2.png]"
        ],
        "choices": {
            "A": "Option A",
            "C": "Option C",
            "B": "Option B",
            "D": "Option D"
        },
        "answer": ["A", "C"],
        "explain": "In case WHERE clause is presented, the GROUP BY clause must be placed before the WHERE clause."
    },
    ...
]
```
