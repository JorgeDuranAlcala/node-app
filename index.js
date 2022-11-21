const express = require("express")
const app = express()
const port = 4000
const morgan = require('morgan')
const session = require('express-session')
const { pool } = require('./db')
const path = require('path')

const products = [
    {name: 'cuaderno', price: 400},
    {name: 'lapiz', price: 400},    
]

const users = [
    {username: 'jorge', email: 'jorge@gmail.com', password: 'luna$$0621'},
    {username: 'manuel', email: 'manuel@gmail.com', password: 'luna$$2001'},    
]

app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false}))

app.use((req, res, next) => {
    res.locals.user = req.session.user
    res.locals.errors = req.session.errors
    next()
})
app.get("/", (req, res) => {
    console.log(req.session)
    res.render('index', { products })
})

app.get("/login", (req, res) => {
    console.log(req.session)
    res.render('login')
})

app.get("/signup", (req, res) => {
    console.log(req.session)
    res.render('signup')
})

app.post('/signup', async (req,res) => {
    const { p_nombre, 
        s_nombre, 
        p_apellido,
         s_apellido,  
         email, 
         password, 
         cedula, 
         telf,
         direccion_1,
         casa
        } = req.body;
    /*users.push({
        email,
        username,
        password
    })*/
    const [{insertId}] = await pool.query('INSERT INTO direcciones (id_estado, id_ciudad, id_municipio, id_parroquia, direccion_1, casa ) VALUES (?, ?, ?, ?, ?, ?)',
   [1, 1, 1, 1, direccion_1, casa])
  const [row] = await pool.query('INSERT INTO users (p_nombre, s_nombre, p_apellido, s_apellido, status, email, password, cedula, telf, direccion_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
 [p_nombre, s_nombre, p_apellido,s_apellido, 'ACTIVO', email,password,cedula,telf, insertId])
    res.redirect('/login')
})

app.get('/logout', (req,res) => {
    req.session.user = null
    res.redirect('/')
})

app.post('/login', async (req,res) => {
    const { email, password } = req.body;
    try {
        if (email.length <= 0 || password.length <= 0) throw new Error('Todos los campos deben ser llenados');       
        const [[user]] = await pool.query('SELECT * from users WHERE email = ?', [email])
        if(!user) throw new Error('Email incorrecto');
        if(user.password.toString() !== password) throw new Error('Contraseña incorrecta');
        req.session.user = user
        res.redirect('/')
    } catch (error) {
        req.session.errors = [error.message]
        res.redirect('/login')
    }
    
})

app.get('/detailsProduct', (req, res) => {
    res.render('detailsProduct')
})


app.listen(port, () => {
    console.log("server on port " + port)
})