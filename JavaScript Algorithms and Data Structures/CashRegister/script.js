// Set the price of the item to be purchased.
let price = 1.87;

// Define the current state of the cash in drawer (cid), each array contains denomination name and total amount of that denomination.
let cid = [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100]
];

// Access various DOM elements by their IDs to interact with the HTML document.
const displayChangeDue = document.getElementById("change-due");
const cash = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const priceScreen = document.getElementById("price-screen");
const cashDrawerDisplay = document.getElementById("cash-drawer-display");

// Function to format and display the transaction status and the change details on the web page.
const formatResults = (status, change) => {
    // Set the innerHTML of the displayChangeDue element to show the transaction status.
    displayChangeDue.innerHTML = `<p>Status: ${status}</p>`;
  
    // Iterate over the change array using map, and append each denomination and its amount to the displayChangeDue's HTML.
    change.map(money => {
      displayChangeDue.innerHTML += `<p>${money[0]}: $${money[1]}</p>`;
    })
}

const checkCashRegister = () => {
    // Convert cash received from input to a number and check if it's less than the price of the item
    if (Number(cash.value) < price){
      // If not enough money was provided, alert the customer and clear the input field
      alert("Customer does not have enough money to purchase the item");
      cash.value = "";
      return; // Exit the function early since the transaction cannot proceed
    }
  
    // Check if the cash provided matches the exact price of the item
    if (Number(cash.value) === price){
      // If exact amount was paid, inform the user no change is due
      displayChangeDue.innerHTML = `<p>No change due - customer paid with exact cash</p>`;
      cash.value = "";
      return;
    }
  
    // Calculate the change due by subtracting the price from the cash provided
    let changeDue = Number(cash.value) - price;
    // Reverse the cash in drawer array to start giving change from the largest denominations
    let reversedCid = [...cid].reverse();
    // Array of currency denominations in descending order corresponding to reversedCid
    let denominations = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
    // Initialize the result object with an "OPEN" status and an empty array for the change
    let result = { status: "OPEN", change: [] };
    // Calculate the total amount of cash in the drawer
    let totalCID = parseFloat(
      cid.map(total => total[1])
         .reduce((prev, curr) => prev + curr)
         .toFixed(2),
    );
  
    // Check if the total cash in drawer is less than the change due
    if (totalCID < changeDue) {
      // If not enough funds, display an error message and update the transaction status
      displayChangeDue.innerHTML = "<p>Status: INSUFFICIENT_FUNDS</p>";
      return;
    }
  
    // If the total cash in drawer exactly equals the change due, update the transaction status to "CLOSED"
    if (totalCID === changeDue) {
        result.status = "CLOSED";
    }
  
    // Iterate through the cash drawer starting from the highest denomination
    for (let i = 0; i < reversedCid.length; i++) {
      // Check if the denomination is smaller than the change due and there is still change to give
      if (changeDue > denominations[i] && changeDue > 0) {
        let count = 0; // Counter for how many times a denomination is used
        let total = reversedCid[i][1]; // Total amount available for that denomination
        // While there is enough of this denomination to cover part of the change
        while (total > 0 && changeDue >= denominations[i]) {
          total -= denominations[i]; // Subtract the denomination from total
          changeDue = parseFloat((changeDue -= denominations[i]).toFixed(2)); // Subtract from change due and fix floating point precision
          count++; // Increment the counter
        }
        // If this denomination was used, add it and the total amount given to the result
        if (count > 0) {
          result.change.push([reversedCid[i][0], count * denominations[i]]);
        }
      }
    }
    // After attempting to give all possible change, if there's still change due
    if (changeDue > 0) {
      // Update the status to show there isn't enough in the drawer in appropriate denominations
      result.status = "INSUFFICIENT_FUNDS";
      displayChangeDue.innerHTML = "<p>Status: INSUFFICIENT_FUNDS</p>";
      return;
    }
  
    // If the change was successfully given and there were no funds issues
    if (result.status !== "INSUFFICIENT_FUNDS") {
      // Format and display the results of the transaction and update the UI accordingly
      formatResults(result.status, result.change);
      updateUI(result.change);
    }
}

// Function that checks whether the cash input field is not empty before running the cash register check
const checkResults = () => {
    if (!cash.value) {
      return;  // If the cash input is empty, exit the function early
    }
    checkCashRegister();  // If there is a value, proceed to check the cash register
  }
  
// Function to update the user interface elements based on the state of the cash register and changes
const updateUI = (change) => {
    // Mapping from currency codes to the full names for display
    const currencyNameMap = {
      PENNY: "Pennies",
      NICKEL: "Nickels",
      DIME: "Dimes",
      QUARTER: "Quarters",
      ONE: "Ones",
      FIVE: "Fives",
      TEN: "Tens",
      TWENTY: "Twenties",
      "ONE HUNDRED": "Hundreds",
    };
  
    // Update the cash in drawer if change is given out
    if (change) {
      change.forEach(changeArr => {
        const targetArr = cid.find(cidArr => cidArr[0] === changeArr[0]); // Find the matching denomination in the cash drawer
        targetArr[1] = parseFloat((targetArr[1] - changeArr[1]).toFixed(2)); // Subtract the change given from the cash drawer and format to two decimals
      });
    }
  
    // Reset the cash input field after processing
    cash.value = "";
    // Update the price screen to show the total price of the current item
    priceScreen.textContent = `Total: $${price}`;
    // Update the display of the cash drawer with updated amounts
    cashDrawerDisplay.innerHTML = `<p><strong>Change in drawer:</strong></p>
      ${cid
        .map((money) => `<p>${currencyNameMap[money[0]]}: $${money[1]}</p>`)
        .join("")}  
    `;
};
  
// Event listener to trigger the check results function when the purchase button is clicked
purchaseBtn.addEventListener("click", checkResults);
  
// Event listener to allow pressing the "Enter" key as an alternative to clicking the purchase button
cash.addEventListener("keydown", (e) => {
if (e.key === "Enter") {
    checkResults();
}
});
  
// Initial call to update the UI when the script loads
updateUI();
  
  
  