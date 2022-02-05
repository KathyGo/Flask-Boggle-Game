let score = 0;
const guessed = [];
let sec = 60;
let highestScore = localStorage.getItem('highestScore');
let count = parseInt(localStorage.getItem('play_count'));

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
	let intervalId = setInterval(function() {
		sec = sec - 1;
		$('#timer').text(`Timer: ${sec}s`);
	}, 1000);
	setTimeout(stopTimer, 60000);
	function stopTimer() {
		clearInterval(intervalId);
		// $('#guess-form').off('submit', submitWordToServer);
		alert('Time Out!');
		if (!count) {
			count = 0;
		}
		count += 1;
		$('#submit-btn').addClass('disabled');
		updatePlayerDetails();
	}
}

async function updatePlayerDetails() {
	if (!highestScore) {
		highestScore = 0;
	}

	highestScore = score > highestScore ? score : highestScore;
	localStorage.setItem('highestScore', highestScore);
	localStorage.setItem('play_count', count);
	const res = await axios({
		url: 'http://localhost:5000/',
		method: 'POST',
		data: { highestScore, count }
	});
}

async function loadGame() {
	const res = await axios.get('http://localhost:5000/');
	console.log(res.data);
}

myTimer();
$('#guess-form').on('submit', submitWordToServer);
$('#score').text(`Your score: ${score}`);
