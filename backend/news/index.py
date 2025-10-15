import json
import os
import jwt
import psycopg2
from typing import Dict, Any

def verify_admin(token: str, jwt_secret: str) -> bool:
    try:
        payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
        return payload.get('is_admin', False)
    except:
        return False

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage news articles (CRUD operations)
    Args: event with httpMethod, body, headers
    Returns: HTTP response with news data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    jwt_secret = os.environ.get('JWT_SECRET')
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    if method == 'GET':
        cur.execute("SELECT id, title, description, date FROM news ORDER BY id DESC")
        rows = cur.fetchall()
        news_list = [
            {'id': row[0], 'title': row[1], 'description': row[2], 'date': row[3]}
            for row in rows
        ]
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(news_list),
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
    
    if not token or not verify_admin(token, jwt_secret):
        cur.close()
        conn.close()
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Admin access required'}),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        title = body_data.get('title')
        description = body_data.get('description')
        date = body_data.get('date')
        
        cur.execute(
            "INSERT INTO news (title, description, date) VALUES (%s, %s, %s) RETURNING id, title, description, date",
            (title, description, date)
        )
        row = cur.fetchone()
        conn.commit()
        
        news_item = {'id': row[0], 'title': row[1], 'description': row[2], 'date': row[3]}
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(news_item),
            'isBase64Encoded': False
        }
    
    elif method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        news_id = body_data.get('id')
        title = body_data.get('title')
        description = body_data.get('description')
        date = body_data.get('date')
        
        cur.execute(
            "UPDATE news SET title = %s, description = %s, date = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING id, title, description, date",
            (title, description, date, news_id)
        )
        row = cur.fetchone()
        conn.commit()
        
        if not row:
            cur.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'News not found'}),
                'isBase64Encoded': False
            }
        
        news_item = {'id': row[0], 'title': row[1], 'description': row[2], 'date': row[3]}
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(news_item),
            'isBase64Encoded': False
        }
    
    elif method == 'DELETE':
        body_data = json.loads(event.get('body', '{}'))
        news_id = body_data.get('id')
        
        cur.execute("DELETE FROM news WHERE id = %s RETURNING id", (news_id,))
        row = cur.fetchone()
        conn.commit()
        
        cur.close()
        conn.close()
        
        if not row:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'News not found'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
