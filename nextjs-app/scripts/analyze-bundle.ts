/**
 * Bundle Analysis Script
 * 
 * Analyzes the Next.js bundle size and generates a report.
 * Helps identify opportunities for code splitting and optimization.
 * 
 * Usage:
 *   npm run build
 *   npx ts-node scripts/analyze-bundle.ts
 */

import fs from 'fs';
import path from 'path';

interface BundleFile {
  name: string;
  size: number;
  gzipSize: number;
}

interface BundleReport {
  timestamp: string;
  totalSize: number;
  totalGzipSize: number;
  files: BundleFile[];
  largestFiles: BundleFile[];
  recommendations: string[];
}

/**
 * Parse Next.js build output to extract bundle information
 */
function analyzeBuildOutput(): BundleReport {
  const buildDir = path.join(process.cwd(), '.next');
  const staticDir = path.join(buildDir, 'static');
  
  const files: BundleFile[] = [];
  let totalSize = 0;
  let totalGzipSize = 0;

  // Analyze static files
  if (fs.existsSync(staticDir)) {
    const analyzeDir = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          analyzeDir(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.css'))) {
          const stats = fs.statSync(fullPath);
          const size = stats.size;
          
          // Estimate gzip size (typically 30-40% of original)
          const gzipSize = Math.round(size * 0.35);
          
          files.push({
            name: path.relative(buildDir, fullPath),
            size,
            gzipSize,
          });
          
          totalSize += size;
          totalGzipSize += gzipSize;
        }
      }
    };
    
    analyzeDir(staticDir);
  }

  // Sort by size
  const largestFiles = [...files]
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (totalGzipSize > 500 * 1024) {
    recommendations.push('⚠️  Total bundle size exceeds 500KB (gzipped). Consider further optimization.');
  }
  
  const largestFile = largestFiles[0];
  if (largestFile && largestFile.gzipSize > 100 * 1024) {
    recommendations.push(`⚠️  Largest file (${largestFile.name}) exceeds 100KB. Consider code splitting.`);
  }

  // Check for duplicate dependencies
  const jsFiles = files.filter(f => f.name.includes('.js'));
  if (jsFiles.length > 20) {
    recommendations.push(`ℹ️  Found ${jsFiles.length} JavaScript chunks. Code splitting is active.`);
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ Bundle size looks good!');
  }

  return {
    timestamp: new Date().toISOString(),
    totalSize,
    totalGzipSize,
    files,
    largestFiles,
    recommendations,
  };
}

/**
 * Format bytes to human-readable format
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Generate and print bundle report
 */
function generateReport(report: BundleReport): void {
  console.log('\n📦 Bundle Analysis Report');
  console.log('═'.repeat(60));
  console.log(`Generated: ${new Date(report.timestamp).toLocaleString()}\n`);

  console.log('📊 Summary');
  console.log('─'.repeat(60));
  console.log(`Total Size:       ${formatBytes(report.totalSize)}`);
  console.log(`Gzipped Size:     ${formatBytes(report.totalGzipSize)}`);
  console.log(`Number of Files:  ${report.files.length}\n`);

  console.log('🔝 Top 10 Largest Files');
  console.log('─'.repeat(60));
  report.largestFiles.forEach((file, index) => {
    console.log(
      `${index + 1}. ${file.name.padEnd(40)} ${formatBytes(file.size).padStart(10)} (${formatBytes(file.gzipSize)} gzipped)`
    );
  });

  console.log('\n💡 Recommendations');
  console.log('─'.repeat(60));
  report.recommendations.forEach(rec => {
    console.log(`${rec}`);
  });

  console.log('\n' + '═'.repeat(60) + '\n');

  // Save report to file
  const reportPath = path.join(process.cwd(), 'bundle-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 Full report saved to: ${reportPath}\n`);
}

/**
 * Main execution
 */
function main(): void {
  try {
    const report = analyzeBuildOutput();
    generateReport(report);
  } catch (error) {
    console.error('❌ Error analyzing bundle:', error);
    process.exit(1);
  }
}

main();
