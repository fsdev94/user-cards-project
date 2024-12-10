import headerHTML from './components/Header.html';
import footerHTML from './components/Footer.html';

const BASE_API_URL = import.meta.env.VITE_ROUTE_API_BASE_URL;
const USERS_PER_PAGE = 4;

let currentPage = 1;
let users = [];

const fetchUsers = async () => {
  try {
    const response = await fetch(BASE_API_URL);

    if (!response.ok) throw new Error('Ошибка при загрузке пользователей');

    users = await response.json();

    handleRenderUsers();
    handleRenderPagination();
  } catch (error) {
    console.error(error);

    document.querySelector(
      '#users',
    ).innerHTML = `<p>Не удалось загрузить пользователей.</p>`;
  }
};

const handleOpenModal = (userId) => {
  const user = users.find((u) => u.id == userId);

  if (!user) return;

  const modalName = document.querySelector('#modalName');
  const modalBio = document.querySelector('#modalBio');

  if (modalName && modalBio) {
    modalName.textContent = user.name;
    modalBio.textContent = `
      Телефон: ${user.phone}\n
      Веб-сайт: ${user.website}\n
      Компания: ${user.company.name}
    `;
  }
};

const handleRenderUsers = () => {
  const usersContainer = document.querySelector('#users');
  const start = (currentPage - 1) * USERS_PER_PAGE;
  const end = start + USERS_PER_PAGE;
  const paginatedUsers = users.slice(start, end);

  usersContainer.innerHTML = '';

  paginatedUsers.forEach((user) => {
    const userCard = document.createElement('div');

    userCard.className = 'col-md-3 col-sm-6';
    userCard.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${user.name}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${user.username}</h6>

          <p class="card-text">
            Город: ${user.address.city}<br>
            Email: ${user.email}
          </p>

          <button class="btn btn-outline-primary" data-user-id="${user.id}" data-bs-toggle="modal" data-bs-target="#userModal">
            Подробнее
          </button>
        </div>
      </div>
    `;
    usersContainer.appendChild(userCard);
  });

  document.querySelectorAll('.btn[data-user-id]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const userId = event.target.dataset.userId;

      handleOpenModal(userId);
    });
  });
};

const handleRenderPagination = () => {
  const paginationContainer = document.querySelector('#pagination');
  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);

  paginationContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');

    pageButton.className = `btn btn-secondary mx-1 ${
      i === currentPage ? 'active' : ''
    }`;
    pageButton.textContent = i;
    pageButton.addEventListener('click', () => {
      currentPage = i;
      handleRenderUsers();
      handleRenderPagination();
    });
    paginationContainer.appendChild(pageButton);
  }
};

document.getElementById('app').innerHTML = `
  ${headerHTML}
  <main class="container">
    <div class="page-wrapper">
      <div id="users" class="row g-3"></div>
      <div id="pagination" class="d-flex justify-content-center mt-4"></div>
    </div>
  </main>
  ${footerHTML}
`;

fetchUsers();
