//1.0 variables
//1.1 functions
//1.2 events

//1.0 variables

let inputValue;
let resultValue;
let firstOperand;
let secondOperand;
let currentOperator;
let currentDigits = 0;
let firstOperandHasDecimals = false;
let secondOperandHasDecimals = false;
let isDarkMode = false;
let nIntervId; // variable to store our intervalID

const maxDigits = 18;
const maxDecimalDigits = 1;
const inputElement = document.querySelector('.inputValue');
const resultElement = document.querySelector('.result');
const initialInputValue = "_";
const initialResultValue = 0;
const buttonsElements = document.querySelectorAll('.buttonSection button');
const numberButtonElements = document.querySelectorAll('.buttonSection .numberButton');
const operatorButtonElements = document.querySelectorAll('.buttonSection .operatorButton');
const functionButtonElements = document.querySelectorAll('.buttonSection .functionButton');
const equalButtonElement = document.querySelector('.buttonSection .equalButton');
const modelNameButtons = document.querySelectorAll('.modelName button');
const productIdElement = document.querySelector('.modelName .productId');
const calculatorElement = document.querySelector('.calculator');
const displaySectionElement = document.querySelector('.displaySection');
const githubIcon = document.querySelector("footer i");

inputElement.textContent = initialInputValue;
resultElement.textContent = initialResultValue;

//1.1 functions
function changeText() {
  // check if already an interval has been set up
  if (!nIntervId) {
    nIntervId = setInterval(waitForInput, 500);
  }
}

function waitForInput() {
  const oElem = inputElement;
  if (oElem.style.opacity === "1") {
    oElem.style.opacity = "0";
  } else {
    oElem.style.opacity = "1";
  }
}

function stopWaitForInput() {
  clearInterval(nIntervId);
  // release our intervalID from the variable
  inputElement.style.opacity = 1;
  nIntervId = null;
}

function add(x,y){
  return x+y
}

function substract(x,y){
  return x-y
}

function multiply(x,y){
  return x*y
}

function divide(x,y){
  if (y !== 0){
    return x/y;
  } else {
    console.log("cannot divide by 0");
    return NaN
  }
}

function getCurrentInput(){
  return inputElement.textContent;
}

function setResult(input){
  resultElement.textContent = input; 
}

function displayResult(){
  if (!secondOperand){
    return
  }

  console.log(firstOperand,currentOperator,secondOperand,"=",resultValue)
  resultElement.textContent = resultValue;

  operand1 = resultValue;
  operand2 = null;
}

function clear(){
  console.log("clear");
  inputValue = 0;
  resultValue = 0;
  firstOperand = null;
  secondOperand = null;
  currentDigits = 0;
  currentOperator = "";
  inputElement.textContent = initialInputValue;
  resultElement.textContent = initialResultValue;
  firstOperandHasDecimals = false;
  secondOperandHasDecimals = false;
  changeText()
}

function del(){
  console.log("del")
  if (currentDigits <= 1){
    inputElement.textContent = "_"
    console.log("no digits")
    currentDigits = 0;
    changeText()
    return;
  }  
  inputElement.textContent = inputElement.textContent.slice(0,inputElement.textContent.length-1);
  currentDigits -= 1;
  console.log("currentDigits",currentDigits)
}

function operate(operator, operand1, operand2){
  switch(operator){
    case "+":
      resultValue = add(operand1,operand2);
      break;
    case "-":
      resultValue = substract(operand1,operand2);
      break;
    case "*":
      resultValue = multiply(operand1,operand2);
      break;
    case "/":
      resultValue = divide(operand1,operand2);
  }
}

function inputNumber(input){
  if (inputElement.textContent === "_") {
    if (input === "0") {
      return
    }
    stopWaitForInput()
    inputElement.textContent = "";
    inputElement.textContent += input;
    currentDigits += 1;
    console.log("currentDigits",currentDigits)
    console.log("number logged",input)
    return
  }

  stopWaitForInput()
  currentDigits += 1;
  console.log("currentDigits",currentDigits)
  console.log("number logged",input)
  if (!firstOperand){
    inputElement.textContent += input;
  } else if (!secondOperand){
    inputElement.textContent = input;
  }
}

function onNumberPress(input){ //todo: remove redundant ifs
  if (currentDigits >= maxDigits){
    console.log("max digits reached");
    return;
  }
/*   if (input == "."){
    return;
  if (!firstOperandHasDecimals){
    firstOperandHasDecimals = true;
    return;
  } else if (!secondOperandHasDecimals){
      secondOperandHasDecimals = true;
    return;
    }
  } */
  inputNumber(input);
}

function onOperatorPress(input){
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
  currentOperator = input;
  currentDigits = 0;
  if (!firstOperand){
    firstOperand = +inputElement.textContent;
    console.log(firstOperand,secondOperand)
    return
  } else if (!secondOperand){
    secondOperand = +inputElement.textContent;
    console.log(firstOperand,secondOperand)
  }
  operate(currentOperator,firstOperand,secondOperand);
  displayResult()
}

function onInput(event) {
  let input = event.key || event.target.textContent;
  console.log(input)
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
      onOperatorPress(input);
      break;
    case "DEL":
    case "Backspace":
      del();
      break;
    case "Delete":
    case "AC":
    case "Escape":
      clear();
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
  modelNameButtons.forEach(function(currentButton){
    currentButton.classList.toggle("dark-modeModelName");
  })
  buttonsElements.forEach(function(currentButton){
    currentButton.classList.toggle("dark-modeButtonSection");
  })
  numberButtonElements.forEach(function(currentButton){
    currentButton.classList.toggle("dark-modeNumberButton");
  })
  operatorButtonElements.forEach(function(currentButton){
    currentButton.classList.toggle("dark-modeOperatorButton");
  })
  functionButtonElements.forEach(function(currentButton){
    currentButton.classList.toggle("dark-modeFunctionButton");
  })
  equalButtonElement.classList.toggle("dark-modeEqualButton");
  githubIcon.classList.toggle("dark-mode-fa-github");
}

changeText()//wait effect

//1.2 events
document.addEventListener("keydown", onInput) //document = window?
buttonsElements.forEach(function(currentButton){
  currentButton.addEventListener("click", onInput)
})
productIdElement.addEventListener("click", changeTheme)