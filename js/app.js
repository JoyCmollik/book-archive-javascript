// fetching elements from html
const searchField = document.getElementById('search-field');
const searchBtn = document.getElementById('search-btn');
const resultDetails = document.getElementById('result-details');
const booksContainer = document.getElementById('books-container');
const spinner = document.getElementById('spinner');
const errorMessageContainer = document.getElementById(
	'error-message-container'
);

// functions
const loadBooks = async (keyword) => {
	const res = await fetch(
		` https://openlibrary.org/search.json?q=${keyword}`
	);
	const data = await res.json();

	// stopping spinner
	spinner.classList.add('d-none');

	// sending data
	if (data.numFound) {
		displayBooks(data.docs, data.numFound);
	} else {
		showErrorMessage('No data found!');
	}
};

const updateResultStatus = (numOfResults) => {
	let showingQuantity = 40;

	// checking if 40 results are available
	if (numOfResults < 40) {
		showingQuantity = numOfResults;
	}

	// update number of results
	resultDetails.classList.remove('d-none');
	resultDetails.textContent = `Showing ${showingQuantity} out of ${numOfResults} total results`;

	return showingQuantity;
};

const getString = (receivedArray) => {
	// checking if array is empty
	if (!receivedArray.length) {
		return 'NA';
	}

	let resultString = '';
	receivedArray.forEach((name) => (resultString += name + ' | '));

	return resultString.slice(0, resultString.length - 3);
};

const displayBooks = (booksArray, numOfBooksFound) => {
	// deciding how many to show
	const showingQuantity = updateResultStatus(numOfBooksFound);

	// get the array of books to show
	const finalBooksArray = booksArray.filter(
		(book, index) => index < showingQuantity
	);

	// appending books
	finalBooksArray.forEach((book) => {
		// making card
		const div = document.createElement('div');
		div.classList.add('col');
		div.innerHTML = `
		    <article
				class="
					book-card
					shadow
					border
					d-flex
					flex-column
					justify-content-between
					h-100
				"
			>

				<!-- top -->
				<div
					class="
						top-wrapper
						p-2
						row row-cols-2
						align-items-center
					"
				>

					<!-- top-left -->
					<div class="col">
						<div class="wrapper text-center">
							<img
								class="img-fluid shadow"
								src="${
									book.cover_i
										? 'https://covers.openlibrary.org/b/id/' +
										  book.cover_i +
										  '-M.jpg'
										: 'images/book-cover.png'
								}"
								alt="book-cover"
							/>
						</div>
					</div>

					<!-- top-right -->
					<div class="col align-self-start">
						<div class="wrapper">
							<h4 class="mb-0">${book.title}</h4>
							<h6>${book.subtitle ? book.subtitle : ''}</h6>
							<p class="text-muted mt-0">
								by ${getString(book.author_name)}.
							</p>
							<button class="btn btn-dark">
								Know More
							</button>
						</div>
					</div>
				</div>

				<!-- bottom -->
				<div
					class="
						bottom-wrapper
						px-4
						py-2
						bg-dark
						bg-opacity-75
						text-light
					"
				>
					<p class="my-1">First Published: ${
						book.first_publish_year ? book.first_publish_year : 'NA'
					}</p>
					<p>Published by: ${getString(book.publisher)}.</p>
				</div>
				
			</article>
		`;

		booksContainer.appendChild(div);
	});
};

const showErrorMessage = (message) => {
	errorMessageContainer.classList.remove('d-none');
	errorMessageContainer.lastElementChild.innerText = message;
};

const clearPrevData = () => {
	// clearing booksContainer
	booksContainer.innerHTML = '';

	// clearing previously showed error message
	if (!errorMessageContainer.classList.contains('d-none')) {
		errorMessageContainer.classList.add('d-none');
	}

	// clearing previously showed error message
	if (!resultDetails.classList.contains('d-none')) {
		resultDetails.classList.add('d-none');
	}
};

// Event Listeners
searchBtn.addEventListener('click', () => {
	// clearing prev search data if available
	clearPrevData();

	// getting search field value
	const searchFieldValue = searchField.value;

	// checking if search input is empty
	if (!searchFieldValue.trim().length) {
		showErrorMessage("Input field can't be empty");
	} else {
		// loading spinner
		spinner.classList.remove('d-none');
		// calling function to fetch data
		loadBooks(searchFieldValue);
	}

	// clear inputs
	searchField.value = '';
});
