import { Locator, Page, expect } from "@playwright/test";
import { createPaymentInfoFaker } from "../../factories/paymentDetails.factory";
import { BasePage } from "../Base.page";

export class Payment extends BasePage {
	protected readonly nameOnCardField: Locator;
	protected readonly cardNumberField: Locator;
	protected readonly CVCField: Locator;
	protected readonly expirationMonthField: Locator;
	protected readonly expirationYearField: Locator;
	protected readonly payAndConfirmOrderButton: Locator;
	protected readonly successMessage: Locator;

	constructor(protected readonly page: Page) {
		super(page);
		this.nameOnCardField = page.locator('[name="name_on_card"]');
		this.cardNumberField = page.locator('[name="card_number"]');
		this.CVCField = page.getByRole("textbox", { name: "ex. 311" });
		this.expirationMonthField = page.getByRole("textbox", { name: "MM" });
		this.expirationYearField = page.getByRole("textbox", { name: "YYY" });

		this.payAndConfirmOrderButton = page.getByRole("button", { name: "Pay and Confirm Order" });
		this.successMessage = page.locator("#success_message");
	}

	async fillPaymentDetails(): Promise<void> {
		let paymentInfo = createPaymentInfoFaker();
		await this.nameOnCardField.fill(paymentInfo.nameOnCard);
		await this.cardNumberField.fill(paymentInfo.cardNumber);
		await this.CVCField.fill(paymentInfo.cvc);
		await this.expirationMonthField.fill(paymentInfo.expMonth);
		await this.expirationYearField.fill(paymentInfo.expYear);
	}

	async clickPayAndConfirmButton(): Promise<void> {
		await this.payAndConfirmOrderButton.click();
	}

	async verifySuccessfulOrder(): Promise<void> {
		await expect(this.page).toHaveURL(/payment_done/);
	}
}
