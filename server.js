const express = require('express')
const app = express();
require('dotenv').config();

const port = process.env.PORT || 3000;
app.get("/",(req,res)=>{
    res.send(`Server Started at Port: ${port}`)
})
app.listen(port, ()=>
    console.log(`Server Started at ${port}`)
)

app.post("/identify")
