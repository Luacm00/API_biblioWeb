let token = "";
let isLoginMode = true;

// Elementos del DOM
const authSection = document.getElementById("auth-section");
const booksSection = document.getElementById("books-section");
const profileSection = document.getElementById("profile-section");
const addBookSection = document.getElementById("add-book-section");

const authBtn = document.getElementById("auth-btn");
const toggleAuthLink = document.getElementById("toggle-auth-link");
const authTitle = document.getElementById("auth-title");
const authMessage = document.getElementById("auth-message");
const sessionMessage = document.getElementById("session-message");

const availableBooksLink = document.getElementById("available-books-link");
const userProfileLink = document.getElementById("user-profile-link");
const addBookLink = document.getElementById("add-book-link");
const logoutLink = document.getElementById("logout-link");

// Cambiar entre Iniciar Sesión y Registro
toggleAuthLink.addEventListener("click", () => {
  isLoginMode = !isLoginMode;
  if (isLoginMode) {
    authTitle.textContent = "Iniciar Sesión";
    authBtn.textContent = "Iniciar Sesión";
    toggleAuthLink.textContent = "¿No tienes una cuenta? Regístrate aquí";
  } else {
    authTitle.textContent = "Regístrate";
    authBtn.textContent = "Regístrate";
    toggleAuthLink.textContent = "¿Ya tienes una cuenta? Inicia sesión aquí";
  }
});

// Inicio de sesión o registro
authBtn.addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const url = isLoginMode
    ? "http://localhost:3000/api/users/login"
    : "http://localhost:3000/api/users/register";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (response.ok) {
    token = data.token;
    authMessage.textContent = "";
    sessionMessage.textContent = "¡Sesión iniciada correctamente!";
    authSection.style.display = "none";
    booksSection.style.display = "block";
    loadBooks();
  } else {
    authMessage.textContent = "Error: " + data.message;
    sessionMessage.textContent = "";
  }
});

// Mostrar Libros Disponibles
availableBooksLink.addEventListener("click", () => {
  booksSection.style.display = "block";
  profileSection.style.display = "none";
  addBookSection.style.display = "none";
  loadBooks();
});

// Mostrar Perfil del Usuario
userProfileLink.addEventListener("click", async () => {
  booksSection.style.display = "none";
  profileSection.style.display = "block";
  addBookSection.style.display = "none";

  const response = await fetch("http://localhost:3000/api/users/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Manejar la respuesta
  if (response.ok) {
    const userProfile = await response.json();

    // Mostrar el nombre del usuario en el perfil
    const userNameDisplay = document.getElementById("user-name-value");
    userNameDisplay.textContent = userProfile.name;
  } else {
    const errorText = await response.text();
    console.error(
      "Error al obtener el perfil del usuario:",
      response.statusText,
      errorText
    );
  }
});

// Mostrar Formulario para Agregar Libro
addBookLink.addEventListener("click", () => {
  booksSection.style.display = "none";
  profileSection.style.display = "none";
  addBookSection.style.display = "block";
});

// Agregar Libro
document.getElementById("add-book-btn").addEventListener("click", async () => {
  // Limpiar mensaje anterior
  document.getElementById("add-book-message").textContent = "";

  const title = document.getElementById("bookTitle").value;
  const author = document.getElementById("bookAuthor").value;
  const genre = document.getElementById("bookGenre").value;

  const response = await fetch("http://localhost:3000/api/library/books/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, author, genre }),
  });

  const data = await response.json();

  if (response.ok) {
    document.getElementById("add-book-message").textContent =
      "Libro agregado con éxito.";
    loadBooks(); // Recargar libros después de agregar uno nuevo
  } else {
    document.getElementById("add-book-message").textContent =
      "Error: " + data.message;
  }
});

// Cargar libros disponibles
async function loadBooks() {
  try {
    const response = await fetch("http://localhost:3000/api/library/books", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error("Error al cargar los libros.");
    }

    const books = await response.json();
    const bookList = document.getElementById("book-list");
    bookList.innerHTML = "";

    // Añadir libros a la lista
    books.forEach((book) => {
      const li = document.createElement("li");
      li.textContent = `${book.title} - ${book.author} (${book.genre})`;
      bookList.appendChild(li);
    });
  } catch (error) {
    console.error("Error al cargar libros:", error);
    alert("Error al cargar libros: " + error.message);
  }
}

// Cerrar sesión
logoutLink.addEventListener("click", () => {
  token = "";
  authSection.style.display = "block";
  booksSection.style.display = "none";
  profileSection.style.display = "none";
  addBookSection.style.display = "none";
});
