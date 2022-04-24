let displayValue = 0;

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

function clear(allInput){
  allInput = [];
  return allInput;
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