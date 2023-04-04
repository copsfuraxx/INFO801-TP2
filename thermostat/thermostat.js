import fetch from 'node-fetch';

const body = {temperature: 10};

run()

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function run() {
	while (true) {
		fetch('http://localhost:3000/temperature', {
			method: 'post',
			body: JSON.stringify(body),
			headers: {'Content-Type': 'application/json'}
		}).then((response) => response.json()).then((json) => console.log(json))
		await sleep(1000)
	}
}