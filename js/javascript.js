/* JS Document */

/*-------------------------------------
INDEX
01. Variables
02. Functions
03. Events

-------------------------------------*/


/*====================================================================
01. Variables
※ We start by declaring their names and if their values are either constant or going to change,  and then assigning their values to DOM nodes.
※ Ans stands for the previous calculator answer.
※ Dark Mode is activated via clicking the L0-K1 button.
※ Calculator states are used for handling the behaviour of functions after certain actions.
====================================================================*/

//DOM
const starryBackgroundElement = document.querySelector(".background-container");
const inputElement = document.querySelector('.inputValue');
const resultElement = document.querySelector('.result');
const buttonsElements = document.querySelectorAll('.buttonSection button');
const numberButtonElements = document.querySelectorAll('.buttonSection .numberButton');
const operatorButtonElements = document.querySelectorAll('.buttonSection .operatorButton');
const functionButtonElements = document.querySelectorAll('.buttonSection .functionButton');
const clearButtonElement = document.querySelector('#ac');
const equalButtonElement = document.querySelector('.buttonSection .equalButton');
const powerButtonElement = document.querySelector('#power');
const plusButtonElement = document.querySelector('#plus');
const minusButtonElement = document.querySelector('#minus');
const multiplyButtonElement = document.querySelector('#multiply');
const divideButtonElement = document.querySelector('#divide');
const modelNameButtons = document.querySelectorAll('.modelName button');
const productIdElement = document.querySelector('.modelName .productId');
const calculatorElement = document.querySelector('.calculator');
const displaySectionElement = document.querySelector('.displaySection');
const githubIcon = document.querySelector("footer i");
const operatorRegex = /([\+\×\-\÷\%\^]{1})/g;
const initialInputValue = "_";
const initialResultValue = 0;

inputElement.textContent = initialInputValue;
resultElement.textContent = initialResultValue;
inputElement.style.opacity = 0;
resultElement.style.opacity = 0;

let Ans;
let isDarkMode = false;
let currentState = "Off"; // 0/1/2/3 Off/On/Standby/Error. Need Enums
let nIntervId; // variable to store our intervalID
let historyLog = []; //todo: history, custom fonts and display background color picker settings cog icon. text shadow  blue red chromatic aberration


/*====================================================================
02. Functions
※ The WaitForInput and its previous and next functions handles a waiting effect when turning on the calculator.
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
====================================================================*/

//https://developer.mozilla.org/en-US/docs/Web/API/setInterval
function initializeWaitForInput() { 
// check if already an interval has been set up
  if (!nIntervId) {
    nIntervId = setInterval(waitForInput, 500);
  }
}

function waitForInput() {
  const oElem = inputElement;
  if (oElem.style.opacity === "1") {
    oElem.style.opacity = 0;
  } else {
    oElem.style.opacity = 1;
  }
}

function stopWaitForInput() {
  clearInterval(nIntervId);
  // release our intervalID from the variable
  inputElement.style.opacity = 1;
  nIntervId = null;
}

function add(x,y){
  return Number(x) + Number(y); //+ converts string to number
}

function substract(x,y){
  return Number(x) - Number(y);
}

function multiply(x,y){
  return Number(x) * Number(y);
}

function divide(x,y){
  if (Number(y) === 0){
    return false
  }
  return Number(x) / Number(y);
}

function power(x,y){
  return Number(x) ** Number(y);
}

function modulo(x,y){
  return Number(x) % Number(y);
}

function clearInput(){
  if (currentState === "Error" || currentState === "Standby"){
    currentState = "On";
  }
  inputElement.textContent = initialInputValue;
  resultElement.textContent = initialResultValue;
  clearButtonElement.textContent = "AC";
}

function calculateResult(){
  if (currentState === "Error" || currentState === "Standby" || inputElement.textContent === "_"){
    return false
  }

  if (inputElement.textContent.search(/\i+/) === "i"){//todo

  }

  let result;
  let currentInput = inputElement.textContent;
  //written with help of https://regexr.com/ cheatsheet
  let inputRegex = /^[+\-]?\d*(\.\d+)?(\e[+\-]?\d+)?([\+\×\-\÷\%\^]{1})[+\-]?\d*(\.\d+)?(\e[+\-]?\d+)?$/g;
  // ^[+\-]?\d*(\.\d+)?(\e[+\-]?\d+)? is the first operator
  // ([\+\×\-\÷\%\^]{1}) is the operand
  // [+\-]?\d*(\.\d+)?(\e[+\-]?\d+)?$ is the second operator

  let onlyFirstOperandRegex = /^[+\-]?\d*(\.\d+)?(\e[+\-]?\d+)?$/g;
  let onlyInputFirstOperand = onlyFirstOperandRegex.test(currentInput);
  let isSyntaxCorrect = inputRegex.test(currentInput);

  if(onlyInputFirstOperand){
    result = Number.parseFloat(currentInput);
    return result;
  }

  if (!isSyntaxCorrect){ //this regex doesnt support scientific notation
    return "Syntax ERROR";
  }

  //lazy initialization
  let currentOperator;
  let numbers;
  let firstOperand;
  let secondOperand;

  //solution for negative numbers
  if (currentInput[0] === "-"){ 
    let newCurrentInput = currentInput.slice(1);
    currentOperator = newCurrentInput[newCurrentInput.search(operatorRegex)];
    numbers = newCurrentInput.split(currentOperator,3);
    firstOperand = "-"+numbers[0];
    secondOperand = numbers[1];
    if (secondOperand === ""){
      secondOperand = "-"+numbers[2];
    }
  } else {
    currentOperator = currentInput[currentInput.search(operatorRegex)];
    numbers = currentInput.split(currentOperator,3);
    firstOperand = numbers[0];
    secondOperand = numbers[1];
    if (secondOperand === ""){
      secondOperand = "-"+numbers[2];
    }
  }
 
  result = operate(currentOperator,firstOperand,secondOperand);

  if (result === false){
    return "Math ERROR";
  }

  //string interpolation
  console.log(`${firstOperand} ${currentOperator} ${secondOperand} = ${result}`);
  return result
}

function displayResult(result){
  if (result === false){
    return
  }
  switch(result){
    case "Syntax ERROR":
    case "Math ERROR":
      inputElement.textContent = result;
      resultElement.textContent = "-";
      currentState = "Error";
      break;
    default:
      result = Math.round(result * 10000) / 10000;
      resultElement.textContent = result;
      currentState = "Standby";
      Ans = result;
  }
}

function deleteInput(){
  if (currentState === "Error" || currentState === "Standby"){
    return;
  }
  if (inputElement.textContent.length === 1){
    inputElement.textContent = "_";
    clearButtonElement.textContent = "AC";
    initializeWaitForInput()
    return;
  }  
  inputElement.textContent = inputElement.textContent.slice(0,inputElement.textContent.length-1);
}

function switchPower(){
  if (currentState === "Off"){
    powerButtonElement.textContent = "OFF";
    currentState = "On";
    inputElement.style.opacity = 1;
    resultElement.style.opacity = 1;
    initializeWaitForInput();//wait for input effect
  } else {
    powerButtonElement.textContent = "ON";
    currentState = "Off";
    clearInput()
    stopWaitForInput();
    inputElement.style.opacity = 0;
    resultElement.style.opacity = 0;
  }
}

function operate(operator, operand1, operand2){
  let currentResult;
  switch(operator){
    case "+":
      currentResult = add(operand1,operand2);
      break;
    case "-":
      currentResult = substract(operand1,operand2);
      break;
    case "*":
    case "×":
      currentResult = multiply(operand1,operand2);
      break;
    case "/":
    case "÷":
      currentResult = divide(operand1,operand2);
      break;
    case "^":
      currentResult = power(operand1,operand2);
      break;
    case "%":
      currentResult = modulo(operand1,operand2);
  }
  return currentResult
}

function onNumberPress(input){
  if (currentState === "Error" || input === undefined){
    return
  }
  if (inputElement.textContent === "_") {
    stopWaitForInput()
    inputElement.textContent = "";
    inputElement.textContent += input;
    clearButtonElement.textContent = "CE";
    return
  }
  if (currentState === "Standby"){
    currentState = "On";
    inputElement.textContent = "";
    inputElement.textContent += input;
    return
  }
  inputElement.textContent += input;
}

function onOperatorPress(input){
  if (currentState === "Error"){
    return
  }
  if (inputElement.textContent === "_"){
    stopWaitForInput()
    inputElement.textContent = "0"+input;
    clearButtonElement.textContent = "CE";
    return
  }
  if (currentState === "Standby"){
    currentState = "On";
    inputElement.textContent = "";
    inputElement.textContent += Ans+input;
    return
  }
  inputElement.textContent += input;
}

function onInput(event) {
  if (currentState === "Off"){
    return
  }
  let input = event.key || event.target.textContent;
  switch (input){
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
      displayResult(calculateResult());//calculateResult returns the result value which displayResult then displays.
      break;
    case "ANS": //previous stored answer, or undefined if not stored.
      onNumberPress(Ans);
      break;
    case "e": //number times (10 to the x power). scientific notation.
      onNumberPress("e");
      break;
    case "E"://https://en.wikipedia.org/wiki/List_of_mathematical_constants
    case "ℇ":
      onNumberPress(2.71828182845904523536); //Euler's Number
      break;
    case "p":
    case "π":
      onNumberPress(3.14159265358979323846); //Pi
      break;
    case "a":
      onNumberPress(1.20205690315959428539); //Artin's constant
      break;
    case "b":
      onNumberPress(1.902160583104); // Brun's constant
      break;
    case "c":
      onNumberPress(0.23571113171923293137); // Copeland–Erdős constant
      break;
    case "d":
      onNumberPress(0.73908513321516064165); // Dottie number
      break;
    case "f":
      onNumberPress(1.18745235112650105459); // Foias constant
      break;
    case "g":
      onNumberPress(1.61803398874989484820); // Golden ratio
      break;
    case "G":
      onNumberPress(0.83462684167407318628); // Gauss' constant
      break;
    case "h":
      onNumberPress(0.35323637185499598454); // Hafner–Sarnak–McCurley constant
      break;
    case "i":
      onNumberPress(0 + 1i); 
      break;
    case "j":
      onNumberPress(1.6180);
      break;
    case "k":
      onNumberPress(2.4142);
      break;
    case "l":
      onNumberPress(0.5671);
      break;
    case "m":
      onNumberPress(1.2020);
      break;
    case "n":
      onNumberPress(1.6180);
      break;
    case "s":
      onNumberPress(2.4142);
      break;
    case "o":
      onNumberPress(0.5671);
      break;
    case "p":
      onNumberPress(1.2020);
      break;
    case "q":
      onNumberPress(1.6180);
      break;
    case "r":
      onNumberPress(2.4142);
      break;
    case "s":
      onNumberPress(0.5671);
      break;
    case "t":
      onNumberPress(1.2020);
      break;
    case "u":
      onNumberPress(1.2020);
      break;
    case "v":
      onNumberPress(0.5671);
      break;
    case "w":
      onNumberPress(1.2020);
      break;
    case "x":
      onNumberPress(1.6180);
      break;
    case "y":
      onNumberPress(2.4142);
      break;
    case "z":
      onNumberPress(0.5671);
  }
}

function toggleDarkModeButtons(){
  if (isDarkMode){
    divideButtonElement.textContent = "^";
    divideButtonElement.setAttribute("title","Power [^]")
    multiplyButtonElement.textContent = "%";
    multiplyButtonElement.setAttribute("title","Modulo [%]")
    minusButtonElement.textContent = "π";
    minusButtonElement.setAttribute("title","Pi [p]")
    plusButtonElement.textContent = "ℇ";
    plusButtonElement.setAttribute("title","Euler's number [e]")
    starryBackgroundElement.style.display = "block";
  } else {
    divideButtonElement.textContent = "÷";
    divideButtonElement.setAttribute("title","Divide [/]")
    multiplyButtonElement.textContent = "×";
    multiplyButtonElement.setAttribute("title","Multiply [*|x]")
    minusButtonElement.textContent = "-";
    minusButtonElement.setAttribute("title","Substract [-]")
    plusButtonElement.textContent = "+";
    plusButtonElement.setAttribute("title","Add [+]")
    starryBackgroundElement.style.display = "none";
  }
}

function toggleTheme(){
  isDarkMode = !isDarkMode;
  document.body.classList.toggle("dark-mode");
  calculatorElement.classList.toggle("dark-modeCalculator");
  productIdElement.classList.toggle("dark-modeProductId");
  displaySectionElement.classList.toggle("dark-modeDisplaySection");
  modelNameButtons.forEach(currentButton => currentButton.classList.toggle("dark-modeModelName")); //arrow functions
  buttonsElements.forEach(currentButton => currentButton.classList.toggle("dark-modeButtonSection"));
  numberButtonElements.forEach(currentButton => currentButton.classList.toggle("dark-modeNumberButton"));
  operatorButtonElements.forEach(currentButton => currentButton.classList.toggle("dark-modeOperatorButton"));
  functionButtonElements.forEach(currentButton => currentButton.classList.toggle("dark-modeFunctionButton"));
  equalButtonElement.classList.toggle("dark-modeEqualButton");
  githubIcon.classList.toggle("dark-mode-fa-github");
  toggleDarkModeButtons()
}

/*====================================================================
03. Events
====================================================================*/

document.addEventListener("keydown", onInput); //document = window?
buttonsElements.forEach(function(currentButton){
  currentButton.addEventListener("click", onInput)
});
productIdElement.addEventListener("click", toggleTheme); //easter egg
powerButtonElement.addEventListener("click", switchPower);