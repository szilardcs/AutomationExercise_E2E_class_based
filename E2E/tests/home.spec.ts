import { test } from "../fixtures/pomManager.fixture";

test.describe("Home page tests", async () => {
	test.beforeEach("Navigate to page", async ({ pomManager }) => {
		await pomManager.home.goToHomePageAndAssert();
	});

	test("Test Case 25: Verify Scroll Up using 'Arrow' button and Scroll Down", async ({ pomManager }) => {
		await test.step("Scroll down and verify subscription text", async () => {
			await pomManager.home.scrollDownAndVerifyText();
		});

		await test.step("Scroll up using arrow button and verify top text", async () => {
			await pomManager.home.scrollToTopWithArrow();
			await pomManager.home.verifyFullFledgedText();
		});
	});

	test("Test Case 26: Verify Scroll Up without 'Arrow' button and Scroll Down", async ({ pomManager }) => {
		await test.step("Scroll down and verify subscription text", async () => {
			await pomManager.home.scrollDownAndVerifyText();
		});

		await test.step("Scroll up manually and verify top text", async () => {
			await pomManager.home.scrollToTop();
			await pomManager.home.verifyFullFledgedText();
		});
	});
});
