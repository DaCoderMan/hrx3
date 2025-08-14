#!/usr/bin/env python3
"""
Simple Test API for Vercel

Copyright (c) 2025 Workitu Tech, Israel. All Rights Reserved.

This software is proprietary and confidential. Unauthorized use, reproduction, 
or distribution is strictly prohibited.
"""

import json
from datetime import datetime


def handler(request, context):
    """Simple test handler for Vercel serverless function"""
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }
    
    if request.method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers
        }
    
    if request.method == 'GET':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                "success": True,
                "message": "Test API is working!",
                "timestamp": datetime.now().isoformat(),
                "path": request.path,
                "method": request.method
            })
        }
    
    return {
        'statusCode': 405,
        'headers': headers,
        'body': json.dumps({'error': 'Method not allowed'})
    }
