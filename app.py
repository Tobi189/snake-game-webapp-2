from flask import Flask, render_template, request, redirect, session, url_for
from werkzeug.security import generate_password_hash, check_password_hash
import psycopg2

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

   

        return redirect(url_for('login'))

    return render_template('signup.html')

@app.route('/game')
def game():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    user_id = session['user_id']
    username = session['username']

    cur.execute("SELECT MAX(score) FROM scores WHERE user_id = %s", (user_id,))
    high_score = cur.fetchone()[0] or 0

    return render_template('main.html', username=username, high_score=high_score)

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

@app.route('/delete-account', methods=['POST'])
def delete_account():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    password = data.get('password')

    if not password:
        return jsonify({'success': False, 'message': 'Password required'}), 400

    user_id = session['user_id']

    # Check password before deletion
    cur.execute("SELECT password_hash FROM users WHERE id = %s", (user_id,))
    user = cur.fetchone()

    if not user or not check_password_hash(user[0], password):
        return jsonify({'success': False, 'message': 'Incorrect password'}), 403

    # Delete user and cascade
    cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
    conn.commit()

    session.clear()
    return jsonify({'success': True})


from flask import jsonify
from datetime import datetime

@app.route('/submit-score', methods=['POST'])
def submit_score():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    score = data.get('score')
    user_id = session['user_id']

    # If score is not valid or is just for loading leaderboard (e.g. score = 0)
    if not isinstance(score, int) or score <= 0:
        # Just return the leaderboard
        cur.execute("""
            SELECT u.username, s.score
            FROM scores s
            JOIN users u ON s.user_id = u.id
            ORDER BY s.score DESC
            LIMIT 5
        """)
        top_scores = cur.fetchall()
        leaderboard = [{'username': row[0], 'score': row[1]} for row in top_scores]

        # Return current high_score as well
        cur.execute("SELECT MAX(score) FROM scores WHERE user_id = %s", (user_id,))
        high_score = cur.fetchone()[0] or 0


        return jsonify({
            'high_score': high_score,
            'leaderboard': leaderboard
        })


    # If this is a real game score
    from datetime import datetime
    cur.execute("""
        INSERT INTO scores (user_id, score, played_at)
        VALUES (%s, %s, %s)
    """, (user_id, score, datetime.now()))
    conn.commit()

    # Update high score if needed
    cur.execute("SELECT MAX(score) FROM scores WHERE user_id = %s", (user_id,))
    current_high = cur.fetchone()[0] or 0

    # Return updated leaderboard
    cur.execute("""
        SELECT u.username, s.score
        FROM scores s
        JOIN users u ON s.user_id = u.id
        ORDER BY s.score DESC
        LIMIT 5
    """)
    top_scores = cur.fetchall()
    leaderboard = [{'username': row[0], 'score': row[1]} for row in top_scores]

    return jsonify({
        'high_score': current_high,
        'leaderboard': leaderboard
    })



# === Run ===
if __name__ == '__main__':
    app.run(debug=True)
