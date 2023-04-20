import express from 'express'
import cors from 'cors'
const app = express()
const port = 3000
import fetch from 'node-fetch'
import {WebSocketServer} from 'ws'
const sockserver = new WebSocketServer({ port: 8080 })

var webSocket = []

const cinqMin = Date.parse('1970-01-01T00:05:00')

var isChaudiereOn = false
let tempR = 20
var lastReport = Date.parse('1970-01-01T00:00:00')
var dateNull = Date.parse('1970-01-01T00:00:00')
var debutProgramme = Date.parse('1970-01-01T00:00:00')
var finProgramme = Date.parse('1970-01-01T00:00:00')
var isDisconected = false
var id
var programme = "régulé";

sockserver.on('connection', ws => {
    ws.on('close', () => {
        console.log('Client has disconnected!')
        webSocket.pop(ws)
    })
    ws.onerror = function () {
      console.log('websocket error')
    }
    ws.on('message', function(dataJSON) {
        let data = JSON.parse(dataJSON)
        switch(data.message) {
            case "connect":
                webSocket.push(ws)
                console.log('New client connected!')
            case "changeTemp":
                tempR = Number(data.temp)
                break;
            case "rejoncter":
                isDisconected = false
                break;
            case "programme":
                if(data.debut == data.fin) {
                    programme = "régulé"
                    debutProgramme = dateNull
                    finProgramme = dateNull
                } else {
                    programme = "programmé"
                    debutProgramme = Date.parse("1970-01-01T"+ data.debut + ":00")
                    finProgramme = Date.parse("1970-01-01T"+ data.fin + ":00")
                }
                tempR = tempR
                break;
          } 
    })
})

app.use(express.static('public'))

app.use(express.json())

app.use(cors({
    origin: '*', // Replace with the origin(s) that should be allowed to access your API
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type',
  }));

app.get('/disjonctOn', (req, res) => {
    if (isDisconected) {
        isDisconected = false
        webSocket.forEach((i) => i.send('disj:on'))
    }
    res.send()
})

app.post('/temperature', (req, res) => {
    const body = req.body
    let currentTemp = body.temperature
    webSocket.forEach((i) => i.send('temp:' + currentTemp))
    console.log("----------------------------")
    console.log("Controleur : Température actuelle : " + currentTemp)
    console.log("Controleur : Température référente : " + tempR)
    console.log("Controleur : Programme : " + programme)
    

    if(!(Date.now() - lastReport < cinqMin || isDisconected)) {
        if(programme == "programmé") {
            var midnight = new Date();
            midnight.setHours(0,0,0,0);
            if(isChaudiereOn == false && (midnight + debut) < Date.now() && (midnight + fin) > Date.now()) {
                try {
                    fetchWithTimeout('http://localhost:3001/etat/on', {
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
        } else if(programme == "régulé") {
            let etat = (currentTemp > tempR + 2) ? 'off' : (currentTemp < tempR - 2 ? 'on' : null)
            if((etat == 'on' && !isChaudiereOn) || (etat == 'off' && isChaudiereOn)) {
                console.log("Controleur : Demande à la Chaudière : " + etat)
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