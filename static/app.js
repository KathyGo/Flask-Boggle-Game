let score = 0;
const guessed = [];
let sec = 59;

async function submitWordToServer(evt) {
	evt.preventDefault();
	let word = evt.target[0].value;
	if (!word) {
		return;
	}
	const res = await axios.get('http://localhost:5000/validate-word', { params: { guess: word } });
	console.log(res.data);
	let msg = '';
	console.log(guessed);
	console.log(word);
	if (guessed.includes(word)) {
		msg = `"${word}" already been guessed`;
	} else {
		if (res.data['result'] === 'ok') {
			msg = 'You got it!';
			guessed.push(word);
			score = score + word.length;
		} else if (res.data['result'] === 'not-on-board') {
			msg = `"${word}" is not on board`;
		} else if (res.data['result'] === 'not-word') {
			msg = `"${word}" is not a word`;
		}
	}

	$('#word').val('');
	$('#msg').text(msg);
	$('#score').text(`Your score: ${score}`);
}

function myTimer() {
	setTimeout(stopTimer, 60000);
	function stopTimer() {
		clearInterval(intervalId);
		// $('#guess-form').off('submit', submitWordToServer);
		alert('Time Out!');
		$('#submit-btn').addClass('disabled');
		updatePlayerDetails();
	}
	let intervalId = setInterval(function() {
		sec = sec - 1;
		$('#timer').text(`Timer: ${sec}s`);
	}, 1000);
}

async function updatePlayerDetails() {
	const res = await axios({
		url: 'http://localhost:5000/update-score',
		method: 'POST',
		data: { score }
	});
	if (res.data.newRecord) {
		$('#msg').text(`Congratulations! New Record: ${score}!`).removeClass().addClass('new_record text-center mt-2');
		$('#best-score').text(`Best Score: ${score}`);
	}
}

myTimer();
$('#guess-form').on('submit', submitWordToServer);
$('#score').text(`Your score: ${score}`);
