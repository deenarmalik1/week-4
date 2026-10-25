// Use IIFE, closure, and hoisting in a quiz/form validation setup:-

// IIFE creates private scope - no global pollution
const quizApp = (function() {
  // Hoisting demo: we can call function before declaration, var hoisted
  console.log("we hoisted var", hoistedVar); // undefined not error
  var hoistedVar = "we IIFE var";
  console.log("we after", hoistedVar);
  
  init(); // we hoisted function can be called before declaration
  
  function init() {
    console.log("we init hoisted works");
  }

  // Closure - private state
  let score = 0;
  let questions = [{ q: "we 2+2?", ans: 4 }, { q: "we 5*2?", ans: 10 }];

  function checkAnswer(qIndex, userAns) {
    // closure retains score
    if (questions[qIndex].ans == userAns) {
      score++;
      return true;
    }
    return false;
  }

  function getScore() {
    return score; // closure access
  }

  return { checkAnswer, getScore, questions };
})();

console.log(quizApp.checkAnswer(0, 4)); // true
console.log(quizApp.checkAnswer(1, 5)); // false
console.log("we score", quizApp.getScore()); // 1
// console.log(score) -> error, private due to IIFE+closure

// Form validation with closure
function createValidator() {
  let errors = []; // we private via closure
  return {
    validate(name, age) {
      errors = [];
      if (!name) errors.push("we name required");
      if (age < 18) errors.push("we age 18+ required");
      return errors.length === 0;
    },
    getErrors() { return errors; }
  };
}
let validator = createValidator();
console.log(validator.validate("", 15));
console.log(validator.getErrors());