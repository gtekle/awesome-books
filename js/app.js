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
    let emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'No books found!';
    booksList.appendChild(emptyMessage);
  } else {
    books.forEach((book) => {
      let bookHTML = document.createElement('div');
      bookHTML.className = 'book';
      bookHTML.innerHTML = `
        <p>${book.title}</p>
        <p>${book.author}</p>
        <hr>`;
      let removeBtn = document.createElement('button');
      removeBtn.setAttribute('type', 'button','class', 'btn btn-remove', 'id', `remove-book-${book.id}`);
      removeBtn.innerHTML = 'Remove';
      removeBtn.addEventListener('click', () => {
        removeBook(book.id);
      })
      bookHTML.insertBefore(removeBtn, bookHTML.children[2]);
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
});
