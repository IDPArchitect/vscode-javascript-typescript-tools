# Tools for JavaScript/TypeScript

![Project Logo](https://avatars.githubusercontent.com/u/174181162?s=400&u=95940866f72e881605f950e6de3f040a2234c43c&v=4)

## Description

**Tools for JavaScript/TypeScript** is a Visual Studio Code extension that automatically sets up essential development tools for JavaScript and TypeScript projects. It streamlines the configuration of linters, formatters, and Git hooks to enforce code quality and consistency across your projects.

**Warning** So far this has only been tested on Linux and MacOS.

## Features

- **ESLint Integration**: Configures ESLint with TypeScript support to enforce coding standards and detect errors.
- **Prettier Formatting**: Sets up Prettier for consistent code formatting.
- **Husky Git Hooks**: Automates Git hooks for pre-commit checks and commit message validation.
- **Commitlint**: Ensures commit messages follow the Conventional Commits specification.
- **Lint-Staged**: Runs linters on staged Git files before committing.
- **VSCode Workspace Settings**: Optimizes VSCode settings for a better development experience.

## Installation

1. **Install the Extension:**

   - Download the latest `.vsix` file from the [Releases](https://marketplace.visualstudio.com/items?itemName=IDPArchitect.tools-for-javascript-typescript) page.
   - In VSCode, go to **Extensions** (`Ctrl+Shift+X`), click on the **Ellipsis Menu** (`...`), and select **Install from VSIX...**.
   - Choose the downloaded `.vsix` file.

2. **From the VSCode Marketplace:**

   - **(If published)** Install directly from the VSCode Marketplace by searching for **"Tools for JavaScript/TypeScript"**.

## Usage

1. **Open Your Project in VSCode.**

   - Make sure you have node and npm/npx working before you run this.
   - Most people setup nvm.

2. **Run the Extension Command:**

   - Press `Ctrl+Shift+P` to open the Command Palette.
   - Type **"Tools for JavaScript/TypeScript"** and select it.

3. **Follow the Prompts:**

   - The extension will guide you through setting up the development environment, including installing and configuring necessary tools.

4. **Create Two Files:**

   - Create two files, one test.js and one test.ts. Inside the files add some test code. It could be as simple as console.log('Hello World');

5. **Stage the files and create a commit message:**

   - git add test.js and test.ts
   - git commit -m "fix(vsix): added image for vscode extension package and added a few instructions on how to update extension"

6. **Watch to make sure the tools run:**

   - You should see prettier and eslint running on staged files with commitlint checking your commit message.
   - You can tweak the command that runs by going to the package.json and looking at the key lint-staged. This might be an easy place to fix for windows users.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear messages.
4. Push to your fork and open a Pull Request.

For detailed guidelines, refer to [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)

## Author

[James Knott](https://github.com/IDPArchitect)
