const express = require('express')
const path = require('path')
const cors = require('cors');
const app = express()
const port = 3000
var db = []

//const carburant = ['Gazoil', 'SP95', 'SP98']
const born = [['Gazoil', 'SP95', 'SP98'], ['Gazoil'], ['SP95', 'SP98']]

app.use(express.json())

app.use(cors({
    origin: '*', // Replace with the origin(s) that should be allowed to access your API
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type',
  }));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/caisse', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/caisse.html'));
})

app.get('/borne/:id', (req, res) => {
    let index = req.params.id
    res.json({data:born[index-1]})
})

app.get('/borne', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/borne.html'));
})

app.post('/temperature', (req, res) => {
    const body = req.body
    console.log(body)
    res.json({ok:'ok'})
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})