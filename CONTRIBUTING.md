# Contributing to VSCode JavaScript/TypeScript Tools

First off, **thank you for considering contributing to VSCode JavaScript/TypeScript Tools**! Your efforts help make this project better for everyone.

The following guidelines outline how you can contribute to this repository. By participating, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Table of Contents


- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Style Guide](#style-guide)
  - [Code Style](#code-style)
  - [Commit Messages](#commit-messages)
- [Development Setup](#development-setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Extension Locally](#running-the-extension-locally)
- [Testing](#testing)
- [License](#license)

## How Can I Contribute?

### Reporting Bugs

If you find a bug in the extension, please [open an issue](https://github.com/IDPArchitect/vscode-javascript-typescript-tools/issues/new/choose) with the following information:

- **Description:** A clear and concise description of what the bug is.
- **Steps to Reproduce:** Steps that someone else can follow to reproduce the bug.
- **Expected Behavior:** What you expected to happen.
- **Actual Behavior:** What actually happened.
- **Screenshots:** If applicable, add screenshots to help explain your problem.
- **Environment:** Information about your VSCode version, operating system, and any other relevant details.

### Suggesting Enhancements

Have an idea to improve the extension? [Open an issue](https://github.com/IDPArchitect/vscode-javascript-typescript-tools/issues/new/choose) to discuss it. Please include:

- **Description:** A clear and concise description of the enhancement.
- **Motivation:** Why is this enhancement important?
- **Possible Implementation:** Any ideas on how to implement this.

### Pull Requests

Pull requests are welcome! Here's how to make a great contribution:

1. **Fork the Repository:** Click the **Fork** button at the top-right of the repository page.

2. **Clone Your Fork:**

   ```bash
   git clone https://github.com/your-username/vscode-javascript-typescript-tools.git
   cd vscode-javascript-typescript-tools
   ```

3. **Create a New Branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes:** Ensure your code follows the [Style Guide](#style-guide).

5. **Run Tests:** Ensure all tests pass.

6. **Commit Your Changes:**

   ```bash
   git commit -m "feat: add feature description"
   ```

7. **Push to Your Fork:**

   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request:** Navigate to the original repository and click **Compare & pull request**.

**Pull Request Checklist:**

- [ ] My code follows the project's style guidelines.
- [ ] I have performed a self-review of my own code.
- [ ] I have commented my code where necessary.
- [ ] I have made corresponding changes to the documentation.
- [ ] My changes generate no new warnings.
- [ ] I have added tests that prove my fix is effective or that my feature works.
- [ ] All new and existing tests pass.
- [ ] Any dependent changes have been merged and published in downstream modules.

## Style Guide

### Code Style

- **Language:** TypeScript
- **Formatting:** Follows the [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) configurations defined in the project.
- **Naming Conventions:** Use `camelCase` for variables and functions, `PascalCase` for classes and interfaces.
- **Documentation:** Use JSDoc comments for functions, classes, and modules.

### Commit Messages

- **Format:** Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
- **Structure:**

  ```
  <type>[optional scope]: <description>

  [optional body]

  [optional footer]
  ```

- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

**Example:**

```
feat: add .gitignore creation functionality

Added a new function to automatically create a .gitignore file with standard Node.js exclusions.
```

## Development Setup

### Prerequisites

- **Node.js:** v14 or later
- **npm:** v6 or later
- **VSCode:** Latest version recommended

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/IDPArchitect/vscode-javascript-typescript-tools.git
   cd vscode-javascript-typescript-tools
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

### Running the Extension Locally

1. **Open the Project in VSCode:**

   ```bash
   code .
   ```

2. **Launch the Extension Development Host:**

   - Press `F5` or go to **Run > Start Debugging**.
   - A new VSCode window (**Extension Development Host**) will open.

3. **Test the Extension:**

   - In the Extension Development Host window, open the **Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
   - Run **"Tools: Setup Development Tools for Javascript and Typescript"**.
   - Verify that the extension performs as expected.

## Testing

- **Run Tests Locally:**

  ```bash
  npm test
  ```

- **Add New Tests:** When adding new features or fixing bugs, include relevant tests to ensure functionality and prevent regressions.

## License

This project is [MIT](LICENSE) licensed.
