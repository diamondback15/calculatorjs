//ES6

let input = []
let buttons = document.querySelectorAll('.button');
const isNumber = s => !isNaN(parseFloat(s))
const isOperator = s => '+-*/^#()'.includes(s)
const expElement = document.getElementById('input-string')
const resultElement = document.getElementById('input-value')


buttons.forEach((value, index) => {
	buttons[index].addEventListener('click', buttonClick);	
});

function buttonClick(e) {
	var value = e.target.dataset.value;
	
	switch(value){
		case 'DEL':
			input.pop()
			updateExp(input)
			break;
		
		case 'AC':
			input = []
			resultElement.innerHTML = 0
			updateExp(input)
			break;
		
		case '=':
			result = (value.length == 0 ? 0 : solvingEquation(input)); 
			resultElement.innerHTML = result
			break;
			
		default:
			input.push(value)
			updateExp(input)
			break;			
	}
}


function updateExp(input) {
  if (input.length == 0) {
    expElement.innerHTML = '&nbsp;'
  } else {
    expElement.textContent = input.join('')
  }
}

function keycodeMatch(element) {
  const mapKeys = {
    'Backspace': 'DEL',
    '.': '.',
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '0': '0',
    '+': '+',
    '-': '-',
    'x': '*',
    '*': '*',
    '/': '/',
    '(': '(',
    ')': ')',
    'Enter': '=',
    '=': '='
  }
  const value = mapKeys[element.key];
  if (value){
	document.querySelector(".button[data-value='"+value+"']").click()  
  }
}
window.addEventListener('keydown', keycodeMatch)

function solvingEquation(input) {
  const exp = input.reduce((acc, curr, index) => {
    if(acc.length > 0 && !isOperator(curr) && !isOperator(acc[acc.length-1])) {
      acc[acc.length-1] += curr
    } else {
      acc.push(curr)
    }
    return acc
  }, [])
  
  console.log(exp)
  console.log(reduceParenthesis(exp))
  
  return solvingRpn(reduceParenthesis(exp))
}

function reduceParenthesis(exp) {
  const precedence = {
    '#': 1,
    '^': 2,
    '*': 3,
    '/': 3,
    '-': 4,
    '+': 4   
  }
  const queue = []
  const output = []
  
  exp.forEach((value, index) => {
    if (isNumber(value)) {
      output.push(value)
    } else if (value == '(') {
      queue.push(value)
    } else if (value == ')') {
      while (queue[queue.length-1] && queue[queue.length-1] != '(') {
        output.push(queue.pop())
      }
      queue.pop()
    } else if (isOperator(value)) {
      const prevvalue = exp[index-1]
      if (value == '-' && !isNumber(prevvalue)) {
        value = '#'
      }
      queue.push(value)
    }
   
  })
  
  while (queue.length > 0)
    output.push(queue.pop())
  
  return output
}

function solvingRpn(exp) {
  const operator = {
    '+': b => a => a + b,
    '-': b => a => a - b,
    '*': b => a => a * b,
    '/': b => a => a / b,
    '#': a => -a
  }
  const queue = []
  
  exp.forEach(value => {
    if (isNumber(value)) {
      queue.push(parseFloat(value))
    } else {
      let result = operator[value]
      
      while (typeof result == 'function')
	  	result = result(queue.pop())
	    
      queue.push(result)
    }
  })
  
  return queue[0]
}
