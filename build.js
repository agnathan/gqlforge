import { build } from 'esbuild';
import { readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isWatch = process.argv.includes('--watch');

const entryPoints = [];
function findEntryPoints(dir) {
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      findEntryPoints(fullPath);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts') && !file.includes('.test.') && !file.includes('.spec.')) {
      entryPoints.push(fullPath);
    }
  }
}

findEntryPoints(join(__dirname, 'src'));

const baseConfig = {
  entryPoints,
  bundle: false,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outdir: 'dist',
  outbase: 'src',
  sourcemap: true,
  minify: false,
  logLevel: 'info',
};

async function buildLibrary() {
  try {
    // Build for ESM
    await build({
      ...baseConfig,
      format: 'esm',
      outExtension: {
        '.js': '.js',
      },
    });

    // Generate type declarations
    const { execSync } = await import('child_process');
    execSync('tsc --emitDeclarationOnly --declaration', { stdio: 'inherit' });

    console.log('✓ Build completed successfully');
  } catch (error) {
    console.error('✗ Build failed:', error);
    process.exit(1);
  }
}

if (isWatch) {
  const ctx = build({
    ...baseConfig,
    format: 'esm',
    outExtension: {
      '.js': '.js',
    },
    watch: {
      onRebuild(error) {
        if (error) {
          console.error('✗ Watch build failed:', error);
        } else {
          console.log('✓ Rebuild completed');
          // Regenerate types
          import('child_process').then(({ execSync }) => {
            try {
              execSync('tsc --emitDeclarationOnly --declaration', { stdio: 'inherit' });
            } catch (err) {
              console.error('Type generation failed:', err);
            }
          });
        }
      },
    },
  });

  console.log('👀 Watching for changes...');
} else {
  buildLibrary();
}

