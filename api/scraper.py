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
from http.server import BaseHTTPRequestHandler

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from current_hr_news_scraper import CurrentHRNewsScraper, generate_current_news_html


class HRNewsHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests to scrape HR news"""
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
            
            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))
            
        except Exception as e:
            # Error response
            error_data = {
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
            
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            self.wfile.write(json.dumps(error_data, ensure_ascii=False).encode('utf-8'))
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()


# Vercel serverless function handler
def handler(request, context):
    """Main handler for Vercel serverless function"""
    if request.method == 'GET':
        handler = HRNewsHandler(request, context, None)
        handler.do_GET()
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }
    elif request.method == 'OPTIONS':
        handler = HRNewsHandler(request, context, None)
        handler.do_OPTIONS()
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }
    else:
        return {
            'statusCode': 405,
            'body': json.dumps({'error': 'Method not allowed'})
        }


# For local testing
if __name__ == "__main__":
    from http.server import HTTPServer
    
    server = HTTPServer(('localhost', 8000), HRNewsHandler)
    print("Server running on http://localhost:8000")
    server.serve_forever()
