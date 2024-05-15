const authorContainer = document.getElementById('author-container');
const loadMoreBtn = document.getElementById('load-more-btn');

let startingIndex = 0;
let endingIndex = 8;
let authorDataArr = [];

// Fetch data from the specified URL using the fetch API which returns a Promise.
fetch('https://cdn.freecodecamp.org/curriculum/news-author-page/authors.json')
  // The first .then() is invoked after the server response. The `res` object represents the response.
  .then((res) => {
    // The .json() method is called on the response object `res`.
    // This method parses the response body as JSON and also returns a Promise.
    return res.json();
  })
  // The second .then() receives the parsed JSON data from the previous .then().
  .then((data) => {
    // Store the parsed JSON data into a variable `authorDataArr`.
    authorDataArr = data;
    // `displayAuthors` function is called with a slice of the `authorDataArr`.
    // `startingIndex` and `endingIndex` are assumed to be predefined elsewhere in the code,
    // determining which part of the array to display.
    displayAuthors(authorDataArr.slice(startingIndex, endingIndex));
  })
  // The .catch() method is used to catch any errors that occur during the fetch or data processing.
  .catch((err) => {
    // If an error occurs, the innerHTML of `authorContainer` is set to display an error message.
    // `authorContainer` is assumed to be a predefined variable pointing to a DOM element.
    authorContainer.innerHTML = '<p class="error-msg">There was an error loading the authors</p>';
  });

const fetchMoreAuthors = () => {
  startingIndex += 8;
  endingIndex += 8;

  displayAuthors(authorDataArr.slice(startingIndex, endingIndex));
  if (authorDataArr.length <= endingIndex) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.style.cursor = "not-allowed";
    loadMoreBtn.textContent = 'No more data to load';
  }
};

const displayAuthors = (authors) => {
  authors.forEach(({ author, image, url, bio }, index) => {
    authorContainer.innerHTML += `
    <div id="${index}" class="user-card">
      <h2 class="author-name">${author}</h2>
      <img class="user-img" src="${image}" alt="${author} avatar">
      <div class="purple-divider"></div>
      <p class="bio">${bio.length > 50 ? bio.slice(0, 50) + '...' : bio}</p>
      <a class="author-link" href="${url}" target="_blank">${author} author page</a>
    </div>
  `;
  });
};

loadMoreBtn.addEventListener('click', fetchMoreAuthors);