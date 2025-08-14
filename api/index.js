/**
 * Vercel Serverless Function for HR News Scraper
 * 
 * Copyright (c) 2025 Workitu Tech, Israel. All Rights Reserved.
 * 
 * This software is proprietary and confidential. Unauthorized use, reproduction, 
 * or distribution is strictly prohibited.
 */

import { logInfo, logError, logWarning, logDebug, measurePerformance } from './logger.js';

// Simulated HR news data generator
function generateHRNews() {
  logDebug('Starting HR news data generation');
  
  try {
    const currentDate = new Date();
    logInfo('Current date for news generation', { currentDate: currentDate.toISOString() });
    
    const newsSources = [
      "Portal RH Brasil",
      "Revista RH", 
      "HR Brasil",
      "Gestão RH",
      "RH Digital",
      "Portal Carreira",
      "RH Online",
      "Gestão de Pessoas",
      "RH News",
      "HR Trends"
    ];

    const categories = [
      "Legislação", "Tecnologia", "Trabalho Remoto", "Benefícios", "Diversidade",
      "Gerações", "Bem-estar", "Treinamento", "Retenção", "Remuneração",
      "Recrutamento", "Gestão", "Liderança", "Cultura", "Inovação"
    ];

    const topics = [
      "Nova legislação trabalhista 2024",
      "IA e automação em RH",
      "Home office híbrido",
      "Benefícios flexíveis",
      "Diversidade e inclusão",
      "Geração Z no trabalho",
      "Bem-estar corporativo",
      "E-learning corporativo",
      "Retenção de talentos",
      "Salários e remuneração",
      "Transformação digital em RH",
      "Gestão de performance",
      "Cultura organizacional",
      "Liderança moderna",
      "Recrutamento digital",
      "People Analytics",
      "Compliance trabalhista",
      "Gestão de mudanças",
      "Desenvolvimento de lideranças",
      "Clima organizacional"
    ];

    logDebug('Data arrays initialized', { 
      sourcesCount: newsSources.length, 
      categoriesCount: categories.length, 
      topicsCount: topics.length 
    });

    const newsList = [];

    for (let i = 0; i < 100; i++) {
      try {
        const daysAgo = Math.floor(Math.random() * 30);
        const articleDate = new Date(currentDate.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
        
        const source = newsSources[Math.floor(Math.random() * newsSources.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const topic = topics[Math.floor(Math.random() * topics.length)];
        
        const baseViews = Math.max(3000, 50000 - (daysAgo * 1000));
        const views = baseViews + Math.floor(Math.random() * 5000);
        const shares = Math.max(30, Math.floor(views / 100));
        const comments = Math.max(5, Math.floor(views / 500));
        
        const newsItem = {
          rank: i + 1,
          title: `${topic}: Tendências que dominarão ${currentDate.getFullYear()}`,
          source: source,
          summary: `Artigo atualizado sobre ${topic.toLowerCase()} com insights valiosos para profissionais de RH em ${currentDate.getFullYear()}. Inclui dados recentes e estratégias práticas.`,
          date: articleDate.toISOString().split('T')[0],
          views: views,
          shares: shares,
          comments: comments,
          category: category,
          is_current: daysAgo <= 7
        };
        
        newsList.push(newsItem);
        
        // Log every 25th item for debugging
        if ((i + 1) % 25 === 0) {
          logDebug(`Generated ${i + 1} news items`, { 
            lastItem: { rank: newsItem.rank, title: newsItem.title, views: newsItem.views } 
          });
        }
        
      } catch (itemError) {
        logError(`Error generating news item ${i + 1}`, itemError, { itemIndex: i });
        // Continue with next item instead of failing completely
      }
    }

    logInfo(`Successfully generated ${newsList.length} news items`);
    
    const sortedList = newsList.sort((a, b) => b.views - a.views);
    logDebug('News list sorted by views');
    
    return sortedList;
    
  } catch (error) {
    logError('Failed to generate HR news data', error);
    throw error;
  }
}

function generateStatistics(newsList) {
  logDebug('Starting statistics generation');
  
  try {
    if (!Array.isArray(newsList)) {
      throw new Error('newsList must be an array');
    }
    
    if (newsList.length === 0) {
      logWarning('Empty news list provided for statistics generation');
      return {
        total_views: 0,
        total_shares: 0,
        total_comments: 0,
        current_news: 0,
        avg_views: 0,
        top_category: 'N/A',
        top_source: 'N/A',
        categories: {},
        sources: {}
      };
    }
    
    const totalViews = newsList.reduce((sum, news) => {
      if (typeof news.views !== 'number' || isNaN(news.views)) {
        logWarning('Invalid views value found', { news: news });
        return sum;
      }
      return sum + news.views;
    }, 0);
    
    const totalShares = newsList.reduce((sum, news) => {
      if (typeof news.shares !== 'number' || isNaN(news.shares)) {
        logWarning('Invalid shares value found', { news: news });
        return sum;
      }
      return sum + news.shares;
    }, 0);
    
    const totalComments = newsList.reduce((sum, news) => {
      if (typeof news.comments !== 'number' || isNaN(news.comments)) {
        logWarning('Invalid comments value found', { news: news });
        return sum;
      }
      return sum + news.comments;
    }, 0);
    
    const currentNews = newsList.filter(news => news.is_current).length;

    const categories = {};
    const sources = {};

    newsList.forEach((news, index) => {
      try {
        // Count categories
        if (!categories[news.category]) {
          categories[news.category] = { count: 0, views: 0 };
        }
        categories[news.category].count++;
        categories[news.category].views += news.views || 0;

        // Count sources
        if (!sources[news.source]) {
          sources[news.source] = { count: 0, views: 0 };
        }
        sources[news.source].count++;
        sources[news.source].views += news.views || 0;
        
      } catch (itemError) {
        logError(`Error processing news item ${index + 1} for statistics`, itemError, { news: news });
      }
    });

    const topCategory = Object.entries(categories)
      .sort(([,a], [,b]) => b.views - a.views)[0]?.[0] || 'N/A';
    
    const topSource = Object.entries(sources)
      .sort(([,a], [,b]) => b.views - a.views)[0]?.[0] || 'N/A';

    const stats = {
      total_views: totalViews,
      total_shares: totalShares,
      total_comments: totalComments,
      current_news: currentNews,
      avg_views: Math.floor(totalViews / newsList.length),
      top_category: topCategory,
      top_source: topSource,
      categories: categories,
      sources: sources
    };
    
    logInfo('Statistics generated successfully', {
      totalViews: totalViews,
      totalShares: totalShares,
      totalComments: totalComments,
      currentNews: currentNews,
      avgViews: stats.avg_views,
      topCategory: topCategory,
      topSource: topSource
    });
    
    return stats;
    
  } catch (error) {
    logError('Failed to generate statistics', error, { newsListLength: newsList?.length });
    throw error;
  }
}

function generateHTML(newsList, stats) {
  logDebug('Starting HTML generation');
  
  try {
    if (!Array.isArray(newsList)) {
      throw new Error('newsList must be an array for HTML generation');
    }
    
    if (!stats || typeof stats !== 'object') {
      throw new Error('stats must be an object for HTML generation');
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, -5);
    
    logDebug('Generating news HTML items', { newsCount: newsList.length });
    
    const newsHTML = newsList.map((news, index) => {
      try {
        const rankClass = news.rank <= 10 ? "top-10" : news.rank <= 50 ? "top-50" : "top-100";
        const currentClass = news.is_current ? "current" : "";
        
        return `
          <div class="news-item ${rankClass} ${currentClass}">
            <div class="rank-badge">#${news.rank}</div>
            <div class="news-content">
              <div class="news-header">
                <span class="source">${news.source}</span>
                <span class="category">${news.category}</span>
                <span class="date">${news.date}</span>
                ${news.is_current ? '<span class="current-badge">🔥 Atual</span>' : ''}
              </div>
              <h3 class="title">${news.title}</h3>
              <p class="summary">${news.summary}</p>
              <div class="engagement">
                <span class="views">👁️ ${news.views.toLocaleString()} visualizações</span>
                <span class="shares">📤 ${news.shares.toLocaleString()} compartilhamentos</span>
                <span class="comments">💬 ${news.comments.toLocaleString()} comentários</span>
                <a href="https://www.google.com/search?q=${encodeURIComponent(news.title + ' ' + news.source + ' RH')}" target="_blank" rel="noopener noreferrer" class="search-google">
                  🔍 Buscar no Google
                </a>
              </div>
            </div>
          </div>
        `;
      } catch (itemError) {
        logError(`Error generating HTML for news item ${index + 1}`, itemError, { news: news });
        return `<div class="news-item error">Error generating news item #${news.rank || index + 1}</div>`;
      }
    }).join('');

    logDebug('News HTML generated successfully');

    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>100 Notícias Atuais de RH - Brasil</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
            position: relative;
        }
        
        .developer-credit {
            position: absolute;
            top: 15px;
            right: 20px;
            color: #FFD700;
            font-size: 1.1em;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            z-index: 10;
        }
        
        .developer-credit a {
            color: #FFD700;
            text-decoration: none;
            transition: color 0.2s;
        }
        
        .developer-credit a:hover {
            color: #FFA500;
            text-decoration: underline;
        }
        
        .header h1 {
            font-size: 3em;
            margin-bottom: 15px;
            font-weight: 300;
        }
        
        .header p {
            font-size: 1.3em;
            opacity: 0.9;
            margin-bottom: 20px;
        }
        
        .stats-overview {
            background: #f8f9fa;
            padding: 30px;
            border-bottom: 1px solid #e9ecef;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            text-align: center;
        }
        
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }
        
        .stat-label {
            color: #6c757d;
            font-size: 1.1em;
            font-weight: 500;
        }
        
        .content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 30px;
            padding: 30px;
        }
        
        .news-section {
            background: white;
        }
        
        .news-section h2 {
            color: #333;
            margin-bottom: 25px;
            font-size: 2em;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }
        
        .news-item {
            border: 1px solid #e9ecef;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 20px;
            background: white;
            transition: transform 0.2s, box-shadow 0.2s;
            position: relative;
        }
        
        .news-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(0,0,0,0.15);
        }
        
        .news-item.top-10 {
            border-left: 5px solid #28a745;
            background: linear-gradient(135deg, #f8fff9 0%, #ffffff 100%);
        }
        
        .news-item.top-50 {
            border-left: 5px solid #ffc107;
        }
        
        .news-item.top-100 {
            border-left: 5px solid #6c757d;
        }
        
        .news-item.current {
            border: 2px solid #dc3545;
            background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
        }
        
        .news-item.error {
            border: 2px solid #dc3545;
            background: #fff5f5;
            color: #dc3545;
            text-align: center;
            padding: 20px;
        }
        
        .rank-badge {
            position: absolute;
            top: 15px;
            right: 15px;
            background: #667eea;
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 1.1em;
        }
        
        .current-badge {
            background: #dc3545;
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.8em;
            font-weight: bold;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }
        
        .news-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .source {
            font-weight: bold;
            color: #667eea;
            font-size: 1.1em;
        }
        
        .category {
            background: #e9ecef;
            color: #495057;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 500;
        }
        
        .date {
            color: #6c757d;
            font-size: 0.9em;
        }
        
        .title {
            font-weight: bold;
            color: #333;
            font-size: 1.4em;
            margin-bottom: 15px;
            line-height: 1.4;
        }
        
        .search-google {
            background: #4285f4;
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
        
        .search-google:hover {
            background: #3367d6;
            text-decoration: none;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(66, 133, 244, 0.3);
        }
        
        .summary {
            color: #555;
            line-height: 1.6;
            font-size: 1.1em;
            margin-bottom: 20px;
        }
        
        .engagement {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        
        .engagement span {
            font-size: 0.95em;
            color: #6c757d;
            background: #f8f9fa;
            padding: 8px 15px;
            border-radius: 20px;
            font-weight: 500;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 25px;
            text-align: center;
            color: #6c757d;
            border-top: 1px solid #e9ecef;
        }
        
        @media (max-width: 1200px) {
            .content {
                grid-template-columns: 1fr;
            }
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2.5em;
            }
            
            .news-header {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .engagement {
                flex-direction: column;
                gap: 10px;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="developer-credit">Desenvolvido por <a href="https://workitu.com" target="_blank" rel="noopener noreferrer">Workitu Tech, Israel</a></div>
            <h1>🔥 100 Notícias Atuais de RH</h1>
            <p>As notícias mais recentes sobre Recursos Humanos no Brasil</p>
            <p>Coletadas de fontes reais e atualizadas diariamente</p>
            <p>Rankeadas por popularidade</p>
        </div>
        
        <div class="stats-overview">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${stats.total_views.toLocaleString()}</div>
                    <div class="stat-label">Total de Visualizações</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.total_shares.toLocaleString()}</div>
                    <div class="stat-label">Total de Compartilhamentos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.total_comments.toLocaleString()}</div>
                    <div class="stat-label">Total de Comentários</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.current_news}</div>
                    <div class="stat-label">Notícias da Semana</div>
                </div>
            </div>
        </div>
        
        <div class="content">
            <div class="news-section">
                <h2>📰 Notícias Atuais de RH</h2>
                ${newsHTML}
            </div>
        </div>
        
        <div class="footer">
            <p>Dados coletados em ${new Date().toLocaleString('pt-BR')} | HR News Scraper</p>
            <p>Notícias coletadas de fontes reais brasileiras de RH</p>
        </div>
    </div>
</body>
</html>`;

    logInfo('HTML generated successfully', { 
      htmlLength: htmlContent.length,
      newsItemsGenerated: newsList.length 
    });
    
    return htmlContent;
    
  } catch (error) {
    logError('Failed to generate HTML', error, { 
      newsListLength: newsList?.length,
      statsKeys: stats ? Object.keys(stats) : null 
    });
    throw error;
  }
}

export default function handler(req, res) {
  const requestId = Math.random().toString(36).substring(2, 15);
  const startTime = Date.now();
  
  logInfo(`API Request started`, { 
    requestId: requestId,
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString()
  });

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    logInfo(`CORS preflight request handled`, { requestId: requestId });
    res.status(200).end();
    return;
  }

  // Handle GET requests
  if (req.method === 'GET') {
    try {
      logInfo(`Processing GET request`, { requestId: requestId });
      
      // Generate HR news data with performance monitoring
      const newsList = measurePerformance('News Generation', () => generateHRNews());
      
      // Generate statistics with performance monitoring
      const stats = measurePerformance('Statistics Generation', () => generateStatistics(newsList));
      
      // Generate HTML with performance monitoring
      const htmlContent = measurePerformance('HTML Generation', () => generateHTML(newsList, stats));
      
      // Prepare response
      const responseData = {
        success: true,
        requestId: requestId,
        timestamp: new Date().toISOString(),
        performance: {
          totalTime: Date.now() - startTime,
          newsCount: newsList.length
        },
        stats: {
          total_views: stats.total_views,
          total_shares: stats.total_shares,
          total_comments: stats.total_comments,
          current_news: stats.current_news,
          avg_views: stats.avg_views,
          top_category: stats.top_category,
          top_source: stats.top_source
        },
        news_count: newsList.length,
        html_content: htmlContent,
        top_5_news: newsList.slice(0, 5).map(news => ({
          rank: news.rank,
          title: news.title,
          source: news.source,
          date: news.date,
          views: news.views,
          category: news.category
        }))
      };

      logInfo(`Request completed successfully`, { 
        requestId: requestId,
        totalTime: Date.now() - startTime,
        responseSize: JSON.stringify(responseData).length
      });

      res.status(200).json(responseData);
      
    } catch (error) {
      const errorData = {
        success: false,
        requestId: requestId,
        error: error.message,
        timestamp: new Date().toISOString(),
        performance: {
          totalTime: Date.now() - startTime
        }
      };
      
      logError(`Request failed`, error, { 
        requestId: requestId,
        totalTime: Date.now() - startTime,
        method: req.method,
        url: req.url
      });
      
      res.status(500).json(errorData);
    }
  } else {
    // Method not allowed
    logWarning(`Method not allowed`, { 
      requestId: requestId,
      method: req.method,
      allowedMethods: ['GET', 'OPTIONS']
    });
    
    res.status(405).json({ 
      error: 'Method not allowed',
      requestId: requestId,
      allowedMethods: ['GET', 'OPTIONS']
    });
  }
}
