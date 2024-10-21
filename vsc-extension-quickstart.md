# Tools for JavaScript/TypeScript - Quickstart Guide

## What's in the folder

This extension allows developers to quickly set up a JavaScript/TypeScript development environment with best practices enforced.

## Get up and running straight away

- Press `F5` to open a new window with your extension loaded.
- Run your extension by executing the command **"Tools: Setup Development Tools"** from the Command Palette (`Ctrl+Shift+P`).

## Make changes

- You can relaunch the extension from the debug toolbar after making changes to the files listed above.
- You can also reload (`Ctrl+R` or `Cmd+R` on Mac) the VSCode window with your extension to load your changes.

## Explore the API

Refer to the [VSCode API Reference](https://code.visualstudio.com/api) for more information.

## Run tests

**(If you have tests set up)** Run your tests by executing the `npm test` script.

## Need help?

- Refer to the [VSCode Extension Documentation](https://code.visualstudio.com/api) for guidance.
- Feel free to open an issue on the [GitHub repository](https://github.com/IDPArchitect/vscode-javascript-typescript-tools/issues).


## To build a new version of the plugin

- Remove the out folder 
- Uninstall the current version from vscode so its easier to test.
- Run this command `vsce package --baseContentUrl=https://github.com/IDPArchitect/vscode-javascript-typescript-tools.git`
- You can go to the out folder and select the extension.js file and hit F5 to debug
- You can also just install the plugin to start testing