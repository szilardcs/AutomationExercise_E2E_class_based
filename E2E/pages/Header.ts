import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./Base.page";

export class Header extends BasePage {
	// arrange
	protected readonly homeButton: Locator;
	protected readonly productsButton: Locator;
	protected readonly cartButton: Locator;
	protected readonly signUpLoginButton: Locator;
	protected readonly logoutButton: Locator;
	protected readonly deleteAccountButton: Locator;
	protected readonly testCasesButton: Locator;
	protected readonly contactUsButton: Locator;

	constructor(page: Page) {
		super(page);
		this.homeButton = page.getByRole("link", { name: " Home" });
		this.productsButton = page.getByRole("link", { name: " Products" });
		this.cartButton = page.getByRole("link", { name: " Cart" });
		this.signUpLoginButton = page.getByRole("link", { name: " Signup / Login" });
		this.logoutButton = page.getByRole("link", { name: " Logout" });
		this.deleteAccountButton = page.getByRole("link", { name: " Delete Account" });
		this.testCasesButton = page.getByRole("link", { name: " Test Cases", exact: true });
		this.contactUsButton = page.getByRole("link", { name: " Contact Us" });
	}
	// act
	async clickHomePageButton() {
		await this.homeButton.click();
	}

	async clickProductButton() {
		await this.productsButton.click();
	}

	async clickCartButton() {
		await this.cartButton.click();
	}

	async clickSignupLoginButton() {
		await this.signUpLoginButton.click();
	}

	async clickLogoutButton() {
		await this.logoutButton.click();
	}

	async clickDeleteAccountButton() {
		await this.deleteAccountButton.click();
	}

	async clickTestCasesButton() {
		await this.testCasesButton.click();
	}

	async clickContactUsButton() {
		await this.contactUsButton.click();
	}

	async expectLoggedIn(username: string) {
		await expect(this.page.getByRole("listitem").filter({ hasText: `Logged in as ${username}` })).toBeVisible();
	}
}
