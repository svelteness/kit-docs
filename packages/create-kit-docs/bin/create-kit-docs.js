#!/usr/bin/env node

// @ts-check

import { spawn } from 'child_process';
import enquirer from 'enquirer';
import fs from 'fs';
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
    console.log(
      kleur.red(
        `\n${kleur.bold('[kit-docs]: missing directory name!')}\n\n${kleur.white(
          `Example: ${kleur.cyan('`npm init @svelteness/kit-docs mydocs`')}`,
        )}\n`,
      ),
    );
    return;
  }

  let targetDir = path.resolve(__cwd, rootDirName);

  if (fs.existsSync(targetDir)) {
    console.log();
    const { overwrite } = await overwritePrompt();
    if (!overwrite) return;
    await emptyDir(targetDir);
  }

  const version = JSON.parse(fs.readFileSync(__pkg).toString()).version;

  console.log();
  const { defaultTheme } = await defaultThemePrompt();

  try {
    const child = spawn('npm', ['init', 'svelte@next', rootDirName], {
      stdio: 'inherit',
    });

    await new Promise((resolve, reject) => {
      child.on('close', resolve);
      child.on('error', reject);
      child.on('exit', (exitCode) => {
        if (exitCode !== 0) reject();
      });
    });
  } catch (e) {
    return;
  }

  const pkgPath = path.resolve(targetDir, 'package.json');

  while (!fs.existsSync(pkgPath));

  const pkg = JSON.parse(fs.readFileSync(pkgPath).toString());

  pkg.devDependencies = {
    '@iconify-json/ri': '^1.1.1',
    '@sveltejs/adapter-auto': 'next',
    '@sveltejs/kit': 'next',
    '@svelteness/kit-docs': `^${version}`,
    clsx: '^1.1.1',
    'unplugin-icons': '^0.13.4',
    svelte: '^3.44.0',
  };

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

  const baseTemplateDir = path.resolve(__dirname, '../template-base');

  copyDir(baseTemplateDir, targetDir);

  if (defaultTheme) {
    const themeTemplateDir = path.resolve(__dirname, '../template-theme');
    copyDir(themeTemplateDir, targetDir);
  }

  const appDTSPath = path.resolve(targetDir, 'src/app.d.ts');
  fs.writeFileSync(
    appDTSPath,
    fs
      .readFileSync(appDTSPath)
      .toString()
      .replace(/\n/, `\n/// <reference types="@svelteness/kit-docs/globals" />\n`),
  );

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

    fs.writeFileSync(
      appHTMLPath,
      fs
        .readFileSync(appHTMLPath)
        .toString()
        .replace(/%svelte.head%/, `${colorSchemeScript}\n    %svelte.head%`),
    );
  }
}

/**
 * @returns {Promise<{ overwrite: boolean }>}
 */
function overwritePrompt() {
  return enquirer.prompt({
    type: 'confirm',
    name: 'overwrite',
    message: `Directory not empty. Destroy?`,
    initial: false,
  });
}

/**
 * @returns {Promise<{ defaultTheme: boolean }>}
 */
function defaultThemePrompt() {
  return enquirer.prompt({
    type: 'confirm',
    name: 'defaultTheme',
    message: `Default KitDocs Theme?`,
    initial: true,
  });
}

/**
 * @param {string} src
 * @param {string} dest
 */
function copyDir(src, dest) {
  const filePaths = readDirDeepSync(src);
  for (const filePath of filePaths) {
    const destPath = path.resolve(dest, path.relative(src, filePath));
    const destDir = path.dirname(destPath);

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.writeFileSync(destPath, fs.readFileSync(filePath));
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
