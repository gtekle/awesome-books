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

const books = [];

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
    books.forEach((book) => {
      let bookHTML = document.createElement('div');
      bookHTML.className = 'book';
      bookHTML.innerHTML = `
        <p>${book.title}</p>
        <p>${book.author}</p>
        <button type='button'>Remove</button>
        <hr />
        `;
      booksList.appendChild(bookHTML);
    });
  }
}

displayBooks(books);

const form = document.getElementById('create-form');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const { title, author } = form.elements;
  let book = new Book(title.value, author.value);
  books.push(book);
  booksList.innerHTML = '';
  displayBooks(books);

})


