import fetch from 'node-fetch';

const body = {temperature: 10};

setInterval(run, 1000);

async function run() {
	fetch('http://localhost:3000/temperature', {
		method: 'post',
		body: JSON.stringify(body),
		headers: {'Content-Type': 'application/json'}
	}).then((response) => response.json()).then((json) => {
		if (json.isOn) {
			body.temperature++
		}
		else {
			body.temperature--
		}
		console.log(body)
	})
}