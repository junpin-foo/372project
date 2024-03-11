const express = require('express')
const api = require('./apiHelpers')
const port = 8080;
const cors = require('cors')

app.use(cors({
    origin: "*", // allow all origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
  }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.post("/submitTransactionForm", async (req, res) => {
    //User form data
    let transaction = req.body.transaction //Bought OR Sold
    let ticker = req.body.tickername
    let quantity = req.body.quantity
    let price = req.body.price
    let date = req.body.date

    console.log(req.body)

    //Check if we have this ticker closing price cached in DB
    let p = await db.helpers.getClosingPrice(ticker, date)
    if(p.isEmpty()) {
        //Do API call if not found
        p = json(api.polygonApiHelpers.getStockOpenClose(ticker, date))

        //Add into DB for cache
        await db.helpers.addTicker(ticker, date, price)
    }

    //Do calculation
    let profit = 0;
    let loss = 0;
    let value = (quantity * price) - (quantity * p.price); //user bought price - closing price in DB
    if(transaction == "Bought") {
        value > 0? loss+= value : profit += value // user bought - db price is (+) => lost value ELSE profit value
    } else{
        value < 0? loss+= value : profit += value // user sold - db price is (+) => profit value ELSE lost value
    }

    //DO something with total 
    const results = profit - loss; //if (-) total loss ELSE total profit

})

app.listen(port, ()=>  console.log(`listening to ${port}`));