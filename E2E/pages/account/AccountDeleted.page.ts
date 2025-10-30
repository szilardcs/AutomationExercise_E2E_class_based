import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../Base.page";

export class AccountDeleted extends BasePage {
	protected readonly accountDeletedText: Locator;
	protected readonly continueButton: Locator;

	constructor(protected readonly page: Page) {
		super(page);
		this.accountDeletedText = page.getByRole("heading", { name: "Account Deleted!" });
		this.continueButton = page.getByRole("link", { name: "Continue" });
	}

	async verifyDeletedText() {
		await expect(this.page).toHaveURL("/delete_account");
		await expect(this.accountDeletedText).toBeVisible();
	}

	async clickContinueButton() {
		await this.continueButton.click();
	}
}
