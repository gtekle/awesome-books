const main = document.getElementById('main');
const sectionTitle = document.createElement('h1');
const booksList = document.createElement('div');
booksList.className = 'books-container';
const createForm = document.createElement('form');
createForm.setAttribute('id', 'create-form');
const divisor = document.createElement('div');
divisor.className = 'divisor';

sectionTitle.textContent = 'Awesome books';

createForm.innerHTML = `<h2>Add a new book</h2><input name="title" type="text" placeholder="title" id="title" required>
<input name="author" type="text" placeholder="author" id="author" required>
<button type="submit" id="form-button" class="clickeable btn">Add</button>`;

main.appendChild(sectionTitle);
main.appendChild(booksList);
main.appendChild(divisor);
main.appendChild(createForm);

function* idMaker() {
  let id;
  if (localStorage.getItem('bookId')) {
    id = parseInt(localStorage.getItem('bookId'), 10);
  } else {
    id = 0;
  }
  while (true) yield (id += 1);
}

const id = idMaker();

class BookList {
  constructor() {
    this.books = [];
  }
}

const bookList = new BookList();

class Book {
  constructor(title, author) {
    this.id = id.next().value;
    this.title = title;
    this.author = author;
  }

  addBook() {
    bookList.books.push(this);
    localStorage.setItem('bookId', this.id);
    this.saveBooks();
    displayBooks(bookList.books);
  }

  removeBook(id) {
    bookList.books = bookList.books.filter((book) => book.id !== id);
    this.saveBooks();
  }

  saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
  }
}

function displayBooks(books) {
  booksList.innerHTML = '';
  if (books.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'No books found!';
    booksList.appendChild(emptyMessage);
  } else {
    books.forEach((book) => {
      const bookHTML = document.createElement('div');
      bookHTML.className = 'book';
      bookHTML.innerHTML = `
        <p><q>${book.title}</q> by ${book.author}</p>`;
      const removeBtn = document.createElement('button');
      removeBtn.setAttribute('type', 'button');
      removeBtn.id = `remove-book-${book.id}`;
      removeBtn.classList.add('btn', 'btn-remove', 'clickeable');
      removeBtn.innerHTML = 'Remove';
      removeBtn.addEventListener('click', () => {
        const targetBook = new Book();
        targetBook.removeBook(books.find((item) => item.id === book.id).id);
        removeBtn.parentElement.remove();
      });
      bookHTML.appendChild(removeBtn);
      booksList.appendChild(bookHTML);
    });
  }
}

const form = document.getElementById('create-form');

function saveFormData(book) {
  localStorage.setItem('formData', JSON.stringify(book));
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const { title, author } = form.elements;
  const newBook = new Book(title.value, author.value);
  newBook.addBook();
  saveFormData({ title: title.value, author: author.value });
});

function checkBooks() {
  if (localStorage.getItem('books')) {
    books = JSON.parse(localStorage.getItem('books'));
  }
}

function checkFormData() {
  const { title, author } = form.elements;
  if (localStorage.getItem('formData')) {
    title.value = JSON.parse(localStorage.getItem('formData')).title;
    author.value = JSON.parse(localStorage.getItem('formData')).author;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  checkFormData();
  checkBooks();
  displayBooks(books);
});
