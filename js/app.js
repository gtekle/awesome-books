const main = document.getElementById('main');
const sectionTitle = document.createElement('h1');
const booksList = document.createElement('div');
const createForm = document.createElement('form');
createForm.setAttribute('id', 'create-form');

sectionTitle.textContent = 'Awesome books';

createForm.innerHTML = `<div><input name="title" type="text" placeholder="title" id="title" required></div>
<div><input name="author" type="text" placeholder="author" id="author" required></div>
<div><button type="submit" id="form-button">Add</button></div>`;

main.appendChild(sectionTitle);
main.appendChild(booksList);
main.appendChild(createForm);

let books = [];

function* idMaker() {
  let id = 0;
  while (true) yield (id += 1);
}

const id = idMaker();

function Book(title, author) {
  this.id = id.next().value;
  this.title = title;
  this.author = author;
}

let removeBtns;

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
        <p>${book.title}</p>
        <p>${book.author}</p>
        <button type='button' class="btn btn-remove" id='remove-book-${book.id}'>Remove</button>
        <hr />
        `;
      booksList.appendChild(bookHTML);
    });
  }
}

const form = document.getElementById('create-form');

function saveBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

function removeBook(id) {
  books = books.filter((book) => book.id !== id);
  displayBooks(books);
  removeBtns = document.querySelectorAll('.btn-remove');
  saveBooks();
}

function checkRemoveButtonClickEvent() {
  removeBtns.forEach((removeBtn) => {
    let id;
    removeBtn.addEventListener('click', (event) => {
      const idStr = event.target.id;
      id = parseInt(idStr.substring(idStr.length - 1), 10);
      removeBook(id);
      checkRemoveButtonClickEvent();
    });
  });
}

function addBook(title, author) {
  const book = new Book(title, author);
  books.push(book);
  displayBooks(books);
  removeBtns = document.querySelectorAll('.btn-remove');
}

function saveFormData(book) {
  localStorage.setItem('formData', JSON.stringify(book));
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const { title, author } = form.elements;
  addBook(title.value, author.value);
  saveFormData({ title: title.value, author: author.value });
  saveBooks();
  checkRemoveButtonClickEvent();
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

window.addEventListener('load', () => {
  checkFormData();
  checkBooks();
  displayBooks(books);
  removeBtns = document.querySelectorAll('.btn-remove');
  checkRemoveButtonClickEvent();
});
