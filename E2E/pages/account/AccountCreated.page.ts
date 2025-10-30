import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../Base.page";

export class AccountCreated extends BasePage {
	protected readonly accountCreatedText: Locator;
	protected readonly continueButton: Locator;

	constructor(protected readonly page: Page) {
		super(page);
		this.accountCreatedText = page.getByRole("heading", { name: "Account Created!" });
		this.continueButton = page.getByRole("link", { name: "Continue" });
	}

	async verifyCreatedText() {
		await expect(this.page).toHaveURL("/account_created");
		await expect(this.accountCreatedText).toBeVisible();
	}

	async clickContinueButton() {
		await this.continueButton.click();
	}
}
