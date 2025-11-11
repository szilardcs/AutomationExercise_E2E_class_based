import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./Base.page";

export class TestCases extends BasePage {
	protected readonly testHeaderText: Locator;

	constructor(protected readonly page: Page) {
		super(page);

		this.testHeaderText = page.getByRole("heading", { name: "Test Cases", exact: true });
	}

	async assertHeadingAndPage(): Promise<void> {
		await expect(this.testHeaderText).toBeVisible();
		await expect(this.page).toHaveURL(/test_cases/);
	}
}
