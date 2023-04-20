import express from 'express'
import path from 'path'
import cors from 'cors'
const app = express()
const port = 3000
import fetch from 'node-fetch'
import {WebSocketServer} from 'ws'
const sockserver = new WebSocketServer({ port: 8080 })

var webSocket = []

sockserver.on('connection', ws => {
    webSocket.push(ws)
    console.log('New client connected!')
    ws.on('close', () => {
        console.log('Client has disconnected!')
        webSocket.pop(ws)
    })
    ws.onerror = function () {
      console.log('websocket error')
    }
})

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
        webSocket.forEach((i) => i.send('disj:on'))
    }
    res.send()
})

app.post('/temperature', (req, res) => {
    const body = req.body
    webSocket.forEach((i) => i.send('temp:' + body.temperature))
    console.log(body.temperature)
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
                    webSocket.forEach((i) => i.send('disj:off'))
                }
                isChaudiereOn = json.isOn
            })
        } catch (error) {
            lastReport = Date.now()
            isDisconected = true
            isChaudiereOn = false
            webSocket.forEach((i) => i.send('disj:off'))
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