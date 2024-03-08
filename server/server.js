const express = require('express')
let app = express()
const port = 8080;
const db = require('./models/db')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
    res.send("Hello World")
})


app.listen(port, '0.0.0.0', ()=>  console.log(`listening to ${port}`));