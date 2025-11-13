# E-Commerce Test Automation with Playwright & TypeScript for the AutomationExercise website

![Playwright Tests](https://github.com/szilardcs/AutomationExercise_E2E_class_based/actions/workflows/playwright.yml/badge.svg)

## Automated test suite for e-commerce workflows using Page Object Model pattern.

-   **Page Object Model** architecture for maintainable tests
-   **Custom pomManager fixture** for clean imports and readability
-   **Faker factories** for realistic test data generation
-   **Complex user journeys**: registration, cart management, checkout flows
-   **TypeScript** for type-safe test development
-   **CI/CD pipeline** running tests on every push

## Quick Start

```bash
# 1 Clone & install
git clone https://github.com/alexusadays/Playwright-POM-TS.git
cd Playwright-POM-TS
npm ci            # Node 18 + recommended

# 2 Run the tests
npx playwright test
```

```
# Project Structure

E2E/
├── assets/ # Test images for testing upload
├── factories/ # Faker test data generation
├── fixtures/ # pomManager and test setup
├── pages/ # Class-based Page Objects
└── tests/ # 26 test cases across features
```

