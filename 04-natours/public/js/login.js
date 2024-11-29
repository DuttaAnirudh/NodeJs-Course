/* eslint-disable */

const form = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');
// ALERTS
const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
};

const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
  window.setTimeout(hideAlert, 5000);
};

// LOGIN FUNCTIONALITY
const login = async (email, password) => {
  console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

// LOGOUT FUNCTIONALITY
const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/users/logout',
    });

    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    console.log(err);
    showAlert('error', 'Error logging out! Try Again.');
  }
};

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
