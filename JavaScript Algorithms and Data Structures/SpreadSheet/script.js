// Mapping of arithmetic operators to corresponding arithmetic functions.
const infixToFunction = {
    "+": (x, y) => x + y,  // Adds two numbers.
    "-": (x, y) => x - y,  // Subtracts the second number from the first.
    "*": (x, y) => x * y,  // Multiplies two numbers.
    "/": (x, y) => x / y,  // Divides the first number by the second, returns the quotient.
}

// Evaluates expressions matching a specific arithmetic pattern in a string.
const infixEval = (str, regex) => 
    str.replace(regex, (_match, arg1, operator, arg2) => 
    // Convert the arguments from strings to floats and apply the corresponding arithmetic operation.
    infixToFunction[operator](parseFloat(arg1), parseFloat(arg2))
);

// Recursively evaluates high precedence operations (multiplication and division) in a string until all such operations are resolved.
const highPrecedence = str => {
    const regex = /([\d.]+)([*\/])([\d.]+)/;  // Regex to find multiplication or division operations.
    const str2 = infixEval(str, regex);  // Evaluate the first instance of high precedence operation.
    return str === str2 ? str : highPrecedence(str2);  // Recur until no more operations can be evaluated.
}

// Utility function to check if a number is even.
const isEven = num => num % 2 === 0;  // Returns true if the number is even (remainder is zero when divided by 2).

// Function to sum an array of numbers.
const sum = nums => nums.reduce((acc, el) => acc + el, 0);  // Uses reduce to accumulate total sum of array elements.

// Function to calculate average of an array of numbers.
const average = nums => sum(nums) / nums.length;  // Divides the sum of elements by the number of elements.

// Function to calculate the median of an array of numbers.
const median = nums => {
    const sorted = nums.slice().sort((a, b) => a - b);  // Sorts the array in ascending order.
    const length = sorted.length;  // Total number of elements in the array.
    const middle = length / 2 - 1;  // Calculates the middle index (adjusted for zero index).
    // If the array length is even, return the average of the two middle numbers, otherwise return the middle number.
    return isEven(length)
        ? average([sorted[middle], sorted[middle + 1]])  // Calculate average of middle two numbers for even-length arrays.
        : sorted[Math.ceil(middle)];  // Directly return middle number for odd-length arrays.
}
  

const spreadsheetFunctions = {
  
    sum,  // Direct reference to previously defined sum function, adds all elements in an array.
    average,  // Direct reference to previously defined average function, calculates the average of an array.
    median,  // Direct reference to previously defined median function, finds the median value of an array.
  
    // Filters an array to return only even numbers.
    even: nums => nums.filter(isEven),  // Uses the filter method and the isEven utility to extract even numbers.
  
    // Checks if there is at least one even number in the array.
    someeven: nums => nums.some(isEven),  // Uses the some method which returns true as soon as one even number is found.
  
    // Checks if every number in the array is even.
    everyeven: nums => nums.every(isEven),  // Uses the every method which returns true only if all numbers are even.
  
    // Returns the first two elements of an array.
    firsttwo: nums => nums.slice(0, 2),  // Uses slice to get the first two elements from the array.
  
    // Returns the last two elements of an array.
    lasttwo: nums => nums.slice(-2),  // Uses slice with negative indices to get the last two elements from the array.
  
    // Checks if the array contains the number 2.
    has2: nums => nums.includes(2),  // Uses includes to check if 2 is an element of the array.
  
    // Increments each number in the array by 1.
    increment: nums => nums.map(num => num + 1),  // Uses map to add 1 to each element of the array.
  
    // Generates a random number between two numbers specified in an array.
    random: ([x, y]) => Math.floor(Math.random() * (y - x) + x),  // Calculates a random number within the range [x, y].
  
    // Creates an array containing numbers within a specified range.
    range: nums => range(...nums),  // Spreads the nums array as arguments to the range function.
  
    // Returns an array with duplicate values removed.
    nodupes: nums => [...new Set(nums).values()],  // Uses a Set to remove duplicates and converts back to array.
  
    // Returns the input array unchanged. This serves as a default or placeholder functionality.
    "": nums => nums  // Directly returns the input array without any changes.
}

// Processes a string containing a formula, evaluates it, and applies spreadsheet functions where appropriate.
const applyFunction = str => {
    const noHigh = highPrecedence(str);  // First evaluates high precedence operations (* and /) in the input string.
    const infix = /([\d.]+)([+-])([\d.]+)/;  // Regex to match low precedence operations (+ and -).
    const str2 = infixEval(noHigh, infix);  // Applies infix evaluation for low precedence operators on the result of high precedence evaluation.
  
    // Regex to match function calls, capturing the function name and its comma-separated arguments.
    const functionCall = /([a-z0-9]*)\(([0-9., ]*)\)(?!.*\()/i;
  
    // Converts a comma-separated string of numbers into an array of floats.
    const toNumberList = args => args.split(",").map(parseFloat);
  
    // Applies a function from the spreadsheetFunctions object to the array of arguments.
    const apply = (fn, args) => spreadsheetFunctions[fn.toLowerCase()](toNumberList(args));
  
    // Replaces each function call in the string with the result of the function application if the function exists.
    return str2.replace(functionCall, (match, fn, args) =>
      spreadsheetFunctions.hasOwnProperty(fn.toLowerCase()) ? apply(fn, args) : match
    );
}
  
  // Creates an array representing a range of integers from start to end (inclusive).
const range = (start, end) => 
    Array(end - start + 1) // Creates an array with a length equal to the number of elements in the range.
      .fill(start) // Initially fills the array with the start value.
      .map((element, index) => element + index); // Maps each element to increment by its index, thereby creating the range.
  
  // Generates an array of characters representing a range from start to end character.
const charRange = (start, end) =>
    range(start.charCodeAt(0), end.charCodeAt(0)) // Converts start and end characters to their ASCII values and creates a range.
      .map(code => String.fromCharCode(code)); // Converts each ASCII code back to its corresponding character.
  
  
// Evaluates formulas within the context of a spreadsheet, where `x` is the formula string, and `cells` is an array of cell objects.
const evalFormula = (x, cells) => {
    // Function to retrieve the value of a cell given its ID.
    const idToText = id => cells.find(cell => cell.id === id).value;
  
    // Regex pattern to match cell range definitions, e.g., A1:B2.
    const rangeRegex = /([A-J])([1-9][0-9]?):([A-J])([1-9][0-9]?)/gi;
  
    // Converts a string number range to an array of numbers.
    const rangeFromString = (num1, num2) => range(parseInt(num1), parseInt(num2));
  
    // Returns a function that takes a character and returns the value of the cell formed by appending the number to the character.
    const elemValue = num => character => idToText(character + num);
  
    // Returns a function that generates an array of cell values between two columns for a specific row.
    const addCharacters = character1 => character2 => num => 
      charRange(character1, character2).map(elemValue(num));
  
    // Expands all cell range references in the formula to their actual values.
    const rangeExpanded = x.replace(rangeRegex, (_match, char1, num1, char2, num2) => 
      rangeFromString(num1, num2).map(addCharacters(char1)(char2)));
  
    // Regex to match individual cell references, e.g., A1, B10.
    const cellRegex = /[A-J][1-9][0-9]?/gi;
  
    // Expands all individual cell references in the previously range-expanded formula to their actual values.
    const cellExpanded = rangeExpanded.replace(cellRegex, match => idToText(match.toUpperCase()));
  
    // Applies spreadsheet functions to the formula after expanding all cell references.
    const functionExpanded = applyFunction(cellExpanded);
  
    // Recursively evaluates the formula until no further expansions or function applications change the formula.
    return functionExpanded === x ? functionExpanded : evalFormula(functionExpanded, cells);
}
  
// This function is executed when the webpage loads.
window.onload = () => {
    // Retrieves the main container element where the spreadsheet will be displayed.
    const container = document.getElementById("container");
  
    // Function to create and append labels (for rows and columns) to the container.
    const createLabel = (name) => {
      const label = document.createElement("div");  // Creates a new div element to serve as a label.
      label.className = "label";  // Sets the class name for styling purposes.
      label.textContent = name;  // Sets the text content of the label to the specified name.
      container.appendChild(label);  // Appends the label to the container.
    }
  
    // Generates labels for columns A to J.
    const letters = charRange("A", "J");
    letters.forEach(createLabel);  // Applies createLabel to each letter.
  
    // Generates labels for rows 1 to 99 and corresponding input fields for each cell.
    range(1, 99).forEach(number => {
      createLabel(number);  // Creates a label for each number (row).
      letters.forEach(letter => {
        const input = document.createElement("input");  // Creates an input element for each cell.
        input.type = "text";  // Sets the type of the input to text.
        input.id = letter + number;  // Assigns an ID to the input based on its row and column, e.g., A1, B2.
        input.ariaLabel = letter + number;  // Sets the accessible label (aria-label) to the same ID for accessibility.
        input.onchange = update;  // Assigns the update function to handle changes made to the input.
        container.appendChild(input);  // Appends the input field to the container.
      })
    })
  }
  
  // Function to handle changes made to any cell input.
const update = event => {
    const element = event.target;  // Retrieves the element that triggered the event.
    const value = element.value.replace(/\s/g, "");  // Removes any whitespace from the input value.
  
    // Checks if the value starts with '=' and does not include a self-reference, which would lead to a circular reference.
    if (!value.includes(element.id) && value.startsWith('=')) {
      // Evaluates the formula (excluding the initial '=') using the existing cells' values and sets the result as the input's value.
      element.value = evalFormula(value.slice(1), Array.from(document.getElementById("container").children));
    }
}
  