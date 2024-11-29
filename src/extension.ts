import * as vscode from 'vscode';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('tools.setupTools', () => {
    setupDevelopmentTools();
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}

function setupDevelopmentTools() {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders) {
    vscode.window.showErrorMessage('Please open a workspace folder to use this command.');
    return;
  }

  const rootPath = workspaceFolders[0].uri.fsPath;

  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Setting up development environment...',
      cancellable: false,
    },
    () => {
      return new Promise<void>((resolve) => {
        initializeProject(rootPath)
          .then(() => installDevelopmentTools(rootPath))
          .then(() => setupConfigurations(rootPath))
          .then(() => createGitignore(rootPath))
          .then(() => initializeHusky(rootPath))
          .then(() => setupVSCodeSettings(rootPath))
          .then(() => {
            vscode.window.showInformationMessage('Development environment setup complete!');
            resolve();
          })
          .catch((error) => {
            vscode.window.showErrorMessage(`Error: ${error.message}`);
            console.error('Setup error:', error);
            resolve();
          });
      });
    }
  );
}

function initializeProject(rootPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if package.json exists
    const packageJsonPath = path.join(rootPath, 'package.json');
    const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

    const tasks: Array<Promise<void>> = [];

    if (!fs.existsSync(packageJsonPath)) {
      // Run npm init -y
      tasks.push(
        new Promise((res, rej) => {
          const npmInit = spawn(npmCommand, ['init', '-y'], { cwd: rootPath, shell: true });

          npmInit.stdout.on('data', (data) => {
            console.log(`npm init stdout: ${data}`);
          });

          npmInit.stderr.on('data', (data) => {
            console.error(`npm init stderr: ${data}`);
          });

          npmInit.on('error', (error) => {
            rej(new Error(`Error running npm init: ${error.message}`));
          });

          npmInit.on('close', (code) => {
            if (code !== 0) {
              rej(new Error(`npm init exited with code ${code}`));
            } else {
              res();
            }
          });
        })
      );
    }

    // Check if .git directory exists
    const gitDir = path.join(rootPath, '.git');
    if (!fs.existsSync(gitDir)) {
      // Run git init
      tasks.push(
        new Promise((res, rej) => {
          const gitCommand = process.platform === 'win32' ? 'git.exe' : 'git';
          const gitInit = spawn(gitCommand, ['init'], { cwd: rootPath, shell: true });
          const gitRenameBranch = spawn(gitCommand, ['branch', '-M', 'main'], { cwd: rootPath, shell: true });
          const fs = require('fs');
          const readmePath = path.join(rootPath, 'README.md');
              fs.writeFileSync(readmePath, '# Project Title\n\nProject description goes here.');
          const gitAdd = spawn(gitCommand, ['add', 'README.md'], { cwd: rootPath, shell: true });
          const gitCommit = spawn(gitCommand, ['commit', '-m', 'chore: initial commit'], { cwd: rootPath, shell: true });

          gitInit.stdout.on('data', (data) => {
            console.log(`git init stdout: ${data}`);
          });

          gitInit.stderr.on('data', (data) => {
            console.error(`git init stderr: ${data}`);
          });

          gitInit.on('error', (error) => {
            rej(new Error(`Error running git init: ${error.message}`));
          });

          gitInit.on('close', (code) => {
            if (code !== 0) {
              rej(new Error(`git init exited with code ${code}`));
            } else {
              res();
            }
          });
        })
      );
    }

    Promise.all(tasks)
      .then(() => resolve())
      .catch((error) => reject(error));
  });
}


function installDevelopmentTools(rootPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let packageJson: any;
    try {
      packageJson = JSON.parse(fs.readFileSync(path.join(rootPath, 'package.json'), 'utf8'));
    } catch (error) {
      reject(new Error('Error reading package.json.'));
      return;
    }

    // List of tools to install with versions
    const tools = [
      'husky@8.0.0',
      '@commitlint/cli@17.6.7',
      '@commitlint/config-conventional@17.6.7',
      'prettier@2.8.8',
      'lint-staged@13.2.2',
      'eslint@9.0.0',
      '@typescript-eslint/parser@8.10.0',
      '@typescript-eslint/eslint-plugin@8.10.0',
      'eslint-plugin-prettier@4.2.1',
      'eslint-plugin-import@2.31.0',
      'eslint-plugin-unicorn@48.0.0',
      'eslint-import-resolver-typescript@3.6.3',
    ];

    // Function to extract package name from tool@version
    function getPackageName(toolWithVersion: string): string {
      if (toolWithVersion.startsWith('@')) {
        // Scoped package
        const firstAtIndex = toolWithVersion.indexOf('@', 1);
        if (firstAtIndex !== -1) {
          return toolWithVersion.substring(0, firstAtIndex);
        } else {
          return toolWithVersion; // No version specified
        }
      } else {
        // Unscoped package
        const atIndex = toolWithVersion.indexOf('@');
        if (atIndex !== -1) {
          return toolWithVersion.substring(0, atIndex);
        } else {
          return toolWithVersion; // No version specified
        }
      }
    }

    // Determine which tools need to be installed
    const toolsToInstall = tools.filter((toolWithVersion) => {
      const packageName = getPackageName(toolWithVersion);
      const installedVersion = packageJson.devDependencies?.[packageName];
      // If the package is not installed or the version differs, install it
      return !installedVersion || !installedVersion.includes(toolWithVersion.split('@').pop()!);
    });

    // If you want to always install the specified versions, uncomment the following line:
    // const toolsToInstall = tools;

    const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const installArgs = ['install', '--save-dev', ...toolsToInstall];
    const installProcess = spawn(npmCommand, installArgs, {
      cwd: rootPath,
      shell: true,
    });

    installProcess.stdout.on('data', (data) => {
      console.log(`npm install stdout: ${data}`);
    });

    installProcess.stderr.on('data', (data) => {
      console.error(`npm install stderr: ${data}`);
    });

    installProcess.on('error', (error) => {
      reject(new Error(`Error installing tools: ${error.message}`));
    });

    installProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`npm install process exited with code ${code}`));
      } else {
        vscode.window.showInformationMessage('Development tools installed successfully!');
        resolve();
      }
    });
  });
}

function createGitignore(rootPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('Creating .gitignore file...');
    const gitignorePath = path.join(rootPath, '.gitignore');

    if (fs.existsSync(gitignorePath)) {
      console.log('.gitignore already exists.');
      resolve();
      return;
    }

    const gitignoreContent = `
# Node.js dependencies
node_modules/

# Logs
logs
*.log
npm-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output/

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components/

# Editor directories and files
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test
.env.production

# Next.js build output
.next/

# Nuxt.js build / generate output
.nuxt/

# Gatsby files
.cache/
public

# Vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port
    `;

    try {
      fs.writeFileSync(gitignorePath, gitignoreContent.trim());
      console.log('.gitignore created successfully.');
      vscode.window.showInformationMessage('.gitignore file created successfully!');
      resolve();
    } catch (error: any) {
      reject(new Error(`Error creating .gitignore: ${error.message}`));
    }
  });
}

function setupConfigurations(rootPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const packageJsonPath = path.join(rootPath, 'package.json');
    let packageJson: any;
    try {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    } catch (error) {
      reject(new Error('Error reading package.json.'));
      return;
    }

    // Remove "type": "module" if it exists
    if (packageJson.type) {
      delete packageJson.type;
      try {
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      } catch (error) {
        reject(new Error('Error updating package.json.'));
        return;
      }
    }

    // Create .prettierrc if it doesn't exist
    const prettierConfigPath = path.join(rootPath, '.prettierrc');
    if (!fs.existsSync(prettierConfigPath)) {
      try {
        fs.writeFileSync(
          prettierConfigPath,
          JSON.stringify({ semi: true, singleQuote: true }, null, 2)
        );
      } catch (error) {
        reject(new Error('Error creating .prettierrc.'));
        return;
      }
    }

    // Create commitlint.config.js using CommonJS syntax
    const commitlintConfigPath = path.join(rootPath, 'commitlint.config.js');
    if (!fs.existsSync(commitlintConfigPath)) {
      try {
        fs.writeFileSync(
          commitlintConfigPath,
          "module.exports = { extends: ['@commitlint/config-conventional'] };"
        );
      } catch (error) {
        reject(new Error('Error creating commitlint.config.js.'));
        return;
      }
    }

    // Remove old husky config if present
    if (packageJson.husky) {
      delete packageJson.husky;
    }

    // Update lint-staged configuration
    packageJson['lint-staged'] = packageJson['lint-staged'] || {
      '*.{js,ts}': ['npx prettier --write', 'npx eslint --fix --config eslint.config.mjs'],
    };

    // Write back package.json
    try {
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    } catch (error) {
      reject(new Error('Error updating package.json.'));
      return;
    }

    // Create ESLint config using CommonJS syntax
    const eslintConfigPath = path.join(rootPath, 'eslint.config.mjs');
    if (!fs.existsSync(eslintConfigPath)) {
      const eslintConfigContent = `
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptEslintParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  {
    ignores: ["out/**", "node_modules/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: typescriptEslintParser,
      ecmaVersion: 2022,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
      "import": importPlugin,
      "prettier": prettierPlugin,
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"]
      },
      "import/resolver": {
        "typescript": true,
        "node": {
          "extensions": [".js", ".jsx", ".ts", ".tsx", ".json"]
        }
      }
    },
    rules: {
      // Recommended rules from @typescript-eslint/eslint-plugin
      ...typescriptEslintPlugin.configs.recommended.rules,

      // Recommended rules from eslint-plugin-import
      ...importPlugin.configs.recommended.rules,

      // Prettier integration
      "prettier/prettier": "error",
      "endOfLine": ["off","auto"],
      // Custom rules
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "import",
          format: ["camelCase", "PascalCase"],
        },
      ],
      "curly": ["warn", "multi-line"],
      "eqeqeq": ["warn", "always"],
      "no-throw-literal": "warn",
      "semi": "warn",
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          "js": "never",
          "mjs": "never",
          "jsx": "never",
          "ts": "never",
          "tsx": "never"
        }
      ]
    },
  },
];
`;
      try {
        fs.writeFileSync(eslintConfigPath, eslintConfigContent.trim());
      } catch (error) {
        reject(new Error('Error creating eslint.config.mjs.'));
        return;
      }
    }

    vscode.window.showInformationMessage('Configuration files created successfully!');
    resolve();
  });
}

function initializeHusky(rootPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const npmCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const huskyInstall = spawn(npmCommand, ['husky', 'install'], {
      cwd: rootPath,
      shell: true,
    });

    huskyInstall.stdout.on('data', (data) => {
      console.log(`husky install stdout: ${data}`);
    });

    huskyInstall.stderr.on('data', (data) => {
      console.error(`husky install stderr: ${data}`);
    });

    huskyInstall.on('error', (error) => {
      reject(new Error(`Error initializing Husky: ${error.message}`));
    });

    huskyInstall.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`husky install exited with code ${code}`));
        return;
      }

      const huskyDir = path.join(rootPath, '.husky');
      const huskyScriptsDir = path.join(huskyDir, '_');

      // Ensure the .husky/_ directory exists
      if (!fs.existsSync(huskyScriptsDir)) {
        try {
          fs.mkdirSync(huskyScriptsDir, { recursive: true });
        } catch (error) {
          reject(new Error('Error creating .husky/_ directory.'));
          return;
        }
      }

      // Create pre-commit script in .husky/_
      const preCommitScriptPath = path.join(huskyScriptsDir, 'pre-commit');
      const preCommitScriptContent = `#!/usr/bin/env bash

npx lint-staged
npx prettier $(git diff --cached --name-only --diff-filter=ACMR | sed 's| |\\\\ |g') --write --ignore-unknown
git update-index --again
`;
      try {
        fs.writeFileSync(preCommitScriptPath, preCommitScriptContent);
        fs.chmodSync(preCommitScriptPath, '755');
      } catch (error) {
        reject(new Error('Error creating pre-commit script in .husky/_/.'));
        return;
      }

      // Create pre-commit hook in .husky/
      const preCommitHookPath = path.join(huskyDir, 'pre-commit');
      const preCommitHookContent = `#!/usr/bin/env bash

. "$(dirname "$0")/_/husky.sh"

sh "$(dirname "$0")/_/pre-commit"
`;
      try {
        fs.writeFileSync(preCommitHookPath, preCommitHookContent);
        fs.chmodSync(preCommitHookPath, '755');
      } catch (error) {
        reject(new Error('Error creating pre-commit hook in .husky/.'));
        return;
      }

      // Create commit-msg script in .husky/_
      const commitMsgScriptPath = path.join(huskyScriptsDir, 'commit-msg');
      const commitMsgScriptContent = `#!/usr/bin/env bash

npx --no -- commitlint --edit "$1"
`;
      try {
        fs.writeFileSync(commitMsgScriptPath, commitMsgScriptContent);
        fs.chmodSync(commitMsgScriptPath, '755');
      } catch (error) {
        reject(new Error('Error creating commit-msg script in .husky/_/.'));
        return;
      }

      // Create commit-msg hook in .husky/
      const commitMsgHookPath = path.join(huskyDir, 'commit-msg');
      const commitMsgHookContent = `#!/usr/bin/env bash

. "$(dirname "$0")/_/husky.sh"

sh "$(dirname "$0")/_/commit-msg" "$@"
`;
      try {
        fs.writeFileSync(commitMsgHookPath, commitMsgHookContent);
        fs.chmodSync(commitMsgHookPath, '755');
      } catch (error) {
        reject(new Error('Error creating commit-msg hook in .husky/.'));
        return;
      }

      vscode.window.showInformationMessage(
        'Husky initialized with pre-commit and commit-msg hooks.'
      );
      resolve();
    });
  });
}

function setupVSCodeSettings(rootPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const vscodeDir = path.join(rootPath, '.vscode');
    const settingsPath = path.join(vscodeDir, 'settings.json');

    // Ensure .vscode directory exists
    if (!fs.existsSync(vscodeDir)) {
      try {
        fs.mkdirSync(vscodeDir);
      } catch (error) {
        reject(new Error('Error creating .vscode directory.'));
        return;
      }
    }

    // Default settings to add or update
    const newSettings = {
      'editor.formatOnSave': true,
      'editor.codeActionsOnSave': {
        'source.fixAll.eslint': true,
      },
      'files.eol': '\n',
      'files.insertFinalNewline': true,
      'files.trimTrailingWhitespace': true,
      'eslint.validate': ['javascript', 'javascriptreact', 'typescript', 'typescriptreact'],
    };

    // Read existing settings.json if it exists
    let existingSettings: { [key: string]: any } = {};
    if (fs.existsSync(settingsPath)) {
      try {
        const settingsContent = fs.readFileSync(settingsPath, 'utf8');
        existingSettings = JSON.parse(settingsContent);
      } catch (error) {
        reject(new Error('Error reading existing VSCode settings.'));
        return;
      }
    }

    // Merge existing settings with new settings
    const mergedSettings = {
      ...existingSettings,
      ...newSettings,
      // Merge nested objects like 'editor.codeActionsOnSave'
      'editor.codeActionsOnSave': {
        ...(existingSettings['editor.codeActionsOnSave'] || {}),
        ...newSettings['editor.codeActionsOnSave'],
      },
    };

    // Write updated settings back to settings.json
    try {
      fs.writeFileSync(settingsPath, JSON.stringify(mergedSettings, null, 2));
      vscode.window.showInformationMessage('VSCode workspace settings updated successfully!');
      resolve();
    } catch (error) {
      reject(new Error('Error writing VSCode settings.'));
    }
  });
}

