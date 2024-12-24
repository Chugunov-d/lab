import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)
CORS(app)

# Настройки базы данных из переменных окружения
DB_CONFIG = {
    'dbname': os.getenv('DB_NAME', 'auth'),
    'user': os.getenv('DB_USER', 'db_user'),
    'password': os.getenv('DB_PASSWORD', 'db_password'),
    'host': os.getenv('DB_HOST', 'db'),
    'port': os.getenv('DB_PORT', 5432)
}

def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)

@app.route('/api/recent-cities', methods=['GET'])
def recent_cities():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute('SELECT name FROM "Cities" ORDER BY created_at DESC LIMIT 5')
        cities = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(cities)
    except Exception as e:
        print(e)
        return jsonify({'error': 'Database error'}), 500

@app.route('/api/save-city', methods=['POST'])
def save_city():
    data = request.json
    name = data.get('name')
    if not name:
        return jsonify({'error': 'City name is required'}), 400
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO "Cities" (name, created_at) VALUES (%s, NOW())', (name,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True})
    except Exception as e:
        print(e)
        return jsonify({'error': 'Database error'}), 500

@app.route('/', methods=['GET'])
def root():
    return 'Hello, world!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4002)
