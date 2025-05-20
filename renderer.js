document.addEventListener('DOMContentLoaded', () => {
  verifyLocalStorage()
})

function verifyLocalStorage() {
  const localFavs = localStorage.getItem('favs') // 1,2

  if (localFavs) {
    let dataFavs = localFavs.split(',')
    document.querySelectorAll('.btn-fav').forEach(el => {
      const id = el.getAttribute('data-id')
      if (dataFavs.includes(id)) {
        el.innerText = "Favorito"
        el.classList.remove('btn-outline-primary')
        el.classList.add('btn-danger')
      } else {
        el.innerText = "Favoritar"
        el.classList.add('btn-outline-primary')
        el.classList.remove('btn-danger')
      }
    });
  }
}

function updateLocalStorage(el) {
  const id = el
  const localFavs = localStorage.getItem('favs')

  if (localFavs) {
    let dataFavs = localFavs.split(',')
    if (dataFavs.includes(id)) {
      dataFavs = dataFavs.filter(el => el !== id)
    } else {
      dataFavs.push(id)
    }

    localStorage.setItem('favs', dataFavs)
    verifyLocalStorage()
  }
}

async function login() {
  const inptEmail = document.getElementById('email').value
  const inptPassword = document.getElementById('password').value
  const errorAlert = document.getElementById('error-alert')

  const credentials = {
    "email": inptEmail,
    "password": inptPassword,
  }
  if (inptEmail && inptPassword) {
    const response = await window.authAPI.login(credentials)
    console.log(response)
    if (response.error && response.max_attempts && response.msg) {
      errorAlert.innerText = response.msg;
      errorAlert.classList.toggle('d-none')
    }
  }
}

async function register() {
  const inptName = document.getElementById('name').value
  const inptEmail = document.getElementById('email').value
  const inptPassword = document.getElementById('password').value
  const user = {
    "name": inptName,
    "email": inptEmail,
    "password": inptPassword
  }

  if (inptName && inptEmail && inptPassword) {
    const response = window.authAPI.register(user)
    if (response.error) {
      alert("Erro ao cadastrar")
    }
  }
}

function toggleFav(event) {
  const id = event.target.getAttribute('data-id')
  updateLocalStorage(id)
}
