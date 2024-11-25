
# Velixo Playwright/TypeScript Automation Project

This project is a Playwright/TypeScript automation framework for validating functionalities in Excel Online. The primary goal is to create, execute, and validate test cases efficiently, leveraging modern test automation practices.

## Project Architecture

The project is organized as follows:

```
Velixo/
├── config/
│   └── config.ts                # Configuration settings like URLs and credentials
├── locators/
│   ├── excelLocators.ts         # Locators for interacting with Excel Online elements
│   ├── loginLocators.ts         # Locators for handling login-related elements
├── src/
│   ├── pages/
│   │   ├── ExcelPage.ts         # Page Object Model (POM) for Excel functionalities
│   │   ├── LoginPage.ts         # POM for handling login functionality
│   ├── utils/
│       └── actions.ts           # Utility methods for reusable actions
├── tests/
│   └── excel-today-function.spec.ts # Test script for validating the `=TODAY()` function in Excel Online
├── tests-examples/              # Example test scripts (if applicable)
├── playwright-report/           # Playwright test reports (HTML format)
├── test-results/                # Output folder for test results
├── .gitignore                   # Git ignore rules
├── package.json                 # Project dependencies and scripts
├── package-lock.json            # Dependency lock file
├── playwright.config.ts         # Playwright configuration file
```

## Features

- **Modular Design**: Uses Page Object Model (POM) for better reusability and maintainability.
- **Utility Methods**: Common actions like element visibility checks, form filling, and clicking are abstracted into reusable functions.
- **Playwright Reporting**: HTML-based test reports for enhanced test execution insights.
- **Extensibility**: Easy to add new pages, tests, and utilities as needed.

## Prerequisites

Make sure you have the following installed:

- [Node.js (v18 or later)](https://nodejs.org/)
- [npm (Node Package Manager)](https://www.npmjs.com/)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd Velixo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Configuration

Update the configuration file `config/config.ts` with appropriate values:

```typescript
export const config = {
  credentials: {
    username: 'your-username',
    password: 'your-password',
  },
  urls: {
    excelOnline: 'https://excel.office.com',
  },
};
```

## Running Tests

1. To execute all tests:

   ```bash
   npx playwright test
   ```

2. To run a specific test (e.g., `excel-today-function.spec.ts`):

   ```bash
   npx playwright test tests/excel-today-function.spec.ts
   ```

3. To view the HTML report after running tests:

   ```bash
   npx playwright show-report
   ```

## Playwright Configuration

The `playwright.config.ts` file includes the following configurations:

- Test directory: `tests/`
- Retries: Configured for test reliability
- Timeout: 30 seconds per test
- Browser projects: Supports Chromium, Firefox, and WebKit

Example snippet:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  retries: 2,
  timeout: 30000,
  use: {
    headless: true,
  },
  projects: [
    { name: 'Chromium', use: { browserName: 'chromium' } },
    { name: 'Firefox', use: { browserName: 'firefox' } },
    { name: 'WebKit', use: { browserName: 'webkit' } },
  ],
});
```

## Folder Structure Details

- **`config/`**: Stores environment-specific configurations, such as URLs and credentials.
- **`locators/`**: Contains all locators for page elements, improving maintainability and readability.
- **`src/pages/`**: Implements the Page Object Model (POM) for better code reuse.
- **`utils/`**: Includes helper functions to simplify and standardize common actions like clicking and typing.
- **`tests/`**: Contains the actual test scripts written in TypeScript.

## Key Functionalities

### Login

The `LoginPage.ts` handles login functionalities, including:

- Navigating to the login page
- Handling the "Stay signed in?" prompt
- Validating the login process

### Excel Actions

The `ExcelPage.ts` contains functions to:

- Create a new blank workbook
- Input formulas into specific cells
- Retrieve cell data for validation
- Handle pop-up notifications

## Example Test Case

**Test: Validate `=TODAY()` Function**

The test verifies that the `=TODAY()` formula in Excel Online produces the current date.

Steps:

1. Log into Excel Online using valid credentials.
2. Create a new blank workbook.
3. Input the `=TODAY()` formula into cell `A2`.
4. Validate that the cell's value matches the current date.

Run the test with:

```bash
npx playwright test tests/excel-today-function.spec.ts
```

## Reporting

After running tests, view the report:

```bash
npx playwright show-report
```

Reports are stored in the `playwright-report/` folder.

## Contributing

1. Fork the repository.
2. Create a new branch (`feature/new-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
