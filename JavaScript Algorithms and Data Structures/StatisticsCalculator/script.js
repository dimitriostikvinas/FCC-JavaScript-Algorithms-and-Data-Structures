// Function to calculate the mean of an array
const getMean = (array) => array.reduce((acc, el) => acc + el, 0) / array.length;
// acc: accumulator for the sum, el: current element

// Function to calculate the median of an array
const getMedian = (array) => {
  // First, sort the array in ascending order
  const sorted = array.slice().sort((a, b) => a - b);
  // Determine the median based on even or odd array length
  const median =
    array.length % 2 === 0
      ? getMean([sorted[array.length / 2], sorted[array.length / 2 - 1]]) // Even: mean of the two middle numbers
      : sorted[Math.floor(array.length / 2)]; // Odd: middle number
  return median;
}

// Function to calculate the mode of an array
const getMode = (array) => {
  const counts = {};
  // Count the frequency of each element
  array.forEach((el) => {
    counts[el] = (counts[el] || 0) + 1;
  });
  // Check if all elements are equally common
  if (new Set(Object.values(counts)).size === 1) {
    return null;
  }
  // Find the element with the highest frequency
  const highest = Object.keys(counts).sort(
    (a, b) => counts[b] - counts[a]
  )[0];
  // Find all elements with the highest frequency
  const mode = Object.keys(counts).filter(
    (el) => counts[el] === counts[highest]
  );
  return mode.join(", ");
}

// Function to calculate the range of an array
const getRange = (array) => {
  return Math.max(...array) - Math.min(...array); // Difference between max and min
}

// Function to calculate the variance of an array
const getVariance = (array) => {
  const mean = getMean(array); // First calculate the mean
  const variance = array.reduce((acc, el) => {
    const difference = el - mean; // Difference from the mean
    const squared = difference ** 2; // Squared difference
    return acc + squared; // Sum of squared differences
  }, 0) / array.length;
  return variance;
}

// Function to calculate the standard deviation of an array
const getStandardDeviation = (array) => {
  const variance = getVariance(array); // First calculate the variance
  const standardDeviation = Math.sqrt(variance); // Square root of the variance
  return standardDeviation;
}

// Function to handle UI interaction and calculations
const calculate = () => {
  const value = document.querySelector("#numbers").value;
  const array = value.split(/,\s*/g); // Split input string into array of numbers
  const numbers = array.map(el => Number(el)).filter(el => !isNaN(el)); // Convert to numbers, filter out non-numbers
  
  // Calculate statistics
  const mean = getMean(numbers);
  const median = getMedian(numbers);
  const mode = getMode(numbers);
  const range = getRange(numbers);
  const variance = getVariance(numbers);
  const standardDeviation = getStandardDeviation(numbers);

  // Update UI with results
  document.querySelector("#mean").textContent = mean;
  document.querySelector("#median").textContent = median;
  document.querySelector("#mode").textContent = mode;
  document.querySelector("#range").textContent = range;
  document.querySelector("#variance").textContent = variance;
  document.querySelector("#standardDeviation").textContent = standardDeviation;
}
