import { test, expect } from "../fixtures/pomManager.fixture";

test.describe("Signup flows", () => {
	test.beforeEach("Navigate to page", async ({ pomManager }) => {
		await pomManager.home.goToHomePageAndAssert();
	});

	test("Test Case 1: Register user", async ({ pomManager }) => {
		let username: string;

		await test.step("Complete signup form", async () => {
			await pomManager.header.clickSignupLoginButton();
			await pomManager.login.assertSignupText();
			username = await pomManager.login.fillSignupNameAndReturnIt();
			await pomManager.login.fillSignupEmail();
			await pomManager.login.clickSignupButton();
		});

		await test.step("Fill account information", async () => {
			await pomManager.signup.verifyHeader();
			await pomManager.signup.fillAccountInfo();
			await pomManager.signup.checkNewsLetterBox();
			await pomManager.signup.checkSpecialOfferBox();
		});

		await test.step("Fill address information and complete registration", async () => {
			await pomManager.signup.fillAddressInfoAndReturnData();
			await pomManager.signup.clickCreateAccountButton();
		});

		await test.step("Verify account creation and login", async () => {
			await pomManager.accountCreated.verifyCreatedText();
			await pomManager.accountCreated.clickContinueButton();
			await pomManager.header.expectLoggedIn(username);
		});

		await test.step("Clean up - delete account", async () => {
			await pomManager.header.clickDeleteAccountButton();
			await pomManager.accountDeleted.verifyDeletedText();
		});
	});

	test("Test Case 5: Register User with existing email", async ({ pomManager }) => {
		await test.step("Attempt registration with existing email", async () => {
			await pomManager.header.clickSignupLoginButton();
			await pomManager.login.assertSignupText();
			await pomManager.login.fillAlreadyUsedCreds();
			await pomManager.login.clickSignupButton();
		});

		await test.step("Verify registration error", async () => {
			await pomManager.login.assertRegisterErrorMessage();
		});
	});
});

test.describe("Login flows", () => {
	test.beforeEach("Navigate to page", async ({ pomManager }) => {
		await pomManager.home.goToHomePageAndAssert();
	});

	test("Test Case 2: Login User with correct email and password", async ({ pomManager }) => {
		let username: string;

		await test.step("Login with preset credentials", async () => {
			await pomManager.header.clickSignupLoginButton();
			await pomManager.login.assertLoginText();
			username = await pomManager.login.loginWithCredentials();
		});

		await test.step("Verify successful login", async () => {
			await pomManager.header.expectLoggedIn(username);
		});
	});

	test("Test Case 3: Login User with incorrect email and password", async ({ pomManager }) => {
		await test.step("Login with incorrect credentials", async () => {
			await pomManager.header.clickSignupLoginButton();
			await pomManager.login.assertLoginText();
			await pomManager.login.loginWithCredentials("incorrect@Email.com", "incorrectPassword");
		});

		await test.step("Verify login error", async () => {
			await pomManager.login.assertLoginErrorMessage();
		});
	});

	test("Test Case 4: Logout User", async ({ pomManager, page }) => {
		let username: string;

		await test.step("Login with preset credentials", async () => {
			await pomManager.header.clickSignupLoginButton();
			await pomManager.login.assertLoginText();
			username = await pomManager.login.loginWithCredentials();
		});

		await test.step("Verify successful login and logout", async () => {
			await pomManager.header.expectLoggedIn(username);
			await pomManager.header.clickLogoutButton();
			await expect(page).toHaveURL(/login/);
		});
	});
});
