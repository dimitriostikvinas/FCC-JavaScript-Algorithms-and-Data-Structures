const checkPalindromeBtn = document.getElementById('check-btn');
const userInput = document.getElementById('text-input');
const resultDiv = document.getElementById('result');

const checkForPalindrome = (input) => {
  const originalInput = input; // Store for later output

  if (input === ''){
    alert("Please input a value");
    return;
  }

  // Remove the previous result
  resultDiv.replaceChildren();

  const lowerCaseStr = input.replace(/[^A-Za-z0-9]/gi, '').toLowerCase(); //^/[^A-Za-z0-9]/ :"match anything that is not in this set."
  
  let resultMsg = `<strong>${originalInput}</strong> ${lowerCaseStr === lowerCaseStr.split("").reverse().join('') ? 'is' : 'is not'} a palindrome.`; // or [...lowerCaseStr] instead of lowerCaseStr.split("")

  const pTag = document.createElement('p');
  pTag.className = 'user-input';
  pTag.innerHTML = resultMsg;
  resultDiv.appendChild(pTag);

  resultDiv.classList.remove('hidden');
}

checkPalindromeBtn.addEventListener('click',() => {checkForPalindrome(userInput.value); userInput.value = "";});

userInput.addEventListener('keydown', e => {
  if(e.key === 'Enter'){
    checkForPalindrome(userInput.value);
    userInput.value = '';
  }
})