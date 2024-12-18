// Элементы дисплея
const historyDisplay = document.getElementById('history');
const currentDisplay = document.getElementById('current');

// Переменные для состояния
let currentOperand = '';
let previousOperand = '';
let operator = null;
let isResultDisplayed = false;

// Максимальная длина текста
const MAX_HISTORY_LENGTH = 30;
const MAX_CURRENT_LENGTH = 15;

// Обновление дисплея
function updateDisplay() {
  const trimmedHistory = `${previousOperand} ${operator || ''}`.trim();

  historyDisplay.textContent =
    trimmedHistory.length > MAX_HISTORY_LENGTH
      ? `${trimmedHistory.slice(0, MAX_HISTORY_LENGTH)}...`
      : trimmedHistory;

  currentDisplay.textContent =
    currentOperand.length > MAX_CURRENT_LENGTH
      ? currentOperand.slice(0, MAX_CURRENT_LENGTH)
      : currentOperand || '0';
}

// Обработка нажатий кнопок
function handleButtonClick(value) {
  if (currentOperand === 'Error') resetCalculator();

  if (!isNaN(value) || value === '.') {
    handleNumberInput(value);
  } else if (['+', '-', '*', '/'].includes(value)) {
    handleOperatorInput(value);
  } else if (value === '=') {
    handleEquals();
  } else if (value === 'clear') {
    resetCalculator();
  } else if (value === 'delete') {
    currentOperand = currentOperand.slice(0, -1);
  } else if (value === '%') {
    handlePercentage();
  }

  updateDisplay();
}

// Обработка ввода числа или точки
function handleNumberInput(value) {
  if (isResultDisplayed) {
    currentOperand = '';
    isResultDisplayed = false;
  }

  if (currentOperand.length >= MAX_CURRENT_LENGTH) return;

  if (value === '.' && currentOperand.includes('.')) return;

  if (value === '.' && currentOperand === '') {
    currentOperand = '0.';
  } else if (currentOperand === '0' && value !== '.') {
    currentOperand = value;
  } else {
    currentOperand += value;
  }
}

// Обработка ввода оператора
function handleOperatorInput(value) {
  if (!currentOperand && !previousOperand) return;

  if (currentOperand === '' && previousOperand !== '') {
    operator = value;
  } else {
    if (currentOperand) {
      if (operator && previousOperand) {
        calculate();
      }
      previousOperand = currentOperand;
      currentOperand = '';
    }
    operator = value;
  }
  isResultDisplayed = false;
  updateDisplay();
}

// Обработка нажатия равно
function handleEquals() {
  if (operator && currentOperand && previousOperand) {
    const fullExpression = `${previousOperand} ${operator} ${currentOperand}`;
    calculate();
    previousOperand = `${fullExpression} = ${currentOperand}`;
    operator = null;
    isResultDisplayed = true;
  }
}

// Обработка процентов
function handlePercentage() {
  if (operator && previousOperand && currentOperand) {
    currentOperand = (
      parseFloat(previousOperand) *
      (parseFloat(currentOperand) / 100)
    ).toString();
  } else if (currentOperand) {
    currentOperand = (parseFloat(currentOperand) / 100).toString();
  }
}

// Вычисление
function calculate() {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr)) return;

  let result;
  switch (operator) {
    case '+':
      result = prev + curr;
      break;
    case '-':
      result = prev - curr;
      break;
    case '*':
      result = prev * curr;
      break;
    case '/':
      if (curr === 0) {
        showError();
        return;
      }
      result = prev / curr;
      break;
    default:
      return;
  }

  currentOperand = parseFloat(result.toFixed(10)).toString();
  previousOperand = '';
}

// Сброс калькулятора
function resetCalculator() {
  currentOperand = '';
  previousOperand = '';
  operator = null;
  isResultDisplayed = false;
}

// Отображение ошибки
function showError() {
  currentOperand = 'Error';
  previousOperand = '';
  operator = null;
  updateDisplay();
}

// Делегирование событий
const calculatorButtons = document.querySelector('.calculator__buttons');
calculatorButtons.addEventListener('click', (event) => {
  const button = event.target.closest('.calculator__button');
  if (!button) return;

  const value = button.dataset.value;
  handleButtonClick(value);
});

// Инициализация дисплея
updateDisplay();
