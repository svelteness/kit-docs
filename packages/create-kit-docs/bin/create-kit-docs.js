#!/usr/bin/env node

// @ts-check

import { spawn } from 'child_process';
import enquirer from 'enquirer';
import fs, { rmSync } from 'fs';
import kleur from 'kleur';
import minimist from 'minimist';
import path from 'upath';
import { fileURLToPath } from 'url';

const __cwd = process.cwd();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __pkg = path.resolve(__dirname, '../package.json');

const argv = minimist(process.argv.slice(2), { string: ['_'] });

async function main() {
  const rootDirName = argv._[0];

  if (!rootDirName) {
    const { ok } = await useCurrentDirPrompt();
    if (!ok) return;
  }

  let targetDir = path.resolve(__cwd, rootDirName ?? '');

  const version = JSON.parse(fs.readFileSync(__pkg).toString()).version;

  if (rootDirName) console.log();
  const { ok: defaultTheme } = await defaultThemePrompt();

  const isTargetDirEmpty = isDirEmpty(targetDir);

  if (isTargetDirEmpty) {
    console.log(`\n[kit-docs]: target directory is empty, creating new SvelteKit app.\n`);

    try {
      const child = spawn('npm', ['create', 'svelte', rootDirName ?? '.'], {
        stdio: 'inherit',
        shell: true,
      });

      await new Promise((resolve, reject) => {
        child.on('close', resolve);
        child.on('error', reject);
        child.on('exit', (exitCode) => {
          if (exitCode !== 0) reject();
        });
      });
    } catch (e) {
      console.log(kleur.bold(kleur.red(`\n[kit-docs]: failed to create new app.`)));
      console.log(`\n\n${e}\n`);
      return;
    }

    await rmSync(path.resolve(targetDir, 'src/routes/index.svelte'));
  }

  if (!validateDirectory(targetDir)) {
    return;
  }

  /** @type {RegExp[]} */
  let overwrite = [/svelte\.config\.js/, /vite\.config\.js/, /src\/routes\//];

  if (!isTargetDirEmpty) {
    /** @type {{ ok: boolean }} */
    const { ok: svelteConfig } = await enquirer.prompt({
      type: 'confirm',
      name: 'ok',
      message: `Overwrite \`svelte.config.js\`?`,
      initial: false,
    });

    /** @type {{ ok: boolean }} */
    const { ok: viteConfig } = await enquirer.prompt({
      type: 'confirm',
      name: 'ok',
      message: `Overwrite \`vite.config.js\`?`,
      initial: false,
    });

    /** @type {{ ok: boolean }} */
    const { ok: routes } = await enquirer.prompt({
      type: 'confirm',
      name: 'ok',
      message: `Overwrite files if needed in \`routes/\` directory?`,
      initial: false,
    });

    overwrite = /** @type {RegExp[]} */ (
      [
        svelteConfig && /svelte\.config\.js/,
        viteConfig && /vite\.config\.js/,
        routes && /src\/routes\//,
      ].filter(Boolean)
    );
  }

  const pkgPath = path.resolve(targetDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath).toString());

  const deps = {
    '@iconify-json/ri': '^1.1.1',
    '@sveltejs/adapter-auto': '^1.0.0-next.57',
    '@sveltejs/kit': '^1.0.0-next.370',
    '@svelteness/kit-docs': `^${version}`,
    clsx: '^1.1.0',
    'unplugin-icons': '^0.13.0',
    shiki: '^0.10.0',
    svelte: '^3.49.0',
  };

  if (!pkg.devDependencies) {
    pkg.devDependencies = {};
  }

  // Add deps.
  for (const dep of Object.keys(deps)) {
    if (!pkg.dependencies?.[dep] && !pkg.devDependencies[dep]) {
      pkg.devDependencies[dep] = deps[dep];
    }
  }

  // Sort deps.
  const sortedDeps = {};
  for (const dep of Object.keys(pkg.devDependencies).sort()) {
    sortedDeps[dep] = pkg.devDependencies[dep];
  }
  pkg.devDependencies = sortedDeps;

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

  const baseTemplateDir = path.resolve(__dirname, '../template-base');

  copyDir(baseTemplateDir, targetDir, { overwrite });

  if (defaultTheme) {
    const themeTemplateDir = path.resolve(__dirname, '../template-theme');
    copyDir(themeTemplateDir, targetDir, { overwrite });
  }

  const appDTSPath = path.resolve(targetDir, 'src/app.d.ts');
  const appDTSContent = fs.readFileSync(appDTSPath).toString();

  if (!/@svelteness\/kit-docs\/globals/.test(appDTSContent)) {
    fs.writeFileSync(
      appDTSPath,
      appDTSContent.replace(/\n/, `\n/// <reference types="@svelteness/kit-docs/globals" />\n`),
    );
  }

  if (defaultTheme) {
    const appHTMLPath = path.resolve(targetDir, 'src/app.html');

    const colorSchemeScript = `
    <script>
      const key = 'svelteness::color-scheme';
      const scheme = localStorage[key];
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (scheme === 'dark' || (scheme !== 'light' && prefersDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    </script>
  `;

    const fileContent = fs.readFileSync(appHTMLPath).toString();

    if (!/svelteness::color-scheme/.test(fileContent)) {
      fs.writeFileSync(
        appHTMLPath,
        fileContent.replace(/%sveltekit.head%/, `${colorSchemeScript}\n    %sveltekit.head%`),
      );
    }
  }

  if (!isTargetDirEmpty && overwrite.length !== 2) {
    console.log(
      kleur.bold(
        kleur.cyan(
          `\n[kit-docs]: You will need to refer to the following manual install guides to finish setup:\n`,
        ),
      ),
    );
    console.log(
      `\nhttps://kit-docs.svelteness.dev/docs/getting-started/quickstart#manual-installation`,
    );
    if (defaultTheme) {
      console.log(
        `\nhttps://kit-docs.svelteness.dev/docs/default-layout/installation#manual-installation`,
      );
    }
  }

  console.log();
}

/**
 * @param {string} targetDir
 * @returns {boolean}
 */
function validateDirectory(targetDir) {
  const requiredFiles = ['package.json', 'src/app.d.ts', 'src/app.html'];

  for (const file of requiredFiles) {
    const filePath = path.resolve(targetDir, 'package.json');
    if (!fs.existsSync(filePath)) {
      console.log(kleur.bold(kleur.red(`\n[kit-docs]: setup failed!`)));
      console.log(`\nInvalid project directory, file is missing (${file}).\n`);
      return false;
    }
  }

  return true;
}

/**
 * @returns {Promise<{ ok: boolean }>}
 */
function useCurrentDirPrompt() {
  console.log(kleur.bold(kleur.cyan(`\n[kit-docs]: No directory was provided.\n`)));

  return enquirer.prompt({
    type: 'confirm',
    name: 'ok',
    message: `Use current directory (${process.cwd()})?`,
    initial: false,
  });
}

/**
 * @returns {Promise<{ ok: boolean }>}
 */
function defaultThemePrompt() {
  return enquirer.prompt({
    type: 'confirm',
    name: 'ok',
    message: `Default KitDocs Theme?`,
    initial: true,
  });
}

/**
 * @param {string} path
 * @returns {boolean}
 */
function isDirEmpty(path) {
  if (!fs.existsSync(path)) {
    return true;
  }

  return fs.readdirSync(path).length === 0;
}

/**
 * @param {string} src
 * @param {string} dest
 * @param {{ overwrite: RegExp[]}} options
 */
function copyDir(src, dest, { overwrite }) {
  const filePaths = readDirDeepSync(src);

  for (const filePath of filePaths) {
    const destPath = path.resolve(dest, path.relative(src, filePath));
    const destDir = path.dirname(destPath);

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    if (!fs.existsSync(destPath) || overwrite.some((o) => o.test(destPath))) {
      fs.writeFileSync(destPath, fs.readFileSync(filePath));
    }
  }
}

function emptyDir(dir) {
  if (!fs.existsSync(dir)) return;

  for (const file of fs.readdirSync(dir)) {
    const filePath = path.resolve(dir, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      fs.rmSync(filePath, { recursive: true });
    } else {
      fs.unlinkSync(filePath);
    }
  }
}

/**
 * @param {string} dir
 * @returns {string[]}
 */
function readDirDeepSync(dir) {
  /** @type {string[]} */
  const files = [];

  for (const file of fs.readdirSync(dir)) {
    const filePath = path.resolve(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      files.push(...readDirDeepSync(filePath));
    } else {
      files.push(filePath);
    }
  }

  return files;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
