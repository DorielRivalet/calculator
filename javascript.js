//variables
//functions
//events

//pseudocode
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

let inputValue = 0;
let resultValue = 0;
let operand1 = 0;
let operand2 = 0;

let currentDigits = 0;
const maxDigits = 18;

const initialInputValue = "_";
const initialResultValue = 0;

const inputElement = document.querySelector('.inputValue');
const resultElement = document.querySelector('.result');

inputElement.textContent = initialInputValue;
resultElement.textContent = initialResultValue;

const buttonsElements = document.querySelectorAll('.buttonSection button');

let allInput = [];

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
  return x/y
}

function clear(){
  allInput = [];
  inputValue = 0;
  resultValue = 0;
  operand1 = 0;
  operand2 = 0;
  inputElement.textContent = initialInputValue;
  resultElement.textContent = initialResultValue;
}

function del(previousInput){

}

function operate(operator, operand1, operand2){
  switch(operator){
    case "add":
      add(operand1,operand2);
      break;
    case "substract":
      substract(operand1,operand2);
      break;
    case "multiply":
      multiply(operand1,operand2);
      break;
    case "divide":
      divide(operand1,operand2);
  }
}

function onNumberPress(event){

  if (inputElement.textContent === "_") {
    inputElement.textContent = event.target.textContent;
  } else {
    inputElement.textContent += event.target.textContent;
  }
  currentDigits += 1;
}

function onOperatorPress(event){
/*   if (inputElement.textContent === "_") {
    inputElement.textContent = event.target.textContent;
  } else {
    inputElement.textContent += event.target.textContent;
  }
  currentDigits += 1; */
}

function onFunctionPress(event){

  switch (event.target.textContent){
    case "CLEAR":
      console.log("Test2");
      clear();
      break;
  }
  /*   if (inputElement.textContent === "_") {
      inputElement.textContent = event.target.textContent;
    } else {
      inputElement.textContent += event.target.textContent;
    }
    currentDigits += 1; */
  }

function onButtonClick(event){

  if (currentDigits >= maxDigits) {
    return;
  }

  if (event.target.classList.contains("numbers")){
    onNumberPress(event);
  } else if (event.target.classList.contains("operators")){
    onOperatorPress(event);
  } else if (event.target.classList.contains("functions")){
    onFunctionPress(event);
  }
}

buttonsElements.forEach(function(currentButton){
  currentButton.addEventListener("click", onButtonClick)
})