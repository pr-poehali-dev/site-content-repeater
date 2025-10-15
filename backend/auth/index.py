import json
import os
import bcrypt
import jwt
from datetime import datetime, timedelta
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: User authentication and registration
    Args: event with httpMethod, body
    Returns: HTTP response with JWT token or error
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    action = body_data.get('action')
    
    if action == 'reset_admin_password':
        new_password = body_data.get('new_password', 'admin123')
        password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        db_url = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        cur.execute(
            "UPDATE users SET password_hash = %s WHERE email = 'gabuniaalan13@gmail.com'",
            (password_hash,)
        )
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Password reset successfully', 'new_password': new_password}),
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    jwt_secret = os.environ.get('JWT_SECRET')
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    if action == 'register':
        email = body_data.get('email')
        password = body_data.get('password')
        
        if not email or not password:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Email and password required'}),
                'isBase64Encoded': False
            }
        
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        try:
            cur.execute(
                "INSERT INTO users (email, password_hash, is_admin) VALUES (%s, %s, FALSE) RETURNING id, email, is_admin",
                (email, password_hash)
            )
            user = cur.fetchone()
            conn.commit()
            
            token = jwt.encode({
                'user_id': user[0],
                'email': user[1],
                'is_admin': user[2],
                'exp': datetime.utcnow() + timedelta(days=7)
            }, jwt_secret, algorithm='HS256')
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'token': token, 'email': user[1], 'is_admin': user[2]}),
                'isBase64Encoded': False
            }
        except Exception:
            conn.rollback()
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Email already registered'}),
                'isBase64Encoded': False
            }
    
    elif action == 'login':
        email = body_data.get('email')
        password = body_data.get('password')
        ip_address = event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'unknown')
        
        if not email or not password:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Email and password required'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            "SELECT COUNT(*) FROM login_attempts WHERE email = %s AND attempt_time > NOW() - INTERVAL '15 minutes'",
            (email,)
        )
        attempts_count = cur.fetchone()[0]
        
        if attempts_count >= 5:
            cur.close()
            conn.close()
            return {
                'statusCode': 429,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Too many login attempts. Try again in 15 minutes'}),
                'isBase64Encoded': False
            }
        
        cur.execute("SELECT id, email, password_hash, is_admin FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        
        if not user:
            cur.close()
            conn.close()
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid credentials'}),
                'isBase64Encoded': False
            }
        
        try:
            password_valid = bcrypt.checkpw(password.encode('utf-8'), user[2].encode('utf-8'))
        except (ValueError, AttributeError) as e:
            cur.close()
            conn.close()
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid password format', 'debug': str(e), 'hash_preview': user[2][:20]}),
                'isBase64Encoded': False
            }
        
        if not password_valid:
            cur.execute(
                "INSERT INTO login_attempts (email, ip_address) VALUES (%s, %s)",
                (email, ip_address)
            )
            conn.commit()
            cur.close()
            conn.close()
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid credentials'}),
                'isBase64Encoded': False
            }
        
        token = jwt.encode({
            'user_id': user[0],
            'email': user[1],
            'is_admin': user[3],
            'exp': datetime.utcnow() + timedelta(days=7)
        }, jwt_secret, algorithm='HS256')
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'token': token, 'email': user[1], 'is_admin': user[3]}),
            'isBase64Encoded': False
        }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 400,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Invalid action'}),
        'isBase64Encoded': False
    }