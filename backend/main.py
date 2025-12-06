import sqlite3
import random
from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
# https://medium.com/@mterrano1/cors-in-a-flask-api-38051388f8cc
CORS(app)

@app.route('/flask/entries', methods=['GET'])
def entries():
    # connect per request to be safe
    connection = sqlite3.connect("main.db")

    connection.row_factory = sqlite3.Row # "format" it to be nicer for React. goes before cursor
    cursor = connection.cursor()
    
    cursor.execute("CREATE TABLE IF NOT EXISTS main (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATE DEFAULT (date('now', 'localtime')), data TEXT)")
    # end connection section of code
    cursor.execute("SELECT id, date, data FROM main")
    previous_messages = cursor.fetchall()
    previous_messages = [dict(row) for row in previous_messages]
    random.shuffle(previous_messages)
    connection.close()
    # then return jsonify
    previous_messages = jsonify(previous_messages)
    return previous_messages

@app.route('/flask/write', methods=['POST'])
def write():
    connection = sqlite3.connect("main.db")
    connection.row_factory = sqlite3.Row 

    cursor = connection.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS main (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATE DEFAULT (date('now', 'localtime')), data TEXT)")
    entry = request.json['new_entry']
    cursor.execute("INSERT INTO main (data) VALUES (?)", (entry,))
    connection.commit()
    connection.close()
    return "DONE"

@app.route('/flask/delete', methods=['POST'])
def delete():
    connection = sqlite3.connect("main.db")
    connection.row_factory = sqlite3.Row

    cursor = connection.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS main (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATE DEFAULT (date('now', 'localtime')), data TEXT)")
    entry = request.json['delete_entry']
  
    cursor.execute("DELETE FROM main WHERE id = ?", (entry,))
    connection.commit()
    connection.close()
    return "DONE"

### Journaling ###
@app.route('/flask/retrieveJournals', methods=['GET'])
def retrieve_journals():
    # connect per request to be safe
    connection = sqlite3.connect("main.db")

    connection.row_factory = sqlite3.Row # "format" it to be nicer for React. goes before cursor
    cursor = connection.cursor()
    
    cursor.execute("CREATE TABLE IF NOT EXISTS journals (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATE DEFAULT (date('now', 'localtime')), data TEXT)")
    # end connection section of code
    cursor.execute("SELECT id, date, data FROM journals")
    previous_journals = cursor.fetchall()
    previous_journals = [dict(row) for row in previous_journals]
    connection.close()
    # then return jsonify
    previous_messages = jsonify(previous_journals)
    return previous_journals

@app.route('/flask/saveJournal', methods=['POST'])
def save_journal():
    connection = sqlite3.connect("main.db")
    connection.row_factory = sqlite3.Row 

    cursor = connection.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS journals (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATE DEFAULT (date('now', 'localtime')), data TEXT)")
    journal = request.json['new_journal']
    cursor.execute("INSERT INTO journals (data) VALUES (?)", (journal,))
    connection.commit()
    connection.close()
    return "DONE"

@app.route('/flask/deleteJournal', methods=['POST'])
def delete_journal():
    connection = sqlite3.connect("main.db")
    connection.row_factory = sqlite3.Row

    cursor = connection.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS journals (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATE DEFAULT (date('now', 'localtime')), data TEXT)")
    journal = request.json['delete_journal']
  
    cursor.execute("DELETE FROM journals WHERE id = ?", (journal,))
    connection.commit()
    connection.close()
    return "DONE"




if __name__ == "__main__":
    app.run()