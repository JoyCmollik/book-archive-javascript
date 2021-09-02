// fetching elements from html //
const searchField = document.getElementById('search-field');
const searchBtn = document.getElementById('search-btn');
const resultDetails = document.getElementById('result-details');
const booksContainer = document.getElementById('books-container');
const spinner = document.getElementById('spinner');
const errorMessageContainer = document.getElementById(
	'error-message-container'
);
const errorIcon = document.getElementById('error-icon');

// functions //
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
		errorIcon.classList.remove('d-none');
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
	if (!Array.isArray(receivedArray) || !receivedArray.length) {
		return 'NA';
	} else {
		let resultString = '';
		receivedArray.forEach((name, index) => {
			// showing only five publishers, if amount is bigger
			if (index < 5) {
				resultString += name + ' | ';
			}
		});

		return resultString.slice(0, resultString.length - 3);
	}
};

const showErrorMessage = (message) => {
	errorMessageContainer.classList.remove('d-none');
	errorMessageContainer.lastElementChild.innerText = message;
};

const hideElement = (element) => {
	if (!element.classList.contains('d-none')) {
		element.classList.add('d-none');
	}
};

const clearPrevData = () => {
	// clearing booksContainer
	booksContainer.innerHTML = '';

	// clearing previously showed error message
	hideElement(errorMessageContainer);

	// clearing previously showed error message
	hideElement(resultDetails);

	// clearing error-icon if showed
	hideElement(errorIcon);
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
					border
					rounded
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
								class="img-fluid rounded"
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
							<h4 class="mb-0 text-light">${book.title}</h4>
							<h6 class="text-light text-capitalize">${
								book.subtitle ? book.subtitle : ''
							}</h6>
							<p class="text-muted mt-0"><span class="brand-color">by</span> ${getString(
								book.author_name
							)}.
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
						text-light
					"
				>
					<p class="my-2 text-center">First Published: ${
						book.first_publish_year ? book.first_publish_year : 'NA'
					}</p>
					<p class="publish text-center">Published By</p>
					<p>${getString(book.publisher)}.</p>
				</div>
				
			</article>
		`;

		booksContainer.appendChild(div);
	});
};

// Event Listeners //
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
