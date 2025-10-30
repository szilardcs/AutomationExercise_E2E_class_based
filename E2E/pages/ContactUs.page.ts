import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./Base.page";
import { createContactInfoFaker } from "../factories/contactUs.factory";

export class ContactUs extends BasePage {
	protected readonly getInTouchText: Locator;
	protected readonly nameField: Locator;
	protected readonly emailField: Locator;
	protected readonly subjectField: Locator;
	protected readonly messageField: Locator;
	protected readonly fileInput: Locator;
	protected readonly submitButton: Locator;
	protected readonly successMessage: Locator;
	protected readonly homeButton: Locator;

	constructor(protected readonly page: Page) {
		super(page);
		this.getInTouchText = page.getByRole("heading", { name: "Get In Touch" });
		this.nameField = page.getByRole("textbox", { name: "Name" });
		this.emailField = page.getByRole("textbox", { name: "Email", exact: true });
		this.subjectField = page.getByRole("textbox", { name: "Subject" });
		this.messageField = page.getByRole("textbox", { name: "Your Message Here" });
		this.fileInput = page.locator('[name="upload_file"]');
		this.submitButton = page.getByRole("button", { name: "Submit" });
		this.successMessage = page.locator("#contact-page").locator(".alert-success");
		this.homeButton = page.locator(".btn-success");
	}

	async assertPageAndText() {
		await expect(this.page).toHaveURL(/contact_us/);
		await expect(this.getInTouchText).toBeVisible();
	}

	async uploadFile() {
		const filePath = "E2E/assets/test-image.png";
		await this.fileInput.setInputFiles(filePath);
	}

	async submitAndHandlePopup() {
		// hard waits necesarry here, would be flaky otherwise
		await this.page.waitForTimeout(1000);
		this.page.on("dialog", (dialog) => {
			dialog.accept();
		});
		await this.submitButton.click();
		await this.page.waitForTimeout(1000);
	}

	async fillContactFields() {
		const contactInfo = createContactInfoFaker();
		await this.nameField.fill(contactInfo.name);
		await this.emailField.fill(contactInfo.email);
		await this.subjectField.fill(contactInfo.subject);
		await this.messageField.fill(contactInfo.message);
	}

	async clickHomeButtonAndAssertHome() {
		await this.homeButton.click();
		await expect(this.page).toHaveURL("https://automationexercise.com/");
	}

	async assertSuccessMessage() {
		await expect(this.successMessage).toBeVisible();
	}
}
