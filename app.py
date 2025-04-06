from flask import Flask, render_template, request, redirect, session, url_for
from werkzeug.security import generate_password_hash, check_password_hash
import psycopg2
import os

app = Flask(__name__)
app.secret_key = 'dev_secret_key'  # Change this to something secure

# === PostgreSQL connection ===
conn = psycopg2.connect(
    dbname='snakegame',
    user='postgres',
    password='nia12345',
    host='localhost',
    port='5432'
)
cur = conn.cursor()

# === Routes ===

@app.route('/')
def home():
    if 'user_id' in session:
        return redirect(url_for('game'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        cur.execute("SELECT id, password_hash FROM users WHERE username = %s", (username,))
        user = cur.fetchone()

        if user and check_password_hash(user[1], password):
            session['user_id'] = user[0]
            session['username'] = username
            return redirect(url_for('game'))
        else:
            return render_template('login.html', message="Invalid credentials")

    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        confirm = request.form['confirm_password']

        if password != confirm:
            return render_template('signup.html', message="Passwords do not match")

        cur.execute("SELECT id FROM users WHERE username = %s", (username,))
        if cur.fetchone():
            return render_template('signup.html', message="Username already taken")

        password_hash = generate_password_hash(password)
        cur.execute("INSERT INTO users (username, password_hash) VALUES (%s, %s) RETURNING id", (username, password_hash))
        user_id = cur.fetchone()[0]
        conn.commit()

        # Create default preferences
        cur.execute("INSERT INTO preferences (user_id) VALUES (%s)", (user_id,))
        conn.commit()

        return redirect(url_for('login'))

    return render_template('signup.html')

@app.route('/game')
def game():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('main.html', username=session['username'])

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/change-password', methods=['GET', 'POST'])
def change_password():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        current = request.form['current_password']
        new = request.form['new_password']
        confirm = request.form['confirm_password']

        if new != confirm:
            return render_template('change_password.html', message="New passwords do not match")

        # Verify current password
        cur.execute("SELECT password_hash FROM users WHERE id = %s", (session['user_id'],))
        user = cur.fetchone()

        if not user or not check_password_hash(user[0], current):
            return render_template('change_password.html', message="Current password is incorrect")

        # Update password
        new_hash = generate_password_hash(new)
        cur.execute("UPDATE users SET password_hash = %s WHERE id = %s", (new_hash, session['user_id']))
        conn.commit()

        return render_template('change_password.html', message="Password updated successfully ✅")

    return render_template('change_password.html')


# === Run ===
if __name__ == '__main__':
    app.run(debug=True)
