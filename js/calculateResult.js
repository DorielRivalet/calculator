function add(x, y) {
  return Number(x) + Number(y); //+ converts string to number
}

function substract(x, y) {
  return Number(x) - Number(y);
}

function multiply(x, y) {
  return Number(x) * Number(y);
}

function divide(x, y) {
  if (Number(y) === 0) {
    return false;
  }
  return Number(x) / Number(y);
}

function power(x, y) {
  return Number(x) ** Number(y);
}

function modulo(x, y) {
  return Number(x) % Number(y);
}

function operate(operator, operand1, operand2) {
  let currentResult;
  switch (operator) {
    case "+":
      currentResult = add(operand1, operand2);
      break;
    case "-":
      currentResult = substract(operand1, operand2);
      break;
    case "*":
    case "×":
    case "x":
      currentResult = multiply(operand1, operand2);
      break;
    case "/":
    case "÷":
      currentResult = divide(operand1, operand2);
      break;
    case "^":
      currentResult = power(operand1, operand2);
      break;
    case "%":
      currentResult = modulo(operand1, operand2);
  }
  return currentResult;
}

const calculateResult = function (input) {
  //this function might be too big

  if (input.includes("i")) {
    return "Math ERROR"; //only real numbers!!!
  }

  let result;
  let currentInput = input;
  //https://stackoverflow.com/questions/638565/parsing-scientific-notation-sensibly
  //written with help of https://regexr.com/ cheatsheet
  let inputRegex =
    /^[+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d+)?(?:(?<=\d)(?:[eE][+-]?\d+))?([+×x*-÷/%^]{1})[+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d+)?(?:(?<=\d)(?:[eE][+-]?\d+))?$/g;
  // first operand: /^[+\-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d+)?(?:(?<=\d)(?:[eE][+\-]?\d+))?
  // operator: ([\+\×\x\*\-\÷\/\%\^]{1})
  // second operand: [+\-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d+)?(?:(?<=\d)(?:[eE][+\-]?\d+))?$/g;

  let onlyFirstOperandRegex =
    /^[+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d+)?(?:(?<=\d)(?:[eE][+-]?\d+))?$/g;
  let OPERATOR_REGEX = /([\+\×\x\*\-\÷\/\%\^]{1})/g;
  let onlyInputFirstOperand = onlyFirstOperandRegex.test(currentInput);
  let isSyntaxCorrect = inputRegex.test(currentInput);

  if (onlyInputFirstOperand) {
    result = Number.parseFloat(currentInput);
    if (result) {
      return result;
    } else {
      return "Syntax ERROR";
    }
  }

  if (!isSyntaxCorrect) {
    return "Syntax ERROR";
  }

  //lazy initialization
  let currentOperator;
  let numbers;
  let firstOperand;
  let secondOperand;

  //solution for negative numbers
  if (currentInput[0] === "-") {
    let newCurrentInput = currentInput.slice(1);
    currentOperator = newCurrentInput[newCurrentInput.search(OPERATOR_REGEX)];
    numbers = newCurrentInput.split(currentOperator, 3);
    firstOperand = "-" + numbers[0];
    secondOperand = currentInput.slice(firstOperand.length + 1);
  } else {
    currentOperator = currentInput[currentInput.search(OPERATOR_REGEX)];
    numbers = currentInput.split(currentOperator, 3);
    firstOperand = numbers[0];
    secondOperand = currentInput.slice(firstOperand.length + 1);
  }

  //workaround for negative exponents in the scientific notation
  if (firstOperand.slice(-1) === "e") {
    let newCurrentInput;
    if (
      currentInput[firstOperand.length] === "-" ||
      currentInput[firstOperand.length] === "+"
    ) {
      newCurrentInput = currentInput.slice(firstOperand.length + 1);
    } else {
      newCurrentInput = currentInput.slice(firstOperand.length);
    }
    currentOperator = newCurrentInput[newCurrentInput.search(OPERATOR_REGEX)];
    let newNumbers = newCurrentInput.split(currentOperator, 3);
    firstOperand += currentInput[firstOperand.length];
    firstOperand += newNumbers[0];
    secondOperand = currentInput.slice(firstOperand.length + 1);
  }

  if (secondOperand === "-undefined") {
    //because of secondOperand = "-"+numbers[2]; and numbers[2] being undefined and doing + concatenation between string and undefined returns -undefined as a string.
    return "Syntax ERROR";
  }

  result = operate(currentOperator, firstOperand, secondOperand);

  if (result === false || Number.isNaN(result)) {
    return "Math ERROR";
  }

  return result;
};

module.exports = calculateResult; //jest test
