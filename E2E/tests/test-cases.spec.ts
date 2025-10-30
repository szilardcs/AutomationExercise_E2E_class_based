import { test } from "../fixtures/pomManager.fixture";

test.describe("Test cases page", async () => {
	test.beforeEach("Navigate to page", async ({ pomManager }) => {
		await pomManager.home.goToHomePageAndAssert();
	});

	test("Test Case 7: Verify Test Cases Page", async ({ pomManager }) => {
		await test.step("Click on 'Test Cases' button", async () => {
			await pomManager.header.clickTestCasesButton();
		});
		await test.step("Verify user is navigated to test cases page successfully", async () => {
			await pomManager.testCases.assertHeadingAndPage();
		});
	});
});
