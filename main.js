const { app, BrowserWindow, ipcMain } = require('electron');
const bcrypt = require('bcrypt')
const path = require('path')
const fs = require('fs/promises')

const max_attempts = 3
let attempts = 0


let mainWindow = undefined;
require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/node_modules/electron`)
});

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // mainWindow.setMenu(null)
  mainWindow.loadFile('login.html')
}


async function generateHash(password) {
  const saltRounds = 5
  const hash = await bcrypt.hash(password, saltRounds);
  return hash
}

const register = async (credentials) => {
  if (!credentials) return { error: true }
  try {
    const fsUsers = await fs.readFile('./credentials/users.json', 'utf-8');
    const users = JSON.parse(fsUsers)
    // console.log(users)
    users.push({ name: credentials.name, email: credentials.email, password: await generateHash(credentials.password) })
    const fsUpdated = await fs.writeFile('./credentials/users.json', JSON.stringify(users))
    console.log(fsUpdated)
    mainWindow.loadFile('login.html')
  } catch (error) {

  }
  console.log(credentials)
}

const login = async (credentials) => {
  if(attempts >= max_attempts){
    return { error: true, max_attempts: true, msg: "Limite de tentativas atingido!" }
  }
  try {
    const response = await fs.readFile('./credentials/users.json', 'utf-8')
    const users = JSON.parse(response)

    const user = users.find((user) => user.email === credentials.email) ?? false

    if (user) {
      const match = await bcrypt.compare(credentials.password, user.password)
      console.log(match)
      if (match) {
        attempts = 0
        mainWindow.loadFile('home.html')
      } else {
        attempts++
        if (attempts >= max_attempts) {
          console.log("max_attempts")
          return { error: true, max_attempts: true, msg: "Limite de tentativas atingido!" }
        }
      }
    } else {
      return { error: true }
    }

    // console.log(isValidUser)
    // if (isValidUser) {
    // } else {
    //   return { error: true }
    // }
  } catch (error) {
    throw new Error(error)
  }
}


const logout = () => {

}

ipcMain.handle('login', async (_, credentials) => {
  return login(credentials)
})
ipcMain.handle('register', async (_, credentials) => {
  return register(credentials)
})

app.whenReady().then(createMainWindow)

