import { Locator, Page, expect } from "@playwright/test";

export abstract class BasePage {
	constructor(protected readonly page: Page) {}

	protected async goToURL(path: string) {
		await this.page.goto(path);
	}

	// Low level helpers
	protected async basePageClick(selector: Locator) {
		await this.toLocator(selector).click();
	}

	// Utility
	protected toLocator(selector: Locator | string): Locator {
		return typeof selector === "string" ? this.page.locator(selector) : selector;
	}
}
