// fetching elements from html
const searchField = document.getElementById('search-field');
const searchBtn = document.getElementById('search-btn');
const resultDetails = document.getElementById('results-details');
const booksContainer = document.getElementById('books-container');
const spinner = document.getElementById('spinner');

// functions
const loadBooks = async (keyword) => {
	const res = await fetch(`http://openlibrary.org/search.json?q=${keyword}`);
	const data = await res.json();
	displayBooks(data.docs, data.numFound);
};

const displayBooks = (booksArray, numOfBooksFound) => {
	console.log(booksArray, numOfBooksFound);
};

// Event Listeners
searchBtn.addEventListener('click', () => {
	const searchFieldValue = searchField.value;

	// calling function to fetch data
	loadBooks(searchFieldValue);
});
