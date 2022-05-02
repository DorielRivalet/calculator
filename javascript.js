//1.0 variables
//1.1 functions
//1.2 events

//1.0 variables
let firstOperand;
let secondOperand;
let Ans;
let isDarkMode = false;
let currentState = "Off"; // 0/1/2 Off/On/Error. enums. probably would need to use typescript for this instead.
let lastInputType;
let nIntervId; // variable to store our intervalID

const calculatorRegex = /^\d+(\.\d{1,4})?([\+\*\-\/]{1})\d+(\.\d{1,4})?$/g; //written with help of https://regexr.com/ cheatsheet
const operatorRegex = /([\+\*\-\/]{1})/g;
const inputElement = document.querySelector('.inputValue');
const resultElement = document.querySelector('.result');
const initialInputValue = "_";
const initialResultValue = 0;
const buttonsElements = document.querySelectorAll('.buttonSection button');
const numberButtonElements = document.querySelectorAll('.buttonSection .numberButton');
const operatorButtonElements = document.querySelectorAll('.buttonSection .operatorButton');
const functionButtonElements = document.querySelectorAll('.buttonSection .functionButton');
const clearButtonElement = document.querySelector('#ac');
const equalButtonElement = document.querySelector('.buttonSection .equalButton');
const ansButtonElement = document.querySelector('#ans');
const powerButtonElement = document.querySelector('#power');
const modelNameButtons = document.querySelectorAll('.modelName button');
const productIdElement = document.querySelector('.modelName .productId');
const calculatorElement = document.querySelector('.calculator');
const displaySectionElement = document.querySelector('.displaySection');
const githubIcon = document.querySelector("footer i");

inputElement.textContent = initialInputValue;
resultElement.textContent = initialResultValue;

inputElement.style.opacity = "0";
resultElement.style.opacity = "0";

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
  return +x + +y
}

function substract(x,y){
  return +x - +y
}

function multiply(x,y){
  return +x * +y
}

function divide(x,y){
  if (+y !== 0){
    return +x / +y;
  } else {
    console.log("cannot divide by 0");
    return NaN
  }
}

function displayResult(){
  if (currentState === "Error"){
    return
  }

  let currentInput = inputElement.textContent;

  if (!calculatorRegex.test(currentInput)){
    inputElement.textContent = "Error";
    currentState = "Error";
    return
  }

  let currentOperator = currentInput[currentInput.search(operatorRegex)];
  let numbers = currentInput.split(currentOperator);
  firstOperand = numbers[0];
  secondOperand = numbers[1];
 
  Ans = operate(currentOperator,firstOperand,secondOperand);

  console.log(firstOperand,currentOperator,secondOperand,"=",Ans)
  resultElement.textContent = Ans;
  //inputElement.textContent = resultValue + currentOperator;

  //firstOperand = resultValue;
  //secondOperand = null;
}

function clearInput(){
  if (currentState === "Error"){
    currentState = "On";
    initializeWaitForInput()
  }
  inputElement.textContent = initialInputValue;
  resultElement.textContent = initialResultValue;
  firstOperand = null;
  secondOperand = null;
  clearButtonElement.textContent = "AC";
}

function deleteInput(){
  if (currentState === "Error"){
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

function switchState(){
  if (currentState === "Off"){
    currentState = "On";
    inputElement.style.opacity = 1;
    resultElement.style.opacity = 1;
    initializeWaitForInput();//wait effect
  } else {
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
      currentResult = multiply(operand1,operand2);
      break;
    case "/":
      currentResult = divide(operand1,operand2);
  }

  return currentResult
}

function inputNumber(input){
  if (inputElement.textContent === "_") {
    if (input === "0") {
      return
    }
    stopWaitForInput()
    inputElement.textContent = "";
    inputElement.textContent += input;
    clearButtonElement.textContent = "CE";
    return
  }
  inputElement.textContent += input;
}

function onNumberPress(input){
  if (currentState === "Error"){
    return
  }
  inputNumber(input);
}

function onOperatorPress(input){
  if (currentState === "Error"){
    return
  }
  /*
if operator clicked
  if operand1 is empty
    operand1 = currentdisplayvalue

    return
  end

  doOperatorfunction(operator,operand1,operand2)
   what this function does at the end:
     operand1 = operand1 (operator) operand2 // eg 1+2
     operand2 = empty
*/
  
  if (Ans){
/*     inputElement.textContent = inputElement.textContent.slice(0,inputElement.textContent.length-1)+input;
 */    return
  }

  inputElement.textContent += input
/*   if (!firstOperand){
    firstOperand = +inputElement.textContent;
    inputElement.textContent = firstOperand + input;
    console.log(firstOperand,secondOperand)
    return
  } else if (!secondOperand){
    secondOperand = +resultElement.textContent;
    console.log(firstOperand,secondOperand)
  } */ /* else {
    firstOperand = resultValue;
    inputElement.textContent = firstOperand + currentOperator
    secondOperand = null;
  } */

/*   operate(input,firstOperand,secondOperand);
  displayResult() */
  
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
  }
}

function changeTheme(){
  document.body.classList.toggle("dark-mode");
  calculatorElement.classList.toggle("dark-modeCalculator");
  displaySectionElement.classList.toggle("dark-modeDisplaySection");
  modelNameButtons.forEach(currentButton => currentButton.classList.toggle("dark-modeModelName"));
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
productIdElement.addEventListener("click", changeTheme);
powerButtonElement.addEventListener("click", switchState);