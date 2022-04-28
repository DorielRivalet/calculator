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

function inputNumber(event){
  currentDigits += 1;
  console.log("currentDigits",currentDigits)
  console.log("number logged",event.target.textContent)

  if (!firstOperand){
    inputElement.textContent += event.target.textContent;
  } else if (!secondOperand){
    inputElement.textContent = event.target.textContent;
  }
}

function onNumberPress(event){
  if (currentDigits >= maxDigits){
    console.log("max digits reached");
    return;
  }

   if (event.target.textContent == "."){
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

function onOperatorPress(event){
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

  currentOperator = event.target.textContent;
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

function onFunctionPress(event){
  switch (event.target.textContent){
    case "AC":
      clear();
      break;
    case "DEL":
      del();
      break;
    case "=":
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

//1.2 events
buttonsElements.forEach(function(currentButton){
  currentButton.addEventListener("click", onButtonClick)
})