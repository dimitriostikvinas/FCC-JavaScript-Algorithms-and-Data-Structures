const form = document.getElementById('form');
const convertButton = document.getElementById('convert-btn');
const output = document.getElementById('output');
const input = document.getElementById('number');


// Define the function convertToRoman that takes an integer 'num' as its argument.
const convertToRoman = (num) => {
    // Define an array 'ref' containing sub-arrays of Roman numerals and their corresponding values.
    const ref = [
      ['M', 1000], // 1000 represented as 'M'
      ['CM', 900], // 900 represented as 'CM' (100 less than 1000)
      ['D', 500],  // 500 represented as 'D'
      ['CD', 400], // 400 represented as 'CD' (100 less than 500)
      ['C', 100],  // 100 represented as 'C'
      ['XC', 90],  // 90 represented as 'XC' (10 less than 100)
      ['L', 50],   // 50 represented as 'L'
      ['XL', 40],  // 40 represented as 'XL' (10 less than 50)
      ['X', 10],   // 10 represented as 'X'
      ['IX', 9],   // 9 represented as 'IX' (1 less than 10)
      ['V', 5],    // 5 represented as 'V'
      ['IV', 4],   // 4 represented as 'IV' (1 less than 5)
      ['I', 1]     // 1 represented as 'I'
    ];
  
    // Create an empty array 'res' to store the Roman numeral symbols as we compute them.
    const res = [];
  
    // Iterate over each element (a sub-array 'arr') in the reference array 'ref'.
    ref.forEach(function (arr) {
      // Continue looping as long as 'num' is greater than or equal to the Roman numeral value 'arr[1]'.
      while (num >= arr[1]) {
        // Add the Roman numeral symbol 'arr[0]' to the 'res' array.
        res.push(arr[0]);
        // Subtract the value 'arr[1]' from 'num', reducing 'num' to account for the value added to 'res'.
        num -= arr[1];
      }
    });
  
    // Join the elements of the 'res' array into a single string and return it.
    // This string is the Roman numeral representation of the original integer.
    return res.join('');
  }
  
  // This function can now be used to convert any integer into its Roman numeral equivalent.
  


const isValid = (str, int) => {
  let errText = '';

  if (!str || str.match(/[e.]/g)){
    errText = 'Please enter a valid number.';
  }else if (int < 1){
    errText = 'Please enter a number greater than or equal to 1.';
  } else if (int > 3999) {
    errText = 'Please enter a number less than or equal to 3999.';
  } else {
    // No errors detected
    return true;
  }

  // Handle error text and output styling
  output.innerText = errText;
  output.classList.add('alert');

  return false;
}

const clearOutput = () => {
  output.innerText = '';
  output.classList.remove('alert');
}

form.addEventListener('submit', e => {
  e.preventDefault();
  updateUI();
});

convertButton.addEventListener("click", () => {
  updateUI();
});

const updateUI = () => {
  const numStr = document.getElementById('number').value;
  const int = parseInt(numStr, 10);

  output.classList.remove('hidden');
  clearOutput();

  if(isValid(numStr, int)){
    output.innerText = convertToRoman(int);
  }
}
