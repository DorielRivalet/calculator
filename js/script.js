/* JavaScript Document */

/*⭒☆━━━━━━━━━━━━━━━☆⭒⭒☆━━━━━━━━━━━━━━━☆⭒⭒☆━━━━━━━━━━━━━━━☆⭒
INDEX
01. Variables
02. Functions
03. Events

⭒☆━━━━━━━━━━━━━━━☆⭒⭒☆━━━━━━━━━━━━━━━☆⭒⭒☆━━━━━━━━━━━━━━━☆⭒*/

/*=^..^=   =^..^=   =^..^=    =^..^=    =^..^=    =^..^=    =^..^=
01. Variables
※ Creating variables: We start by declaring their names and if their values are either constant or going to change later on in the program,  and then assigning their values to either DOM nodes, other variables, strings, numbers, arrays or booleans.
※ Anytime we assign something to a variable, we are doing three things:
  1) Creating the variable name in the current scope's lookup table (where all variable names are defined).
  2) Evaluating the expression to the right of the equals, and placing the result at some location in the browser's allocated memory.
  3) Assigning the variable name in that lookup table to reference that specific memory location.
※ Ans stands for the previous calculator answer.
※ Dark Mode is activated via clicking the L0-K1 button.
※ Calculator states are used for handling the behaviour of functions after certain actions.
=^..^=   =^..^=   =^..^=    =^..^=    =^..^=    =^..^=    =^..^=*/

// see config.js
const OPERATOR_REGEX = config.OPERATOR_REGEX;
const INITIAL_INPUT_VALUE = config.INITIAL_INPUT_VALUE;
const INITIAL_RESULT_VALUE = config.INITIAL_RESULT_VALUE;
const INITIAL_SCREEN_TEXT_COLOR = config.INITIAL_SCREEN_TEXT_COLOR;
const INITIAL_SCREEN_BACKGROUND_COLOR = config.INITIAL_SCREEN_BACKGROUND_COLOR;
const HISTORY_LOG_INITIAL_TEXT = config.HISTORY_LOG_INITIAL_TEXT;
/*
Document
Object
Model   
*/
const settingsModal = document.getElementById("settingsModal");
const defaultSettingsButton = document.getElementById("defaultSettings");
const colorOptionsElement = document.querySelector(".colorOptions");
const historyLogElement = document.getElementById("historyLog");
const colorsTabButton = document.getElementById("colorsTab");
const historyTabButton = document.getElementById("historyTab");
const cogIcon = document.getElementById("cogIcon");
const overlay = document.getElementById("overlay");
const screenElement = document.getElementById("display");
const screenTextColorPicker = document.getElementById("screenTextColor");
const screenBackgroundColorPicker = document.getElementById(
  "screenBackgroundColor"
);
const starryBackgroundElement = document.querySelector(".background-container");
const inputElement = document.querySelector(".userInputValue");
const waitEffectElement = document.querySelector(".waitingEffect");
const resultElement = document.querySelector(".result");
const buttonsElements = document.querySelectorAll(".buttonSection button");
const numberButtonElements = document.querySelectorAll(
  ".buttonSection .numberButton"
);
const operatorButtonElements = document.querySelectorAll(
  ".buttonSection .operatorButton"
);
const functionButtonElements = document.querySelectorAll(
  ".buttonSection .functionButton"
);
const clearButtonElement = document.querySelector("#ac");
const equalButtonElement = document.querySelector(
  ".buttonSection .equalButton"
);
const powerButtonElement = document.querySelector("#power");
const plusButtonElement = document.querySelector("#plus");
const minusButtonElement = document.querySelector("#minus");
const multiplyButtonElement = document.querySelector("#multiply");
const divideButtonElement = document.querySelector("#divide");
const modelNameButtons = document.querySelectorAll(".modelName button");
const productIdElement = document.querySelector(".modelName .productId");
const calculatorElement = document.querySelector(".calculator");
const displaySectionElement = document.querySelector(".displaySection");
const githubIcon = document.querySelector(".fa-github");

inputElement.textContent = INITIAL_INPUT_VALUE;
resultElement.textContent = INITIAL_RESULT_VALUE;
inputElement.style.opacity = 0;
waitEffectElement.style.opacity = 0;
resultElement.style.opacity = 0;

let Ans;
let isDarkMode = false;
let isSettingsModalActive = false;
let currentState = "Off"; // 0/1/2/3 Off/On/Standby/Error. Need Enums. With Ruby or TypeScript?
let nIntervId; // variable to store our intervalID

/*=^..^=   =^..^=   =^..^=    =^..^=    =^..^=    =^..^=    =^..^=
02. Functions (also called subroutines, or methods when talking about objects)
※ The WaitForInput and its previous and next functions handles a waiting effect when turning on the calculator.
※ Various functions in this file apply the concept of early returns (also called guard clauses) to check whether the current calculator state or the value of the user input are correct. 
※ The common algorithm flow is as follows:
  1) Wait for calculator to be turned on.
  2) Process user input as either a keyboard key or a button press.
  3) Check if the input is either a number, an operator, or a function (such as Ans, Equals, Clear or Delete).
  4) Add the input to the display element (or delete it if pressing the Power, Clear or Delete buttons)
  5) When pressing the Equal button, evaluate the current input.
  6) If the current input passes the regex test, then perform the calculations according to the input.
  7) Display the result and store the result in the Ans variable if successful.
  8) Change the calculator state to either Error or Standby according to regex test or calculation test pass/fail.
  9) Go back to 2), or 1) if pressing the Power Button at anytime.
=^..^=   =^..^=   =^..^=    =^..^=    =^..^=    =^..^=    =^..^=*/

//https://developer.mozilla.org/en-US/docs/Web/API/setInterval
function initializeWaitForInput() {
  // check if already an interval has been set up
  if (!nIntervId) {
    nIntervId = setInterval(waitForInput, 500);
  }
}

function waitForInput() {
  const oElem = waitEffectElement;
  if (oElem.style.opacity === "1") {
    oElem.style.opacity = 0;
  } else {
    oElem.style.opacity = 1;
  }
}

function stopWaitForInput() {
  clearInterval(nIntervId);
  // release our intervalID from the variable
  waitEffectElement.style.opacity = 0;
  nIntervId = null;
}

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

function inputFromHistoryLog(event) {
  //https://stackoverflow.com/questions/6623231/remove-all-white-spaces-from-text
  let pastOperationContent = event.target.textContent.replace(/\s/g, "");
  let pastOperationArray = pastOperationContent.split("=");
  inputElement.textContent = pastOperationArray[0];
  resultElement.textContent = pastOperationArray[1];
  initializeWaitForInput();
  currentState = "On";
  inputElement.style.textAlign = "start";
}

function createClearHistoryLogButton() {
  let clearHistoryLogButton = document.createElement("button");
  clearHistoryLogButton.textContent = "Clear history";
  clearHistoryLogButton.classList.add("clearHistoryButton");
  clearHistoryLogButton.addEventListener("click", clearHistory);
  historyLogElement.append(clearHistoryLogButton);
}

function logCurrentOperationToHistory(
  firstOperand,
  currentOperator,
  secondOperand,
  result
) {
  let currentOperation = document.createElement("div");
  //string interpolation
  currentOperation.textContent = `${firstOperand} ${currentOperator} ${secondOperand} = ${result}`;
  currentOperation.setAttribute(
    "title",
    "Select this equation to input into the calculator"
  );
  currentOperation.addEventListener("click", inputFromHistoryLog);
  historyLogElement.append(currentOperation);
}

function clearHistory() {
  let clearHistoryButton = document.querySelector(".clearHistoryButton");
  clearHistoryButton.removeEventListener("click", clearHistory);
  historyLogElement.textContent = HISTORY_LOG_INITIAL_TEXT;
}

function clearInput() {
  if (currentState === "Error" || currentState === "Standby") {
    currentState = "On";
    inputElement.style.textAlign = "start";
  }
  inputElement.textContent = INITIAL_INPUT_VALUE;
  resultElement.textContent = INITIAL_RESULT_VALUE;
  clearButtonElement.textContent = "AC";
}

function calculateResult() {
  //this function might be too big
  if (
    currentState === "Error" ||
    currentState === "Standby" ||
    inputElement.textContent === ""
  ) {
    return false;
  }

  if (inputElement.textContent.includes("i")) {
    return "Math ERROR"; //only real numbers!!!
  }

  let result;
  let currentInput = inputElement.textContent;
  //https://stackoverflow.com/questions/638565/parsing-scientific-notation-sensibly
  //written with help of https://regexr.com/ cheatsheet
  let inputRegex =
    /^[+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d+)?(?:(?<=\d)(?:[eE][+-]?\d+))?([+×x*-÷/%^]{1})[+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d+)?(?:(?<=\d)(?:[eE][+-]?\d+))?$/g;
  // first operand: /^[+\-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d+)?(?:(?<=\d)(?:[eE][+\-]?\d+))?
  // operator: ([\+\×\x\*\-\÷\/\%\^]{1})
  // second operand: [+\-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d+)?(?:(?<=\d)(?:[eE][+\-]?\d+))?$/g;

  let onlyFirstOperandRegex =
    /^[+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d+)?(?:(?<=\d)(?:[eE][+-]?\d+))?$/g;
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

  if (historyLogElement.textContent === HISTORY_LOG_INITIAL_TEXT) {
    historyLogElement.textContent = "";
    createClearHistoryLogButton();
  }

  logCurrentOperationToHistory(
    firstOperand,
    currentOperator,
    secondOperand,
    result
  );

  return result;
}

function displayResult(result) {
  if (result === false) {
    return;
  }
  switch (result) {
    case "Syntax ERROR":
    case "Math ERROR":
      inputElement.textContent = result;
      resultElement.textContent = "";
      currentState = "Error";
      inputElement.style.textAlign = "end";
      break;
    default:
      //https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
      result = Math.round((result + Number.EPSILON) * 10000) / 10000;
      resultElement.textContent = result;
      currentState = "Standby";
      Ans = result;
  }
}

function deleteInput() {
  if (currentState === "Error" || currentState === "Standby") {
    return;
  }
  if (inputElement.textContent.length === 1) {
    inputElement.textContent = "";
    clearButtonElement.textContent = "AC";
    initializeWaitForInput();
    return;
  }
  inputElement.textContent = inputElement.textContent.slice(
    0,
    inputElement.textContent.length - 1
  );
}

function switchPower() {
  if (currentState === "Off") {
    powerButtonElement.textContent = "OFF";
    currentState = "On";
    inputElement.style.opacity = 1;
    waitEffectElement.style.opacity = 1;
    resultElement.style.opacity = 1;
    inputElement.style.textAlign = "start";
    initializeWaitForInput(); //wait for input effect
  } else {
    powerButtonElement.textContent = "ON";
    currentState = "Off";
    clearInput();
    stopWaitForInput();
    inputElement.style.opacity = 0;
    waitEffectElement.style.opacity = 0;
    resultElement.style.opacity = 0;
  }
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

function onNumberPress(input) {
  if (currentState === "Error" || input === undefined) {
    return;
  }
  if (inputElement.textContent === "") {
    //stopWaitForInput()
    inputElement.textContent += input;
    clearButtonElement.textContent = "CE";
    return;
  }
  if (currentState === "Standby") {
    currentState = "On";
    initializeWaitForInput();
    inputElement.textContent = "";
    inputElement.textContent += input;
    return;
  }
  inputElement.textContent += input;
}

function onOperatorPress(input) {
  if (currentState === "Error") {
    return;
  }
  if (inputElement.textContent === "") {
    //stopWaitForInput()
    inputElement.textContent = "0" + input;
    clearButtonElement.textContent = "CE";
    return;
  }
  if (currentState === "Standby") {
    currentState = "On";
    initializeWaitForInput();
    inputElement.textContent = "";
    inputElement.textContent += Ans + input;
    return;
  }
  inputElement.textContent += input;
}

function onInput(event) {
  if (currentState === "Off") {
    return;
  }
  //since the || operator here returns the first truthy value, we can use it to make the input variable value be event.key if event.key exists, or event.target.textContent otherwise if it doesn't (or do nothing if both values are falsy). The order here doesn't matter though, as let input = event.target.textContent || event.key; also works the same for our use case.
  let input = event.key || event.target.textContent;
  switch (input) {
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case ".": //techniqually not a number. used for making decimals.
      onNumberPress(input);
      break;
    case "+":
    case "-":
    case "*":
    case "x":
    case "/":
    case "÷":
    case "×":
    case "%": //modulo
    case "^": //exponent
      onOperatorPress(input);
      break;
    case "DEL":
    case "Backspace":
      deleteInput();
      break;
    case "Delete":
    case "AC":
    case "CE":
    case "Escape":
      clearInput();
      initializeWaitForInput();
      break;
    case "Enter":
    case "=":
      displayResult(calculateResult()); //calculateResult returns the result value which displayResult then displays.
      stopWaitForInput();
      break;
    case "ANS": //previous stored answer, or undefined if not stored.
    case "A":
      onNumberPress(Ans);
      break;
    case "e": //number times (10 to the x power). scientific notation.
      onNumberPress("e");
      break;
    case "E": //https://en.wikipedia.org/wiki/List_of_mathematical_constants
    case "ℇ":
      onNumberPress(2.718281828459045); //Euler's Number
      break;
    case "p":
    case "π":
      onNumberPress(3.141592653589793); //Pi
      break;
    case "a":
      onNumberPress(1.202056903159594); //Artin's constant
      break;
    case "b":
      onNumberPress(1.902160583104); // Brun's constant
      break;
    case "c":
      onNumberPress(0.235711131719232); // Copeland–Erdős constant
      break;
    case "d":
      onNumberPress(0.73908513321516); // Dottie number
      break;
    case "f":
      onNumberPress(1.187452351126501); // Foias constant
      break;
    case "g":
      onNumberPress(1.618033988749894); // Golden ratio
      break;
    case "G":
      onNumberPress(0.834626841674073); // Gauss' constant
      break;
    case "h":
      onNumberPress(0.353236371854995); // Hafner–Sarnak–McCurley constant
      break;
    case "i":
      onNumberPress("i"); // Imaginary unit
      break;
    /*     case "j":
      onNumberPress(1.6180);
      break; */
    case "k":
      onNumberPress(0.114942044853296); // Kepler–Bouwkamp constant
      break;
    case "l":
      onNumberPress(0.662743419349181); // Laplace limit
      break;
    case "m":
      onNumberPress(0.9553166181245092); // Magic angle
      break;
    case "n":
      onNumberPress(1.705211140105367); // Niven's constant
      break;
    case "o":
      onNumberPress(0.567143290409783); // Omega constant
      break;
    /*     case "q":
      onNumberPress(1.6180);
      break; */
    case "r":
      onNumberPress(262537412640768743.9); // Ramanujan's constant
      break;
    case "s":
      onNumberPress(2.414213562373095); // Silver ratio
      break;
    case "t":
      onNumberPress(0.660161815846869); // Twin prime constant
      break;
    case "u":
      onNumberPress(2.295587149392638); // Universal parabolic constant
      break;
    case "v":
      onNumberPress(4.532360141827193); // Van der Pauw constant
      break;
    case "w":
      onNumberPress(2.094551481542326); // Wallis's constant
      break;
    /*     case "x":
      onNumberPress(1.6180);
      break;
    case "y":
      onNumberPress(2.4142);
      break; */
    case "z":
      onNumberPress(1.959963984540054); // Z score for the 97.5 percentile point
  }
}

function toggleDarkModeButtons() {
  if (isDarkMode) {
    divideButtonElement.textContent = "^";
    divideButtonElement.setAttribute("title", "Power [^]");
    multiplyButtonElement.textContent = "%";
    multiplyButtonElement.setAttribute("title", "Modulo [%]");
    minusButtonElement.textContent = "π";
    minusButtonElement.setAttribute("title", "Pi [p]");
    plusButtonElement.textContent = "ℇ";
    plusButtonElement.setAttribute("title", "Euler's number [e]");
    starryBackgroundElement.style.display = "block";
  } else {
    divideButtonElement.textContent = "÷";
    divideButtonElement.setAttribute("title", "Divide [/]");
    multiplyButtonElement.textContent = "×";
    multiplyButtonElement.setAttribute("title", "Multiply [*|x]");
    minusButtonElement.textContent = "-";
    minusButtonElement.setAttribute("title", "Substract [-]");
    plusButtonElement.textContent = "+";
    plusButtonElement.setAttribute("title", "Add [+]");
    starryBackgroundElement.style.display = "none";
  }
}

function toggleTheme() {
  isDarkMode = !isDarkMode; //if true then turn to false (which is the same as !true), if false then turn to true (which is the same as !false).
  document.body.classList.toggle("dark-mode");
  calculatorElement.classList.toggle("dark-modeCalculator");
  productIdElement.classList.toggle("dark-modeProductId");
  displaySectionElement.classList.toggle("dark-modeDisplaySection");
  modelNameButtons.forEach((currentButton) =>
    currentButton.classList.toggle("dark-modeModelName")
  ); //arrow functions
  buttonsElements.forEach((currentButton) =>
    currentButton.classList.toggle("dark-modeButtonSection")
  );
  numberButtonElements.forEach((currentButton) =>
    currentButton.classList.toggle("dark-modeNumberButton")
  );
  operatorButtonElements.forEach((currentButton) =>
    currentButton.classList.toggle("dark-modeOperatorButton")
  );
  functionButtonElements.forEach((currentButton) =>
    currentButton.classList.toggle("dark-modeFunctionButton")
  );
  equalButtonElement.classList.toggle("dark-modeEqualButton");
  githubIcon.classList.toggle("dark-mode-fa-github");
  toggleDarkModeButtons();
}

function removeModal() {
  isSettingsModalActive = false;
  settingsModal.classList.remove("active");
  overlay.classList.remove("active");
  overlay.removeEventListener("click", removeModal);
  historyLogElement.classList.remove("active");
  colorOptionsElement.classList.remove("active");
}

function switchTabs(event) {
  switch (event.target.id) {
    case "historyTab":
      historyLogElement.classList.add("active");
      colorOptionsElement.classList.remove("active");
      break;
    case "colorsTab":
      historyLogElement.classList.remove("active");
      colorOptionsElement.classList.add("active");
  }
}

function toggleSettingsModal() {
  if (!isSettingsModalActive) {
    isSettingsModalActive = true;
    settingsModal.classList.add("active");
    overlay.classList.add("active");
    colorOptionsElement.classList.add("active");
    overlay.addEventListener("click", removeModal);
    historyTabButton.addEventListener("click", switchTabs);
    colorsTabButton.addEventListener("click", switchTabs);
  } else {
    removeModal();
  }
}

function restoreDefaultSettings() {
  screenElement.style.color = INITIAL_SCREEN_TEXT_COLOR;
  screenElement.style.backgroundColor = INITIAL_SCREEN_BACKGROUND_COLOR;
  screenTextColorPicker.value = INITIAL_SCREEN_TEXT_COLOR;
  screenBackgroundColorPicker.value = INITIAL_SCREEN_BACKGROUND_COLOR;
}

function watchColorPicker(event) {
  switch (event.target.id) {
    case "screenTextColor":
      screenElement.style.color = event.target.value;
      break;
    case "screenBackgroundColor":
      screenElement.style.backgroundColor = event.target.value;
  }
}

/*=^..^=   =^..^=   =^..^=    =^..^=    =^..^=    =^..^=    =^..^=
03. Events
※ DOM Manipulation: Adding event listeners to the DOM Nodes and Nodelists; which are referenced through variable names, whose values where gotten via the query selector subroutine.
※ Since buttonsElements is a nodelist, we can use the forEach method to add an event listener to each button element.
=^..^=   =^..^=   =^..^=    =^..^=    =^..^=    =^..^=    =^..^=*/

document.addEventListener("keydown", onInput);
buttonsElements.forEach(function (currentButton) {
  currentButton.addEventListener("click", onInput);
});
productIdElement.addEventListener("click", toggleTheme); //easter egg
powerButtonElement.addEventListener("click", switchPower);
cogIcon.addEventListener("click", toggleSettingsModal);
screenTextColorPicker.addEventListener("input", watchColorPicker, false);
screenBackgroundColorPicker.addEventListener("input", watchColorPicker, false);
defaultSettingsButton.addEventListener("click", restoreDefaultSettings);
