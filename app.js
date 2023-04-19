import express from 'express'
import path from 'path'
import cors from 'cors'
const app = express()
const port = 3000
import fetch from 'node-fetch'

const cinqMin = Date.parse('1970-01-01T00:05:00')

var isChaudiereOn = false
var temp = 20
var lastReport = Date.parse('1970-01-01T00:00:00')
var isDisconected = false
var id

app.use(express.json())

app.use(cors({
    origin: '*', // Replace with the origin(s) that should be allowed to access your API
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type',
  }));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/disjonctOn', (req, res) => {
    if (isDisconected) {
        isDisconected = false
    }
    res.send()
})

app.post('/temperature', (req, res) => {
    const body = req.body
    console.log(body.temperature)
    console.log(body.temperature > temp + 2)
    console.log(body.temperature < temp - 2)
    let etat
    if (body.temperature > temp + 2) etat = 'off'
    else if (body.temperature < temp - 2) etat = 'on'
    else etat = null

    if (etat != null && !isDisconected && Date.now() - lastReport > cinqMin) {//
        try {
            fetchWithTimeout('http://localhost:3001/etat/' + etat, {
                method: 'get',
                headers: {'Content-Type': 'application/json'}
            }).then((response) => response.json()).then((json) => {
                if (json.statut == 1) {
                    lastReport = Date.now()
                    isDisconected = true
                    isChaudiereOn = false
                }
                isChaudiereOn = json.isOn
            })
        } catch (error) {
            lastReport = Date.now()
            isDisconected = true
            isChaudiereOn = false
        }
    }
    res.json({isOn:isChaudiereOn})
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

async function fetchWithTimeout(resource, options = {}) {
    options.timeout = 10000
    
    let controller = new AbortController()
    clearTimeout(id)
    id = setTimeout(() => controller.abort(), options.timeout)
    let response = await fetch(resource, {
      options,
      signal: controller.signal  
    })
    clearTimeout(id)
    return response
  }