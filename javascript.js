//1.0 variables
//1.1 functions
//1.2 events

//1.0 variables
let Ans;
let isDarkMode = false;
let currentState = "Off"; // 0/1/2/3 Off/On/Standby/Error. Need Enums
let nIntervId; // variable to store our intervalID

const operatorRegex = /([\+\×\-\÷]{1})/g;

const inputElement = document.querySelector('.inputValue');
const resultElement = document.querySelector('.result');
const buttonsElements = document.querySelectorAll('.buttonSection button');
const numberButtonElements = document.querySelectorAll('.buttonSection .numberButton');
const operatorButtonElements = document.querySelectorAll('.buttonSection .operatorButton');
const functionButtonElements = document.querySelectorAll('.buttonSection .functionButton');
const clearButtonElement = document.querySelector('#ac');
const equalButtonElement = document.querySelector('.buttonSection .equalButton');
const powerButtonElement = document.querySelector('#power');
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
  if (Number(y) !== 0){
    return Number(x) / Number(y);
  }
}

function displayResult(){
  if (currentState === "Error" || currentState === "Standby"){
    return
  }

  let inputRegex = /^-?\d+(\.\d+)?([\+\×\-\÷]{1})-?\d+(\.\d+)?$/g;//written with help of https://regexr.com/ cheatsheet
  let currentInput = inputElement.textContent;
  let isSyntaxCorrect = inputRegex.test(currentInput);

  if (!isSyntaxCorrect){ //drawback: doesnt support scientific notation
    let inputRegex2 = /^-?[0-9]\d*(\.\d+)?$/g;
    let isSyntaxCorrect2 = inputRegex2.test(currentInput);
    if (isSyntaxCorrect2){
      Ans = Number.parseFloat(currentInput);
      resultElement.textContent = Ans;
      currentState = "Standby";
      return;
    } else {
      inputElement.textContent = "Syntax ERROR";
      currentState = "Error";
      return;
    }
  }

  let currentOperator;
  let numbers;
  let firstOperand;
  let secondOperand;

  if (currentInput[0] === "-"){ //bit of a hacky solution
    let newCurrentInput = currentInput.slice(1);
    currentOperator = newCurrentInput[newCurrentInput.search(operatorRegex)];
    numbers = newCurrentInput.split(currentOperator);
    firstOperand = "-"+numbers[0];
    secondOperand = numbers[1];
  } else {
    currentOperator = currentInput[currentInput.search(operatorRegex)];
    numbers = currentInput.split(currentOperator);
    firstOperand = numbers[0];
    secondOperand = numbers[1];
  }
 
  Ans = operate(currentOperator,firstOperand,secondOperand);
  if (!Ans){
    inputElement.textContent = "Math ERROR";
    currentState = "Error";
    return
  }
  console.log(firstOperand,currentOperator,secondOperand,"=",Ans)
  resultElement.textContent = Math.round(Ans * 10) / 10;
  currentState = "Standby";
}

function clearInput(){
  if (currentState === "Error" || currentState === "Standby"){
    currentState = "On";
  }
  inputElement.textContent = initialInputValue;
  resultElement.textContent = initialResultValue;
  clearButtonElement.textContent = "AC";
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
  }
  return currentResult
}

function onNumberPress(input){
  if (currentState === "Error" || !input){
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
      displayResult();
      break;
    case "ANS":
      onNumberPress(Ans);
  }
}

function toggleTheme(){
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
}

//1.2 events
document.addEventListener("keydown", onInput); //document = window?
buttonsElements.forEach(function(currentButton){
  currentButton.addEventListener("click", onInput)
});
productIdElement.addEventListener("click", toggleTheme); //easter egg
powerButtonElement.addEventListener("click", switchPower);