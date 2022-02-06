class BoggleGame {
	constructor(boardname, sec = 60) {
		this.board = $(`#${boardname}`);
		this.sec = sec;
		this.score = 0;
		this.guessed = [];
		this.myTimer();
		$('#guess-form').on('submit', this.submitWordToServer).bind(this);
		$('#score').text(`Your score: ${this.score}`);
	}

	myTimer() {
		let intervalId = setInterval(function() {
			this.sec = this.sec - 1;
			$('#timer').text(`Timer: ${this.sec}s`);

			if (sec === 0) {
				clearInterval(intervalId);
				// $('#guess-form').off('submit', submitWordToServer);
				alert('Time Out!');
				$('#submit-btn').addClass('disabled');
				updatePlayerDetails();
			}
		}, 1000);
	}

	async submitWordToServer(evt) {
		evt.preventDefault();
		let word = evt.target[0].value;
		if (!word) {
			return;
		}
		const res = await axios.get('http://localhost:5000/validate-word', { params: { guess: word } });
		console.log(res.data);
		let msg = '';
		console.log(this.guessed);
		console.log(word);
		if (this.guessed.includes(word)) {
			msg = `"${word}" already been guessed`;
		} else {
			if (res.data['result'] === 'ok') {
				msg = 'You got it!';
				this.guessed.push(word);
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

	async updatePlayerDetails() {
		const res = await axios({
			url: 'http://localhost:5000/update-score',
			method: 'POST',
			data: { score }
		});
		if (res.data.newRecord) {
			$('#msg')
				.text(`Congratulations! New Record: ${score}!`)
				.removeClass()
				.addClass('new_record text-center mt-1');
			$('#best-score').text(`Best Score: ${score}`);
		}
	}
}

document.addEventListener('DOMContentLoaded', function(evt) {
	new BoggleGame('boggle-board', 60);
});
