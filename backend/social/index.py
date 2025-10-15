import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage social media links (CRUD operations)
    Args: event with httpMethod, body, queryStringParameters
    Returns: HTTP response with social links or operation result
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
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    if method == 'GET':
        cur.execute("SELECT id, name, url, icon, display_order FROM social_links ORDER BY display_order ASC")
        rows = cur.fetchall()
        
        social_links = [
            {
                'id': row[0],
                'name': row[1],
                'url': row[2],
                'icon': row[3],
                'display_order': row[4]
            }
            for row in rows
        ]
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(social_links),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        name = body_data.get('name')
        url = body_data.get('url')
        icon = body_data.get('icon', 'Link')
        display_order = body_data.get('display_order', 0)
        
        cur.execute(
            "INSERT INTO social_links (name, url, icon, display_order) VALUES (%s, %s, %s, %s) RETURNING id",
            (name, url, icon, display_order)
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'id': new_id, 'message': 'Social link created'}),
            'isBase64Encoded': False
        }
    
    if method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        link_id = body_data.get('id')
        name = body_data.get('name')
        url = body_data.get('url')
        icon = body_data.get('icon')
        display_order = body_data.get('display_order')
        
        cur.execute(
            "UPDATE social_links SET name = %s, url = %s, icon = %s, display_order = %s WHERE id = %s",
            (name, url, icon, display_order, link_id)
        )
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Social link updated'}),
            'isBase64Encoded': False
        }
    
    if method == 'DELETE':
        body_data = json.loads(event.get('body', '{}'))
        link_id = body_data.get('id')
        
        cur.execute("DELETE FROM social_links WHERE id = %s", (link_id,))
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Social link deleted'}),
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
