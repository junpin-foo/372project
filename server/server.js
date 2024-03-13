const express = require('express')
const session = require('express-session')
const cors = require('cors')
const PORT = 3001
const app = express()
app.use(cors());

app.use(session({
    name: 'nsession',
    secret: 'secret_string',
    resave: false,
    saveUninitialized: false,
    maxAge: 1000*60*60, 
}))

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.post('/login', async(req,res) => {
    // Temp Password 
    // todo replace with db call 
    var dbPass = "password"
    console.log( req.body)
    const {username, password} = req.body
    user = {username: username, password: password}
    

    // If successful and the password matches return 200 to frontend
    if(username=== 'user@gmail.com' && password === dbPass){
        
        req.session.user = user
        res.status(200).json({ message: 'Login successful' }); 
    }
    else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
})

app.post('/logout', async(req,res)=>{
    // Remove the session and login 
    req.session.destroy()
    res.status(200).json({ message: 'Logout successful' }); 
})

app.listen(PORT, '0.0.0.0')
console.log(`Running on port ${PORT}`)