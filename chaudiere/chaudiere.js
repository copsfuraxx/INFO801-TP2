const express = require('express')
const path = require('path')
const cors = require('cors');
const app = express()
const port = 3001

app.use(express.json())

app.use(cors({
    origin: '*', // Replace with the origin(s) that should be allowed to access your API
    methods: 'GET',
    allowedHeaders: 'Content-Type',
  }));

app.get('/etat/:etat', (req, res) => {
    let etat = req.params.etat
    console.log(etat)
    if (etat == 'on') res.json({statut:0, isOn:true})
    else if (etat == 'off') res.json({statut:0, isOn:false})
    else res.json({statut:1, isOn:null})
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})