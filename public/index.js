const pTemp = document.getElementById('temperature')
const pDisj = document.getElementById('disj')
const socket = new WebSocket("ws://localhost:8080");

socket.addEventListener("open", (event) => {
    socket.send("Hello Server!");
  });

socket.addEventListener("message", (event) => {
    console.log(event.data)
    let res = event.data.split(':')
    if (res[0] == 'temp') pTemp.innerText = 'Température :' + res[1]
    else if (res[0] == 'disj') pDisj.innerText = 'Disjoncteur :' + res[1]
  });