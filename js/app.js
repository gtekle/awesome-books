/* eslint-disable max-classes-per-file */
const currentDateTime = document.querySelector('.date-time');
const currentDate = new Date();
const dateFormat = {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};
currentDateTime.textContent = currentDate.toLocaleDateString('en-US', dateFormat);
const main = document.getElementById('main');
const sectionTitle = document.createElement('h1');
const bookListSection = document.createElement('section');
const booksList = document.createElement('div');
bookListSection.id = 'list';
bookListSection.innerHTML = '<h2>Book List</h2>';

class BookList {
  constructor() {
    this.books = [];
  }

  checkBooks() {
    if (localStorage.getItem('books')) {
      this.books = JSON.parse(localStorage.getItem('books'));
    }
  }

  saveBooks() {
    localStorage.setItem('books', JSON.stringify(this.books));
  }
}

const bookList = new BookList();

class Book {
  constructor(title, author) {
    this.id = this.idMaker().next().value;
    this.title = title;
    this.author = author;
  }

  // eslint-disable-next-line
  * idMaker() {
    let id;
    if (localStorage.getItem('bookId')) {
      id = parseInt(localStorage.getItem('bookId'), 10);
    } else {
      id = 0;
    }
    while (true) yield (id += 1);
  }

  addBook() {
    bookList.books.push(this);
    localStorage.setItem('bookId', this.id);
    bookList.saveBooks();
    this.displayBooks();
  }

  // eslint-disable-next-line
  removeBook(id) {
    bookList.books = bookList.books.filter((book) => book.id !== id);
    bookList.saveBooks();
  }

  displayBooks() {
    booksList.innerHTML = '';
    if (bookList.books.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'No books found!';
      booksList.appendChild(emptyMessage);
    } else {
      bookList.books.forEach((book) => {
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
          this.removeBook(
            bookList.books.find((item) => item.id === book.id).id,
          );
          removeBtn.parentElement.remove();
        });
        bookHTML.appendChild(removeBtn);
        booksList.appendChild(bookHTML);
      });
      bookListSection.appendChild(booksList);
    }
  }
}

function populateAddBookSection() {
  const addBookSection = document.createElement('section');
  const addBookSectionTitle = document.createElement('h2');
  const form = document.createElement('form');
  addBookSection.id = 'add';
  addBookSection.classList.add('add-book', 'd-flex', 'col', 'd-off');
  addBookSectionTitle.textContent = 'Add a new book';
  addBookSectionTitle.className = 'section-title';
  form.id = 'create-form';
  form.innerHTML = `<input name="title" type="text" placeholder="title" id="title" required>
    <input name="author" type="text" placeholder="author" id="author" required>
    <button type="submit" id="form-button" class="clickeable btn">Add</button>
    <div id="success-msg"></div>`;

  addBookSection.appendChild(addBookSectionTitle);
  addBookSection.appendChild(form);

  function saveFormData(book) {
    localStorage.setItem('formData', JSON.stringify(book));
  }

  function displaySuccess() {
    const successMsg = document.getElementById('success-msg');
    successMsg.textContent = 'Your book has been added!';
    setTimeout(() => {
      successMsg.textContent = '';
    }, 3000);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const { title, author } = form.elements;
    const newBook = new Book(title.value, author.value);
    newBook.addBook();
    saveFormData({ title: title.value, author: author.value });
    displaySuccess();
  });

  function checkFormData() {
    const { title, author } = form.elements;
    if (localStorage.getItem('formData')) {
      title.value = JSON.parse(localStorage.getItem('formData')).title;
      author.value = JSON.parse(localStorage.getItem('formData')).author;
    }
  }

  checkFormData();

  return addBookSection;
}

function populateContactSection() {
  const contactSection = document.createElement('section');
  contactSection.id = 'contact';
  contactSection.classList.add('contact-info', 'd-flex', 'col', 'd-off');
  contactSection.innerHTML = `<h2 class="section-title">Contact information</h2>
     <p> Do you have a question or you just want to say <q>Hello</q>? <br />
         You can reachout to us: </p>
      <ul>
        <li>Our e-mail: mail@mail.com</li>
        <li>Our phome number: 0043586534422</li>
        <li>Our address: Streetname 22, 84503 City, Country</li>
      </ul>`;

  return contactSection;
}

function populateMainSection() {
  booksList.className = 'books-container';
  sectionTitle.textContent = 'Awesome books';

  main.appendChild(sectionTitle);
  main.appendChild(bookListSection);
  main.appendChild(populateAddBookSection());
  main.appendChild(populateContactSection());
}

window.addEventListener('DOMContentLoaded', () => {
  populateMainSection();
  bookList.checkBooks();
  const book = new Book();
  book.displayBooks();
});

const linkItems = document.querySelectorAll('.nav-item');
linkItems.forEach((item) => {
  item.addEventListener('click', () => {
    const activeLink = document.getElementById(item.id);
    const activeSection = document.getElementById(item.id.substring(5));

    if (!activeLink.classList.contains('active')) {
      activeLink.classList.add('active');
      activeSection.classList.remove('d-off');
    }

    linkItems.forEach((previousItem) => {
      const hiddenSection = document.getElementById(previousItem.id.substring(5));
      if (previousItem.id !== item.id && previousItem.classList.contains('active')) {
        previousItem.classList.remove('active');
      }
      if (previousItem.id !== item.id && !hiddenSection.classList.contains('d-off')) {
        hiddenSection.classList.add('d-off');
      }
    });
  });
});
