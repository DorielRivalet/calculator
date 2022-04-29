//1.0 variables
//1.1 functions
//1.2 events

//1.0 variables
/* const keys = [0,1,2,3,4,5,6,7,8,9Array.from(document.querySelectorAll('.key'));
keys.forEach(key => key.addEventListener('transitionend', removeTransition));
window.addEventListener('keydown', playSound); */

let inputValue = null;
let resultValue = null;
let currentInput = null;

let firstOperand = null;
let secondOperand = null;

let currentDigits = 0;
const maxDigits = 18;

let currentOperator = "";

let firstOperandHasDecimals = false;
let secondOperandHasDecimals = false;

const maxDecimalDigits = 1;

const initialInputValue = "_";
const initialResultValue = 0;

const inputElement = document.querySelector('.inputValue');
const resultElement = document.querySelector('.result');

inputElement.textContent = initialInputValue;
resultElement.textContent = initialResultValue;

const buttonsElements = document.querySelectorAll('.buttonSection button');
const body = document.querySelector("body");

//1.1 functions
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
  currentInput = null;
  firstOperand = null;
  secondOperand = null;
  currentDigits = 0;
  currentOperator = "";
  inputElement.textContent = initialInputValue;
  resultElement.textContent = initialResultValue;
  firstOperandHasDecimals = false;
  secondOperandHasDecimals = false;
}

function del(){
  console.log("del")

  if (currentDigits <= 1){
    inputElement.textContent = "_"
    console.log("no digits")
    currentDigits = 0;
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

function inputNumber(event,isKeyPress){

  if (isKeyPress){
    currentInput = event.key;
  } else {
    currentInput = event.target.textContent;
  }

  currentDigits += 1;
  console.log("currentDigits",currentDigits)
  console.log("number logged",currentInput)

  if (!firstOperand){
    inputElement.textContent += currentInput;
  } else if (!secondOperand){
    inputElement.textContent = currentInput;
  }
}

function onNumberPress(event,isKeyPress){
  if (currentDigits >= maxDigits){
    console.log("max digits reached");
    return;
  }

  if (isKeyPress){
    currentInput = event.key;
  } else {
    currentInput = event.target.textContent;
  }

  if (currentInput == "."){
    return;
  if (!firstOperandHasDecimals){
    firstOperandHasDecimals = true;
    return;
  } else if (!secondOperandHasDecimals){
      secondOperandHasDecimals = true;
    return;
    }
  }

  if (inputElement.textContent === "_") {
    inputElement.textContent = "";
  }

  inputNumber(event);
}

function onOperatorPress(event, isKeyPress){
  /*
if operator clicked
  if operand1 is empty
    operand1 = currentdisplayvalue
    return
  elif operand2 is empty
    operand2 =  currentdisplayvalue
    return
  end

  doOperatorfunction(operator,operand1,operand2)
   what this function does at the end:
     operand1 = operand1 (operator) operand2 // eg 1+2
     operand2 = empty
*/
  if (isKeyPress){
    currentInput = event.key;
  } else {
    currentInput = event.target.textContent;
  }

  currentOperator = currentInput;
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

function onFunctionPress(event, isKeyPress){

  if (isKeyPress){
    currentInput = event.key;
  } else {
    currentInput = event.target.textContent;
  }

  switch (currentInput){
    case "AC":
    case "Backspace":
      clear();
      break;
    case "DEL":
    case "Delete":
      del();
      break;
    case "=":
    case "Enter":
      displayResult();
      break;
  }
}

function onButtonClick(event){
  if (event.target.classList.contains("numbers")){
    onNumberPress(event);
  } else if (event.target.classList.contains("operators")){
    onOperatorPress(event);
  } else if (event.target.classList.contains("functions")){
    onFunctionPress(event);
  }
}

function onKeyPress(event) {
  let key = event.key;

  switch (key){
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
      onNumberPress(event,true);
      break;
    case "+":
    case "-":
    case "*":
    case "/":
      onOperatorPress(event,true);
      break;
    case "Backspace":
    case "Enter":
    case "=":
    case "Delete":
      onFunctionPress(event,true);
      break;
    }
  }
}

//1.2 events
body.addEventListener("onkeypress", onKeyPress)

buttonsElements.forEach(function(currentButton){
  currentButton.addEventListener("click", onButtonClick)
})