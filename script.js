// 

const display = document.querySelector('#mainDisplay')
const resultDisplay = document.querySelector('#subDisplay')

const numbers = document.querySelectorAll('.numb')
const operator = document.querySelectorAll('.operator')
const equals = document.querySelector('.equals')
const other = document.querySelectorAll('.other')
const allClear = document.querySelector('.clear')
const back = document.querySelector('.back')

// ASSIGN ALL BUTTONS CLICK EVENT LISTENERS
numbers.forEach( (b) => {
	b.addEventListener('click', (event) => {
		sendToDisplay(b.textContent)
	})
})

other.forEach( (b) => {
	b.addEventListener('click', (event) => {
		sendToDisplay(b.textContent)
	})
})

allClear.addEventListener('click', (event) => {
	currentKeys = []
	display.textContent = currentKeys.join('')
})

back.addEventListener('click', (event) => {
	currentKeys.pop()
	display.textContent = currentKeys.join('')
})

equals.addEventListener('click', (event) => {
	console.log('equaling')
	let calculationResult = calculate(joinComputationArr(currentKeys))
	console.log(calculationResult)
	currentKeys = calculationResult[0].toString().split('')
	display.textContent = currentKeys.join('')
	lastKeyIsEquals = true
})

// ASSIGN BUTTONS KEY DOWN EVENT LISTNERS
window.addEventListener('keydown', (e) => {
	if(validKeys.includes(e.key)){
		sendToDisplay(e.key)
	}
	if(e.key ==="="){
		let calculationResult = calculate(joinComputationArr(currentKeys)) 
		currentKeys = calculationResult[0].toString().split('')
		display.textContent = currentKeys.join('')
		lastKeyIsEquals = true
	}
	if(e.keyCode === 46 || e.keyCode === 8){
		currentKeys.pop()
		display.textContent = currentKeys.join('')
	}
})


const validKeys = ['1', '2', '3','4','5','6','7','8','9','0','+','-','/','*', '.']
let lastKeyIsEquals = false 
const operators = ['+','-','/','*']
let currentKeys = []
const higherOrderOps = ['/','*']
const lowerOrderOps = ['+','-']
const lastResult = null
const firstNumb = null
const secondNum = null
const currentOp = null

function sendToDisplay(char){
	let c = isValidOp(char)  //IF AN OPERATOR IS KEYED CONSECUTIVELY, WE ACCEPT ONLY THE LAST OPERATOR
	c = isDecimal(c)  // IF THE LAST NUMBER IN SEQUENCE ALREADY HAS DECIMAL, WE DO NOT ACCEPT ANOTHER
	// IF THE LAST KEY WAS EQUALS AND WE PRESS A NUMBER KEY, THE CURRENT KEYS ARRAY IS RESET
	if(currentKeys.some(anyOps) === false && !!lastKeyIsEquals && operators.includes(c) === false){
		currentKeys = []
		lastKeyIsEquals = false
	}
	if(!!c){
		currentKeys.push(c)
		display.textContent = currentKeys.join('')
	}
}

var anyOps = function (el){
	return operators.includes(el)
}

function isValidOp(k){
	if(operators.includes(k) && operators.includes(currentKeys[currentKeys.length-1])){
		console.log('this is an operator')
		currentKeys.splice(currentKeys.length-1, 1)
	}
	return k
}

function isDecimal(k){
	if(k !== '.'){
		return k
	}
	let lastNumb = findLastNumb()
	let hasOneDecimal = lastNumb.includes('.')
	let lastElementIsDecimal = lastNumb[lastNumb.length-1] === '.'
	if(hasOneDecimal || lastElementIsDecimal){
		return
	}
	return k
}

function findLastNumb(){
	let lastNumb = []
	for(var i = currentKeys.length; i>=0; i--){
		var currentEl = currentKeys[i]
		if(operators.includes(currentEl) === false){
			lastNumb.unshift(currentEl)
		}else{
			break
		}
	}
	return lastNumb
}


function joinComputationArr(arr){
  let result = []
  let temp = ''
  arr.forEach( (el, i) => {
    if(operators.includes(el) === false){
      temp += el 
    }else if(operators.includes(el) && i !== arr.length-1){
      result.push(parseFloat(temp))
      temp = ''
      result.push(el)
    }
  })
  if(!!temp){
      result.push(parseFloat(temp))
    }
  return result
}

// set up object for calculation functions
const calculations = {
  "+": function (a, b){ return a + b },
  "-": function (a, b){ return a - b},
  "*": function (a, b){ return a * b},
  "/": function (a, b){ 
    if(b === 0){
    	currentKeys = []
      return 'Division by 0 not allowed'
      }
    return a / b
  },
}
// set up helper functions
 let findHigherOrderOps = function(el){
    return higherOrderOps.includes(el)
 }
  
 let findLowerOrderOps = function(el){
    return lowerOrderOps.includes(el)
 }

function calculate(array){
  var includesHigher = array.some(findHigherOrderOps)
  var includesLower = array.some(findLowerOrderOps)
  
  if(includesHigher){
    while(array.includes('*') || array.includes('/')){
      var currentOpIndex = findOpIndex(array, higherOrderOps)
      var currentOperator = array[currentOpIndex]
      var firstNumb = array[currentOpIndex-1]
      var secondNumb = array[currentOpIndex+1]
      result = calculations[currentOperator](firstNumb, secondNumb)
      array.splice(currentOpIndex-1, 3, result) 
    }
  }
  if(includesLower){
    while(array.includes('+') || array.includes('-')){
      var currentOpIndex = findOpIndex(array, lowerOrderOps)
      var currentOperator = array[currentOpIndex]
      var firstNumb = array[currentOpIndex-1]
      var secondNumb = array[currentOpIndex+1]
      result = calculations[currentOperator](firstNumb, secondNumb)
      array.splice(currentOpIndex-1, 3, result) 
    }
  }
  return array 
}

function findOpIndex(arr, order){
  let indexes = []
  // iterate through order array and see if other array includes operator
  // if it does, push the index into results
  // return the lowest index
  for(var i=0; i<order.length; i++){
    let currentOp = order[i]
    if(arr.includes(currentOp)){
      indexes.push(arr.indexOf(currentOp))
    }
  }
  return indexes.sort()[0]
}
