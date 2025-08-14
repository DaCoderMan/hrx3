/**
 * Deployment Diagnostics API for HR News Scraper
 * 
 * Copyright (c) 2025 Workitu Tech, Israel. All Rights Reserved.
 * 
 * This software is proprietary and confidential. Unauthorized use, reproduction, 
 * or distribution is strictly prohibited.
 */

import { 
  runDeploymentChecks, 
  getDeploymentLogs, 
  getDeploymentStatus,
  logDeployment 
} from './deployment-logger.js';

export default function handler(req, res) {
  const requestId = Math.random().toString(36).substring(2, 15);
  const startTime = Date.now();
  
  logDeployment('INFO', `Deployment diagnostics request started`, { 
    requestId: requestId,
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent']
  });

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    logDeployment('INFO', `Deployment diagnostics CORS preflight handled`, { requestId: requestId });
    res.status(200).end();
    return;
  }

  // Handle GET requests
  if (req.method === 'GET') {
    try {
      const { action, level, limit } = req.query;
      
      logDeployment('INFO', `Processing deployment diagnostics request`, { 
        requestId: requestId,
        action: action,
        level: level,
        limit: limit
      });

      let responseData = {
        success: true,
        requestId: requestId,
        timestamp: new Date().toISOString(),
        performance: {
          totalTime: Date.now() - startTime
        }
      };

      // Handle different diagnostic actions
      switch (action) {
        case 'check':
          // Run comprehensive deployment checks
          logDeployment('INFO', 'Running deployment checks', { requestId: requestId });
          const checkResults = runDeploymentChecks();
          responseData.deploymentChecks = checkResults;
          responseData.summary = {
            success: checkResults.success,
            totalErrors: checkResults.errors.length,
            totalWarnings: checkResults.warnings.length,
            criticalIssues: checkResults.errors.filter(e => e.includes('CRITICAL')).length
          };
          break;
          
        case 'logs':
          // Get deployment logs
          const logLevel = level || null;
          const logLimit = parseInt(limit) || 100;
          responseData.deploymentLogs = getDeploymentLogs(logLevel, logLimit);
          responseData.logCount = responseData.deploymentLogs.length;
          break;
          
        case 'status':
          // Get deployment status
          responseData.deploymentStatus = getDeploymentStatus();
          break;
          
        case 'environment':
          // Detailed environment information
          responseData.environment = {
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch,
            cwd: process.cwd(),
            env: process.env.NODE_ENV || 'development',
            vercelEnv: process.env.VERCEL_ENV,
            vercelRegion: process.env.VERCEL_REGION,
            vercelUrl: process.env.VERCEL_URL,
            gitCommit: process.env.VERCEL_GIT_COMMIT_SHA,
            gitRef: process.env.VERCEL_GIT_COMMIT_REF,
            functionName: process.env.VERCEL_FUNCTION_NAME,
            functionRegion: process.env.VERCEL_FUNCTION_REGION,
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime()
          };
          break;
          
        case 'files':
          // File system check
          const fs = require('fs');
          const path = require('path');
          
          const requiredFiles = [
            'api/index.js',
            'api/logger.js',
            'api/debug.js',
            'api/deployment-logger.js',
            'api/deployment-diagnostics.js',
            'vercel.json',
            'package.json',
            'index.html'
          ];
          
          const fileStatus = {};
          requiredFiles.forEach(file => {
            try {
              const fullPath = path.join(process.cwd(), file);
              const exists = fs.existsSync(fullPath);
              const stats = exists ? fs.statSync(fullPath) : null;
              
              fileStatus[file] = {
                exists: exists,
                size: exists ? stats.size : 0,
                modified: exists ? stats.mtime.toISOString() : null,
                readable: exists ? true : false,
                path: fullPath
              };
            } catch (error) {
              fileStatus[file] = {
                exists: false,
                error: error.message,
                path: path.join(process.cwd(), file)
              };
            }
          });
          
          responseData.fileSystem = {
            files: fileStatus,
            totalFiles: requiredFiles.length,
            existingFiles: requiredFiles.filter(f => fileStatus[f]?.exists),
            missingFiles: requiredFiles.filter(f => !fileStatus[f]?.exists)
          };
          break;
          
        case 'dependencies':
          // Package.json and dependency check
          try {
            const fs = require('fs');
            const path = require('path');
            const packageJsonPath = path.join(process.cwd(), 'package.json');
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            
            responseData.dependencies = {
              packageJson: packageJson,
              issues: []
            };
            
            // Check for common issues
            if (!packageJson.type) {
              responseData.dependencies.issues.push('Missing "type" field in package.json');
            } else if (packageJson.type !== 'module') {
              responseData.dependencies.issues.push('Package.json "type" must be "module" for ES6 imports');
            }
            
            if (!packageJson.engines || !packageJson.engines.node) {
              responseData.dependencies.issues.push('Missing Node.js engine specification');
            }
            
            if (!packageJson.name) {
              responseData.dependencies.issues.push('Missing package name');
            }
            
          } catch (error) {
            responseData.dependencies = {
              error: error.message,
              issues: ['Failed to read package.json']
            };
          }
          break;
          
        case 'vercel':
          // Vercel-specific information
          responseData.vercel = {
            isVercel: !!process.env.VERCEL_ENV,
            environment: process.env.VERCEL_ENV,
            region: process.env.VERCEL_REGION,
            url: process.env.VERCEL_URL,
            gitCommit: process.env.VERCEL_GIT_COMMIT_SHA,
            gitRef: process.env.VERCEL_GIT_COMMIT_REF,
            functionName: process.env.VERCEL_FUNCTION_NAME,
            functionRegion: process.env.VERCEL_FUNCTION_REGION,
            deploymentUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
            issues: []
          };
          
          if (!process.env.VERCEL_ENV) {
            responseData.vercel.issues.push('Not running on Vercel');
          }
          
          if (!process.env.VERCEL_REGION) {
            responseData.vercel.issues.push('VERCEL_REGION not set');
          }
          
          break;
          
        default:
          // Return comprehensive diagnostics
          logDeployment('INFO', 'Running comprehensive deployment diagnostics', { requestId: requestId });
          
          // Run all checks
          const checkResults = runDeploymentChecks();
          const deploymentStatus = getDeploymentStatus();
          const deploymentLogs = getDeploymentLogs(null, 50);
          
          responseData.comprehensive = {
            deploymentChecks: checkResults,
            deploymentStatus: deploymentStatus,
            deploymentLogs: deploymentLogs,
            environment: {
              nodeVersion: process.version,
              platform: process.platform,
              arch: process.arch,
              cwd: process.cwd(),
              env: process.env.NODE_ENV || 'development',
              vercelEnv: process.env.VERCEL_ENV,
              vercelRegion: process.env.VERCEL_REGION,
              vercelUrl: process.env.VERCEL_URL
            },
            summary: {
              success: checkResults.success,
              totalErrors: checkResults.errors.length,
              totalWarnings: checkResults.warnings.length,
              deploymentReady: checkResults.success && checkResults.errors.length === 0
            }
          };
          break;
      }

      logDeployment('INFO', `Deployment diagnostics completed successfully`, { 
        requestId: requestId,
        totalTime: Date.now() - startTime,
        action: action
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
      
      logDeployment('ERROR', `Deployment diagnostics failed`, error, { 
        requestId: requestId,
        totalTime: Date.now() - startTime,
        method: req.method,
        url: req.url
      });
      
      res.status(500).json(errorData);
    }
  } else {
    // Method not allowed
    logDeployment('WARNING', `Deployment diagnostics method not allowed`, { 
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
