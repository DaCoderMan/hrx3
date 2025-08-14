# HR News Scraper

**PROPRIETARY SOFTWARE - WORKITU TECH, ISRAEL**

A Python-based web scraper for collecting and displaying the 100 most current HR news articles from Brazilian sources.

**Copyright (c) 2025 Workitu Tech, Israel. All Rights Reserved.**

This software is proprietary and confidential. Unauthorized use, reproduction, or distribution is strictly prohibited.

## Features

- 🔍 Search for trending AI tweets in Portuguese from Brazil
- 📊 Get engagement metrics (likes, retweets)
- 🌐 Automatic translation to English when needed
- 💾 Save results to timestamped files
- 🛡️ Comprehensive error handling
- 🔧 Configurable API parameters

## Prerequisites

- Python 3.7 or higher
- xAI API key with credits
- Internet connection

## Installation

1. **Clone or download this repository**

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up your API key:**
   
   **Option A: Environment Variable (Recommended)**
   ```bash
   # Windows PowerShell
   $env:XAI_API_KEY="your_actual_api_key_here"
   
   # Windows Command Prompt
   set XAI_API_KEY=your_actual_api_key_here
   
   # Linux/Mac
   export XAI_API_KEY="your_actual_api_key_here"
   ```
   
   **Option B: Edit the script directly**
   - Open `grok_ai_tweets.py`
   - Replace `"your_xai_api_key_here"` with your actual xAI API key

## Usage

### Basic Usage

```bash
python grok_ai_tweets.py
```

### Advanced Usage

You can modify the script to customize:

- **Model selection**: Change `model="grok-3"` to `"grok-3-mini"` (cheaper) or `"grok-4"` (if available)
- **Temperature**: Adjust creativity level (0.0 to 1.0)
- **Max tokens**: Increase for longer responses
- **Search criteria**: Modify the search prompt in `create_search_prompt()`

### Example Output

```
🚀 Grok AI Tweets Searcher
==================================================
🔍 Searching for trending AI tweets using grok-3...
📅 Timestamp: 2024-01-15 14:30:25
--------------------------------------------------
✅ Search completed successfully!
==================================================
1. @tech_brazil
   Tweet: "A inteligência artificial está revolucionando a indústria brasileira! 🚀 #AI #Brasil"
   Likes: 1,234 | Retweets: 567
   Link: https://x.com/tech_brazil/status/123456789

2. @ai_researcher_br
   Tweet: "Novo estudo mostra avanços significativos em IA generativa no Brasil..."
   Likes: 890 | Retweets: 234
   Link: https://x.com/ai_researcher_br/status/987654321

[... more tweets ...]
==================================================
💾 Results saved to: ai_tweets_20240115_143025.txt
```

## Configuration

### Available Models

- `grok-3-mini`: Fastest and most cost-effective
- `grok-3`: Balanced performance and cost
- `grok-4`: Most advanced (if you have access)

### Search Parameters

The script uses these X search filters:
- `lang:pt`: Portuguese language tweets
- `place_country:BR`: Tweets from Brazil
- `min_faves:10`: Minimum 10 likes
- `filter:safe`: Safe content only
- `-filter:replies`: Exclude replies
- Sorted by top engagement

## Troubleshooting

### Common Issues

**401 Unauthorized Error**
- Check your API key is correct
- Ensure you have credits in your xAI account
- Verify the API key has proper permissions

**429 Rate Limit Error**
- Wait a few minutes before trying again
- Consider using `grok-3-mini` for faster responses

**400 Bad Request Error**
- Check your request parameters
- Ensure the model name is correct

**Network Errors**
- Check your internet connection
- Verify firewall settings
- Try again later

### Getting Help

1. **Check API Status**: Visit [xAI API Status](https://status.x.ai)
2. **API Documentation**: [xAI API Docs](https://docs.x.ai)
3. **Credits**: Ensure you have sufficient credits in your xAI account

## File Structure

```
HRX2/
├── grok_ai_tweets.py      # Main script
├── requirements.txt       # Python dependencies
├── README.md             # This file
└── ai_tweets_*.txt       # Generated results (after running)
```

## Security Notes

- Never commit your API key to version control
- Use environment variables for production deployments
- Regularly rotate your API keys
- Monitor your API usage to avoid unexpected charges

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve this script!

## License

This project is open source and available under the MIT License.
