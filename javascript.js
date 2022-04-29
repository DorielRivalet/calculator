//1.0 variables
//1.1 functions
//1.2 events

//1.0 variables

let inputValue = null;
let resultValue = null;

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

function inputNumber(input){

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

  if (input == "."){
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

function onFunctionPress(input){
  switch (input){
    case "DEL":
    case "Backspace":
      del();
      break;
    case "AC":
    case "Delete":
      clear();
      break;
    case "=":
    case "Enter":
      displayResult();
      break;
  }
}

function onInput(event) {
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
    case "/":
      onOperatorPress(input);
      break;
    case "Backspace":
    case "Enter":
    case "=":
    case "Delete":
    case "AC":
    case "DEL":
      onFunctionPress(input);
  }
}

//1.2 events
document.addEventListener("keydown", onInput) //document = window?

buttonsElements.forEach(function(currentButton){
  currentButton.addEventListener("click", onInput)
})