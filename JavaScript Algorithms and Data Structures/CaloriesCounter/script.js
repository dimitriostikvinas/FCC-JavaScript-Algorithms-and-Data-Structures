// Variable declarations for DOM elements to be used throughout the script
const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
let isError = false; // Flag to indicate if an input error has occurred

// Function to clean input strings of unwanted characters such as +, -, or spaces
function cleanInputString(str) {
  const regex = /[+-\s]/g; // Regex to find unwanted characters
  return str.replace(regex, ''); // Removes these characters from the input string
}

// Function to check if input is an invalid number format (e.g., scientific notation)
function isInvalidInput(str) {
  const regex = /\d+e\d+/i; // Regex to detect numbers in scientific notation
  return str.match(regex); // Returns match if found, null if not
}

// Function to dynamically add new entry fields for food or exercise
function addEntry() {
    // Selects the container element in the DOM where new entries will be added. This element is determined 
    // by combining the selected value from 'entryDropdown' with '.input-container', forming a CSS selector
    // that targets a class under a specific ID.
    const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  
    // Counts how many input elements of type text are currently within the targetInputContainer, then adds 1.
    // This count is used to assign a unique identifier to the new input elements that will be added.
    const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
  
    // Constructs an HTML string that includes labels and input fields for a new entry. This string uses the 
    // entryNumber to create unique IDs and 'for' attributes, ensuring that each label/input pair is properly 
    // associated and unique within the form. `${entryDropdown.value}-${entryNumber}-name` and similar constructs
    // create unique IDs based on the dropdown selection and number of existing entries.
    const HTMLString = `
    <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
    <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
    <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
    <input
      type="number"
      min="0"
      id="${entryDropdown.value}-${entryNumber}-calories"
      placeholder="Calories"
    />`;
  
    // Inserts the HTML string as the last child of the targetInputContainer. This method allows the new HTML 
    // to be added without overwriting existing content inside the container. 'beforeend' means the content 
    // is inserted just before the end of the targetInputContainer, effectively appending it to any existing 
    // elements.
    targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
  }
  

// Function to calculate remaining calories after user submits form
function calculateCalories(e) {
  e.preventDefault(); // Prevent default form submission behavior
  isError = false; // Reset error flag for new calculation

  // Selecting all number input fields from each category
  const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');
  const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
  const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
  const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
  const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');

  // Getting total calories from each category
  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  if (isError) { // Check if an input error was flagged
    return;
  }

  // Calculating remaining calories and determining surplus or deficit
  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
  const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';
  output.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
    <hr>
    <p>${budgetCalories} Calories Budgeted</p>
    <p>${consumedCalories} Calories Consumed</p>
    <p>${exerciseCalories} Calories Burned</p>
  `;
  output.classList.remove('hide'); // Display the output div with results
}

// Function to parse and total up calories from given inputs
function getCaloriesFromInputs(list) {
  let calories = 0;
  for (const item of list) {
    const currVal = cleanInputString(item.value);
    const invalidInputMatch = isInvalidInput(currVal);
    if (invalidInputMatch) { // If invalid input was detected
      alert(`Invalid Input: ${invalidInputMatch[0]}`);
      isError = true;
      return null;
    }
    calories += Number(currVal); // Sum up the valid inputs
  }
  return calories;
}

// Function to clear all form inputs and output display
function clearForm() {
  const inputContainers = Array.from(document.querySelectorAll('.input-container'));
  for (const container of inputContainers) {
    container.innerHTML = ''; // Clear input fields dynamically added
  }
  budgetNumberInput.value = ''; // Clear the budget input
  output.innerText = ''; // Clear the output text
  output.classList.add('hide'); // Hide the output section
}

// Event listeners for buttons and form submission
addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener("click", clearForm);
