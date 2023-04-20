const pTemp = document.getElementById('temperature')
const pDisj = document.getElementById('disj')
const temp = document.getElementById('temp');
const debut = document.getElementById('debut');
const fin = document.getElementById('fin');
const socket = new WebSocket("ws://localhost:8080");

socket.addEventListener("open", (event) => {
  socket.send(JSON.stringify({message: "connect"}))
  socket.send(JSON.stringify({message: "changeTemp", temp: temp.value}))
});

socket.addEventListener("message", (event) => {
  let res = event.data.split(':')
  if (res[0] == 'temp') pTemp.innerText = res[1]
  else if (res[0] == 'disj') pDisj.className = "red"
});

function rejonct() {
  socket.send(JSON.stringify({message: "rejoncter"}))
  pDisj.className = "green"
}

function changeTemp() {
  socket.send(JSON.stringify({message: "changeTemp", temp: temp.value}))
}

function programme() {
  socket.send(JSON.stringify({message: "programme", debut: debut.value, fin: fin.value}))
}