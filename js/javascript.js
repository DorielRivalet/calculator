//1.0 variables
//1.1 functions
//1.2 events

//1.0 variables
let Ans;
let isDarkMode = false;
let currentState = "Off"; // 0/1/2/3 Off/On/Standby/Error. Need Enums
let nIntervId; // variable to store our intervalID
let historyLog = []; //todo: history, custom fonts and display background color picker settings cog icon. text shadow  blue red chromatic aberration

const operatorRegex = /([\+\×\-\÷\%\^]{1})/g;

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

const initialInputValue = "_";
const initialResultValue = 0;

inputElement.textContent = initialInputValue;
resultElement.textContent = initialResultValue;
inputElement.style.opacity = 0;
resultElement.style.opacity = 0;

//1.1 functions
function initializeWaitForInput() { //this adds a waiting effect when starting the calculator
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

  let result;
  let currentInput = inputElement.textContent;
  let inputRegex = /^[+\-]?\d*(\.\d+)?([\+\×\-\÷\%\^]{1})[+\-]?\d*(\.\d+)?$/g;//written with help of https://regexr.com/ cheatsheet
  // ^[+\-]?\d*(\.\d+)? is the first operator
  // ([\+\×\-\÷\%\^]{1}) is the operand
  // [+\-]?\d*(\.\d+)?$ is the second operator

  let onlyFirstOperandRegex = /^[+\-]?\d*(\.\d+)?$/g;
  let onlyInputFirstOperand = onlyFirstOperandRegex.test(currentInput);
  let isSyntaxCorrect = inputRegex.test(currentInput);

  if(onlyInputFirstOperand){
    result = Number.parseFloat(currentInput);
    return result;
  }

  if (!isSyntaxCorrect){ //this regex doesnt support scientific notation
    return "Syntax ERROR";
  }

  let currentOperator;
  let numbers;
  let firstOperand;
  let secondOperand;

  if (currentInput[0] === "-"){ //solution for negative numbers
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

  console.log(firstOperand,currentOperator,secondOperand,"=",result)
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
    case ".":
      onNumberPress(input);
      break;
    case "+":
    case "-":
    case "*":
    case "x":
    case "/":
    case "÷":
    case "×":
    case "%":
    case "^": 
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
      displayResult(calculateResult());
      break;
    case "ANS":
      onNumberPress(Ans);
      break;
    case "e":
    case "ℇ":
      onNumberPress(2.7182);
      break;
    case "p":
    case "π":
      onNumberPress(3.1415);
  }
}

function switchButtons(){
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
  displaySectionElement.classList.toggle("dark-modeDisplaySection");
  modelNameButtons.forEach(currentButton => currentButton.classList.toggle("dark-modeModelName")); //arrow functions
  buttonsElements.forEach(currentButton => currentButton.classList.toggle("dark-modeButtonSection"));
  numberButtonElements.forEach(currentButton => currentButton.classList.toggle("dark-modeNumberButton"));
  operatorButtonElements.forEach(currentButton => currentButton.classList.toggle("dark-modeOperatorButton"));
  functionButtonElements.forEach(currentButton => currentButton.classList.toggle("dark-modeFunctionButton"));
  equalButtonElement.classList.toggle("dark-modeEqualButton");
  githubIcon.classList.toggle("dark-mode-fa-github");
  switchButtons()
}

//1.2 events
document.addEventListener("keydown", onInput); //document = window?
buttonsElements.forEach(function(currentButton){
  currentButton.addEventListener("click", onInput)
});
productIdElement.addEventListener("click", toggleTheme); //easter egg
powerButtonElement.addEventListener("click", switchPower);