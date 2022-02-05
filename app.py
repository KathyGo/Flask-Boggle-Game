from flask import Flask, request, session, render_template, jsonify
from boggle import Boggle

app= Flask('__name__')
app.config['SECRET_KEY']="SECRET"

boggle = Boggle()

@app.route("/")
def game_board():
    board = boggle.make_board()
    session['board'] = board
    return render_template('index.html', game_board=board)

@app.route("/", methods=["POST"])
def update_player_details():
    # import pdb
    # pdb.set_trace()
    highestScore = request.json.get('highestScore')
    play_count = request.json.get('count')
    board = session['board']
    return render_template('index.html', game_board=board)

@app.route("/validate-word")
def validate_word():
    guess = request.args.get("guess")
    board = session.get("board")
    res = boggle.check_valid_word(board, guess)
    return jsonify(result=res)