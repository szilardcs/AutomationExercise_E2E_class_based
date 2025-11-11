import { test, expect } from "../fixtures/pomManager.fixture";

test.describe("Subscription", async () => {
	test.beforeEach("Navigate to page", async ({ pomManager }) => {
		await pomManager.home.goToHomePageAndAssert();
	});

	test("Test Case 10: Verify Subscription in home page", async ({ pomManager }) => {
		await test.step("Scroll to footer and verify subscription section", async () => {
			await pomManager.home.scrollDownAndVerifyText();
		});

		await test.step("Submit email subscription", async () => {
			await pomManager.home.enterEmailAndSubmit();
			await pomManager.home.verifySubSuccess();
		});
	});

	test("Test Case 11: Verify Subscription in Cart page", async ({ pomManager }) => {
		await test.step("Navigate to cart page", async () => {
			await pomManager.header.clickCartButton();
		});

		await test.step("Scroll to footer and verify subscription section", async () => {
			await pomManager.cart.scrollDownAndVerifyText();
		});

		await test.step("Submit email subscription", async () => {
			await pomManager.cart.enterEmailAndSubmit();
			await pomManager.cart.verifySubSuccess();
		});
	});
});
