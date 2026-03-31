// Global variables
let books = [];
const STORAGE_KEY = 'BOOKSHELF_APP_DATA';

// DOM Elements
const bookForm = document.getElementById('bookForm');
const incompleteBookList = document.getElementById('incompleteBookList');
const completeBookList = document.getElementById('completeBookList');
const bookFormSubmit = document.getElementById('bookFormSubmit');
const bookFormIsComplete = document.getElementById('bookFormIsComplete');

/**
 * Initialize application
 */
function init() {
  loadData();
  renderBooks();

  // Listen for form checkbox change to update button text
  bookFormIsComplete.addEventListener('change', () => {
    const text = bookFormIsComplete.checked ? 'Selesai dibaca' : 'Belum selesai dibaca';
    bookFormSubmit.querySelector('span').innerText = text;
  });

  // Handle form submission
  bookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addBook();
  });
}

/**
 * Save data to localStorage
 */
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

/**
 * Load data from localStorage
 */
function loadData() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData !== null) {
    books = JSON.parse(serializedData);
  }
}

/**
 * Add a new book
 */
function addBook() {
  const titleInput = document.getElementById('bookFormTitle');
  const authorInput = document.getElementById('bookFormAuthor');
  const yearInput = document.getElementById('bookFormYear');
  const isCompleteInput = document.getElementById('bookFormIsComplete');

  // Basic validation
  let isValid = true;
  [titleInput, authorInput, yearInput].forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('invalid');
      isValid = false;
    } else {
      input.classList.remove('invalid');
    }
  });

  if (!isValid) return;

  const newBook = {
    id: +new Date(),
    title: titleInput.value,
    author: authorInput.value,
    year: parseInt(yearInput.value),
    isComplete: isCompleteInput.checked
  };

  books.push(newBook);
  saveData();
  renderBooks();
  
  // Reset form
  bookForm.reset();
  bookFormSubmit.querySelector('span').innerText = 'Belum selesai dibaca';
}

/**
 * Toggle book status between shelves
 */
function toggleBookStatus(bookId) {
  const bookIndex = books.findIndex(book => book.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    saveData();
    renderBooks();
  }
}

/**
 * Delete a book
 */
function deleteBook(bookId) {
  const confirmDelete = confirm('Apakah Anda yakin ingin menghapus buku ini?');
  if (confirmDelete) {
    books = books.filter(book => book.id !== bookId);
    saveData();
    renderBooks();
  }
}

/**
 * Create book element for UI
 */
function createBookElement(book) {
  const container = document.createElement('article');
  container.className = 'book-item';
  container.setAttribute('data-bookid', book.id);

  const title = document.createElement('h3');
  title.innerText = book.title;

  const authorAndYear = document.createElement('p');
  authorAndYear.innerText = `Penulis: ${book.author} | Tahun: ${book.year}`;

  const actions = document.createElement('div');
  actions.className = 'book-actions';

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'btn btn-toggle';
  toggleBtn.innerText = book.isComplete ? 'Tandai Belum Selesai' : 'Tandai Selesai';
  toggleBtn.addEventListener('click', () => toggleBookStatus(book.id));

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-delete';
  deleteBtn.innerText = 'Hapus Buku';
  deleteBtn.addEventListener('click', () => deleteBook(book.id));

  actions.append(toggleBtn, deleteBtn);
  container.append(title, authorAndYear, actions);

  return container;
}

/**
 * Render all books to shelves
 */
function renderBooks() {
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  for (const book of books) {
    const bookElem = createBookElement(book);
    if (book.isComplete) {
      completeBookList.append(bookElem);
    } else {
      incompleteBookList.append(bookElem);
    }
  }

  // Handle empty shelves
  if (incompleteBookList.children.length === 0) {
    incompleteBookList.innerHTML = '<p class="empty-msg">Tidak ada buku.</p>';
  }
  if (completeBookList.children.length === 0) {
    completeBookList.innerHTML = '<p class="empty-msg">Tidak ada buku.</p>';
  }
}

// Start the app
init();
