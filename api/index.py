#!/usr/bin/env python3
"""
Vercel Serverless Function for HR News Scraper

Copyright (c) 2025 Workitu Tech, Israel. All Rights Reserved.

This software is proprietary and confidential. Unauthorized use, reproduction, 
or distribution is strictly prohibited.
"""

import sys
import os
import json
from datetime import datetime

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from current_hr_news_scraper import CurrentHRNewsScraper, generate_current_news_html
except ImportError as e:
    print(f"Import error: {e}")
    sys.exit(1)


def handler(request, context):
    """Main handler for Vercel serverless function"""
    
    # Set CORS headers
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }
    
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers
        }
    
    # Handle GET requests
    if request.method == 'GET':
        # Add a simple test endpoint
        if request.path == '/api/test':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    "success": True,
                    "message": "API is working!",
                    "timestamp": datetime.now().isoformat()
                })
            }
        try:
            # Initialize scraper
            scraper = CurrentHRNewsScraper()
            
            # Collect current news
            news_list = scraper.scrape_real_hr_news()
            
            # Generate statistics
            stats = scraper.get_news_statistics(news_list)
            
            # Generate HTML
            html_content, timestamp = generate_current_news_html(news_list, stats)
            
            # Prepare response
            response_data = {
                "success": True,
                "timestamp": timestamp,
                "stats": {
                    "total_views": stats['total_views'],
                    "total_shares": stats['total_shares'],
                    "total_comments": stats['total_comments'],
                    "current_news": stats['current_news'],
                    "avg_views": stats['avg_views'],
                    "top_category": stats['top_category'],
                    "top_source": stats['top_source']
                },
                "news_count": len(news_list),
                "html_content": html_content,
                "top_5_news": [
                    {
                        "rank": news['rank'],
                        "title": news['title'],
                        "source": news['source'],
                        "date": news['date'],
                        "views": news['views'],
                        "category": news['category']
                    }
                    for news in news_list[:5]
                ]
            }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(response_data, ensure_ascii=False)
            }
            
        except Exception as e:
            # Error response
            error_data = {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
            
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps(error_data, ensure_ascii=False)
            }
    
    # Method not allowed
    return {
        'statusCode': 405,
        'headers': headers,
        'body': json.dumps({'error': 'Method not allowed'})
    }
