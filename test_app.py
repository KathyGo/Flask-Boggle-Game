from unittest import TestCase
from app import app
from flask import session

class MyTest(TestCase):
    def setUp(self):
        """set up client and config TESTING as True to print Flask errors in console"""
        self.client = app.test_client()
        app.config['TESTING'] = True
    
    def test_game_board(self):
        """Test game_board view and verify the status code"""
        resp = self.client.get("/")
        html = resp.get_data(as_text=True)
        self.assertEqual(resp.status_code, 200)
        self.assertIn('Boggle Board', html)

    def test_update_play_details(self):
        """Test update_play_details and verify return if the post score is the best score"""
        with self.client.session_transaction() as change_session:
            change_session['best_score'] = 10
        resp = self.client.post("/update-score", data={"score": 15})
        self.assertTrue(resp.json['newRecord'])
    
    def test_valid_word(self):
        """Test validate_word, and verify the messages for valid word"""
        with self.client.session_transaction() as change_session:
            change_session['board'] = [['A','B','J','O','Y'],['A','B','J','O','Y'],['A','B','J','O','Y'],['A','B','J','O','Y'],['A','B','J','O','Y']]
        resp = self.client.get("/validate-word?guess=joy")
        self.assertEqual(resp.json['result'],'ok')
    
    def test_invalid_word(self):
        """Test validate_word, and verify message for word not on board"""
        self.client.get("/")
        resp = self.client.get('/validate-word?guess=peace')
        self.assertEqual(resp.json['result'], 'not-on-board')

    def test_non_word(self):
        self.client.get("/")
        resp = self.client.get('validate-word?guess=bc')
        self.assertEqual(resp.json['result'], 'not-word')