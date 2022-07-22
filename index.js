const express = require('express');

const app = express();
const port = process.env.PORT || 8000

app.get('/', (req, res) => {
    res.send("we are now online")
})


app.listen(port, ()=> {
    console.log(`listening to port ${port}`)
})