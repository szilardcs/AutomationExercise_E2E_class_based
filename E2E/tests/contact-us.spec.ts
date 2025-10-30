import { test } from "../fixtures/pomManager.fixture";

test.describe("Contact us tests", () => {
	test.beforeEach("Navigate to page", async ({ pomManager }) => {
		await pomManager.home.goToHomePageAndAssert();
	});

	test("Test Case 6: Contact Us Form", async ({ pomManager }) => {
		await test.step("Navigate to contact us page", async () => {
			await pomManager.header.clickContactUsButton();
			await pomManager.contactUs.assertPageAndText();
		});

		await test.step("Fill contact form with details", async () => {
			await pomManager.contactUs.fillContactFields();
			await pomManager.contactUs.uploadFile();
		});

		await test.step("Submit form and verify success", async () => {
			await pomManager.contactUs.submitAndHandlePopup();
			await pomManager.contactUs.assertSuccessMessage();
		});

		await test.step("Return to home page", async () => {
			await pomManager.contactUs.clickHomeButtonAndAssertHome();
		});
	});
});
