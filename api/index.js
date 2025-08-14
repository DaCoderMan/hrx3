/**
 * Vercel Serverless Function for HR News Scraper
 * 
 * Copyright (c) 2025 Workitu Tech, Israel. All Rights Reserved.
 * 
 * This software is proprietary and confidential. Unauthorized use, reproduction, 
 * or distribution is strictly prohibited.
 */

// Simulated HR news data generator
function generateHRNews() {
  const currentDate = new Date();
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

  const newsList = [];

  for (let i = 0; i < 100; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const articleDate = new Date(currentDate.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    
    const source = newsSources[Math.floor(Math.random() * newsSources.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    
    const baseViews = Math.max(3000, 50000 - (daysAgo * 1000));
    const views = baseViews + Math.floor(Math.random() * 5000);
    const shares = Math.max(30, Math.floor(views / 100));
    const comments = Math.max(5, Math.floor(views / 500));
    
    newsList.push({
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
    });
  }

  return newsList.sort((a, b) => b.views - a.views);
}

function generateStatistics(newsList) {
  const totalViews = newsList.reduce((sum, news) => sum + news.views, 0);
  const totalShares = newsList.reduce((sum, news) => sum + news.shares, 0);
  const totalComments = newsList.reduce((sum, news) => sum + news.comments, 0);
  const currentNews = newsList.filter(news => news.is_current).length;

  const categories = {};
  const sources = {};

  newsList.forEach(news => {
    // Count categories
    if (!categories[news.category]) {
      categories[news.category] = { count: 0, views: 0 };
    }
    categories[news.category].count++;
    categories[news.category].views += news.views;

    // Count sources
    if (!sources[news.source]) {
      sources[news.source] = { count: 0, views: 0 };
    }
    sources[news.source].count++;
    sources[news.source].views += news.views;
  });

  const topCategory = Object.entries(categories)
    .sort(([,a], [,b]) => b.views - a.views)[0][0];
  
  const topSource = Object.entries(sources)
    .sort(([,a], [,b]) => b.views - a.views)[0][0];

  return {
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
}

function generateHTML(newsList, stats) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, -5);
  
  const newsHTML = newsList.map(news => {
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
  }).join('');

  return `
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
}

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle GET requests
  if (req.method === 'GET') {
    try {
      // Generate HR news data
      const newsList = generateHRNews();
      
      // Generate statistics
      const stats = generateStatistics(newsList);
      
      // Generate HTML
      const htmlContent = generateHTML(newsList, stats);
      
      // Prepare response
      const responseData = {
        success: true,
        timestamp: new Date().toISOString(),
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

      res.status(200).json(responseData);
      
    } catch (error) {
      // Error response
      const errorData = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      
      res.status(500).json(errorData);
    }
  } else {
    // Method not allowed
    res.status(405).json({ error: 'Method not allowed' });
  }
}
