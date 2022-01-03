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
  while (true) yield id++;
}

const id = idMaker();

function Book(title, author) {
  this.id = id.next().value;
  this.title = title;
  this.author = author;
}

function displayBooks(books) {
  if (books.length === 0) {
    let emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'No books found!';
    booksList.appendChild(emptyMessage);
  } else {
    booksList.innerHTML = '';
    books.forEach((book) => {
      let bookHTML = document.createElement('div');
      bookHTML.className = 'book';
      bookHTML.innerHTML = `
        <p>${book.title}</p>
        <p>${book.author}</p>
        <button type='button' onClick=removeBook(${book.id}) class="btn btn-remove" id='remove-book-${book.id}'>Remove</button>
        <hr />
        `;
      booksList.appendChild(bookHTML);
    });
  }
}

const form = document.getElementById('create-form');

function addBook(title, author) {
  let book = new Book(title, author);
  books.push(book);
  displayBooks(books);
}

function saveBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const { title, author } = form.elements;
  addBook(title.value, author.value);
  saveBooks();
});

function removeBook(id) {
  books = books.filter((book) => book.id !== id);
  displayBooks(books);
  saveBooks();
}

function checkBooks() {
  if (localStorage.getItem('books')) {
    books = JSON.parse(localStorage.getItem('books'));
  }
}

window.addEventListener('load', () => {
  checkBooks()
  displayBooks(books);
});
