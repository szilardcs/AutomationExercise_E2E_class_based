import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../Base.page";

export class PaymentDone extends BasePage {
	protected readonly downloadButton: Locator;
	protected readonly continueButton: Locator;

	constructor(protected readonly page: Page) {
		super(page);

		this.downloadButton = page.getByRole("link", { name: "Download Invoice" });
		this.continueButton = page.getByRole("link", { name: "Continue" });
	}

	async downloadInvoice(): Promise<void> {
		const downloadPromise = this.page.waitForEvent("download");
		await this.downloadButton.click();
		const download = await downloadPromise;

		expect(download.suggestedFilename()).toMatch(/\.(pdf|txt|doc|xls)$/i);
	}

	async clickContinueButton(): Promise<void> {
		await this.continueButton.click();
	}
}
