import { Locator, Page, expect } from "@playwright/test";
import { createAccountInfoFaker } from "../../factories/signup.factory";
import { BasePage } from "../Base.page";

export const testUserData = {
	presetUser: {
		name: process.env.TEST_USER_NAME!,
		email: process.env.TEST_USER_EMAIL!,
		password: process.env.TEST_USER_PASSWORD!,
		addressData: {
			firstName: process.env.TEST_USER_FIRSTNAME!,
			lastName: process.env.TEST_USER_LASTNAME!,
			company: process.env.TEST_USER_COMPANY!,
			address: process.env.TEST_USER_ADDRESS!,
			address2: process.env.TEST_USER_ADDRESS2!,
			country: process.env.TEST_USER_COUNTRY!,
			state: process.env.TEST_USER_STATE!,
			city: process.env.TEST_USER_CITY!,
			zipcode: process.env.TEST_USER_ZIPCODE!,
			mobileNumber: process.env.TEST_USER_MOBILE!,
		},
	},
};

export class LoginPage extends BasePage {
	// login section
	protected readonly loginText: Locator;
	protected readonly loginEmail: Locator;
	protected readonly loginPassword: Locator;
	protected readonly loginButton: Locator;
	protected readonly incorrectLoginMessage: Locator;

	// signup section
	protected readonly signupText: Locator;
	protected readonly signupName: Locator;
	protected readonly signupEmail: Locator;
	protected readonly signupButton: Locator;
	protected readonly incorrectRegisterMessage: Locator;

	constructor(protected readonly page: Page) {
		super(page);
		// login section
		this.loginText = page.getByRole("heading", { name: "Login to your account" });
		this.loginEmail = page.getByRole("textbox", { name: "Email Address" }).nth(0);
		this.loginPassword = page.getByRole("textbox", { name: "Password" });
		this.loginButton = page.getByRole("button", { name: "Login" });
		this.incorrectLoginMessage = page
			.getByRole("paragraph")
			.filter({ hasText: "Your email or password is incorrect!" });

		// signup section
		this.signupText = page.getByRole("heading", { name: "New User Signup!" });
		this.signupName = page.getByRole("textbox", { name: "Name" });
		this.signupEmail = page.getByRole("textbox", { name: "Email Address" }).nth(1);
		this.signupButton = page.getByRole("button", { name: "Signup" });
		this.incorrectRegisterMessage = page.getByRole("paragraph").filter({ hasText: "Email Address already exist!" });
	}

	// login

	async assertLoginText(): Promise<void> {
		await expect(this.loginText).toBeVisible();
	}

	async fillLoginEmail(email: string = testUserData.presetUser.email): Promise<void> {
		await this.loginEmail.fill(email);
	}

	async fillLoginPass(password: string = testUserData.presetUser.password): Promise<void> {
		await this.loginPassword.fill(password);
	}

	async clickLoginButton(): Promise<void> {
		await this.loginButton.click();
	}

	// leave args empty for correct creds or input your own
	async loginWithCredentials(email?: string, password?: string): Promise<string> {
		const usedEmail = email ?? testUserData.presetUser.email;
		const usedPassword = password ?? testUserData.presetUser.password;

		await this.fillLoginEmail(usedEmail);
		await this.fillLoginPass(usedPassword);
		await this.clickLoginButton();
		return testUserData.presetUser.name;
	}

	async assertLoginErrorMessage(): Promise<void> {
		await expect(this.incorrectLoginMessage).toBeVisible();
	}

	// signup

	async assertSignupText(): Promise<void> {
		await expect(this.signupText).toBeVisible();
	}

	// returns username for asserting later
	async fillSignupNameAndReturnIt(): Promise<string> {
		const info = createAccountInfoFaker();
		await this.signupName.fill(info.name);
		return info.name;
	}

	async fillSignupEmail(): Promise<void> {
		const info = createAccountInfoFaker();
		await this.signupEmail.fill(info.email);
	}

	async clickSignupButton(): Promise<void> {
		await this.signupButton.click();
	}

	async fillAlreadyUsedCreds(): Promise<void> {
		await this.signupName.fill(testUserData.presetUser.name);
		await this.signupEmail.fill(testUserData.presetUser.email);
	}

	async assertRegisterErrorMessage(): Promise<void> {
		await expect(this.incorrectRegisterMessage).toBeVisible();
	}
}
