from flask import Flask, request, session, render_template, jsonify, redirect
from boggle import Boggle

app= Flask('__name__')
app.config['SECRET_KEY']="SECRET"

boggle = Boggle()

@app.route("/")
def game_board():
    board = boggle.make_board()
    session['board'] = board
    highestScore = session.get('best_score', 0)
    session['play_count'] = session.get('play_count', 0) + 1
    return render_template('index.html', game_board=board, best_score=highestScore)

@app.route("/update-score", methods=["POST"])
def update_player_details():
    # import pdb
    # pdb.set_trace()
    score = request.json.get('score')
    highestScore = session.get('best_score', 0)
    session['best_score'] = max(score, highestScore)
    return jsonify(newRecord= score>highestScore)
    

@app.route("/validate-word")
def validate_word():
    guess = request.args.get("guess")
    board = session.get("board")
    res = boggle.check_valid_word(board, guess)
    return jsonify(result=res)