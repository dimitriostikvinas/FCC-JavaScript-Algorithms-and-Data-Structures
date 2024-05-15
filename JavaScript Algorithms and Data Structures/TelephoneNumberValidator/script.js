const checkBtn = document.getElementById("check-btn");
const clearBtn = document.getElementById("clear-btn");
const userInput = document.getElementById("user-input");
const results = document.getElementById("results-div");

const checkValidNumber = input => {
  if (input === "") {
    alert("Please provide a phone number");
    results.classList.add("hidden");
    return false;
  }
  // Regular expression components explained:

// countryCode: Matches an optional country code '1' which may or may not be followed by a space.
// '^' asserts the start of a line.
// '(1\\s?)?' captures an optional group that starts with '1' followed by an optional whitespace character (\s).
// The '?' after the group makes the entire group optional, allowing the regex to match phone numbers with or without the country code.
const countryCode = '^(1\\s?)?';

// areaCode: Matches an area code which can be wrapped in parentheses or not.
// '(\\([0-9]{3}\\)|[0-9]{3})' is a group that matches:
//   '\\([0-9]{3}\\)' - an area code within parentheses. '\\(' and '\\)' escape the literal parentheses, and '[0-9]{3}' matches exactly three digits.
//   '|' acts as an OR operator within the regex.
//   '[0-9]{3}' - exactly three digits without any parentheses.
const areaCode = '(\\([0-9]{3}\\)|[0-9]{3})';

// spacesDashes: Matches an optional space or dash.
// '[\\s\\-]?' matches:
//   '\\s' - a whitespace character.
//   '\\-' - a literal dash (escaped because dashes have special meaning in regex).
//   '?' makes the preceding character class optional, meaning this part will match zero or one space or dash.
const spacesDashes = '[\\s\\-]?';

// phoneNumber: Matches the main seven-digit phone number.
// '[0-9]{3}[\\s\\-]?[0-9]{4}$' consists of:
//   '[0-9]{3}' - exactly three digits.
//   '[\\s\\-]?' - an optional space or dash (as explained above).
//   '[0-9]{4}' - exactly four digits to complete the phone number.
//   '$' asserts the end of a line, ensuring no additional characters after the last four digits.
const phoneNumber = '[0-9]{3}[\\s\\-]?[0-9]{4}$';

// Combining all parts to create a full phone number regex:
// The phoneRegex is constructed by templating all the above parts into a single regular expression.
// The `new RegExp` creates a regular expression object for matching text with the defined pattern.
const phoneRegex = new RegExp(`${countryCode}${areaCode}${spacesDashes}${phoneNumber}`);

// This regex can now be used to validate phone numbers in various formats with or without the country code,
// with area codes inside or outside of parentheses, and optional spaces or dashes between segments.


  
  phoneRegex.test(input) ? (results.style.color = '#00771b') : (results.style.color = '#fd3800');
  results.innerHTML=`${phoneRegex.test(input) ? 'Valid' : 'Invalid'} US number: ${input}`;
  return true;
}


checkBtn.addEventListener('click', () => {
  const status = checkValidNumber(userInput.value);
  if (status){
    userInput.value = '';
    results.classList.remove("hidden");
  }
});

userInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const status = checkValidNumber(userInput.value);
    if (status){
      userInput.value = '';
      results.classList.remove("hidden");
    }
  }
});

clearBtn.addEventListener('click', () => {
  results.textContent = '';
  results.classList.add("hidden");
});