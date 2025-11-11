import { Locator, Page, expect } from "@playwright/test";
import { createContactInfoFaker } from "../../factories/contactUs.factory";
import { BasePage } from "../Base.page";

export class Checkout extends BasePage {
	// section wrappers
	protected readonly deliveryAddressWrapper: Locator;
	protected readonly billingAddressWrapper: Locator;
	protected readonly cartInfoWrapper: Locator;
	protected readonly placeOrderButton: Locator;
	protected readonly cartTotal: Locator;

	protected readonly commentField: Locator;

	constructor(protected readonly page: Page) {
		super(page);
		// wrappers
		this.deliveryAddressWrapper = page.locator("#address_delivery");
		this.billingAddressWrapper = page.locator("#address_invoice");
		this.cartInfoWrapper = page.locator("#cart_info");
		this.commentField = page.locator("#ordermsg").getByRole("textbox");
		this.placeOrderButton = page.getByRole("link", { name: "Place Order" });
		this.cartTotal = page.locator(".cart_total_price").last();
	}

	// helper method to find product row
	private rowSelector(index: number): Locator {
		return this.cartInfoWrapper.locator(`#product-${index + 1}`);
	}

	async verifyDeliveryAddress(addressData: any): Promise<void> {
		const expectedAddress = `Mr. ${addressData.firstName} ${addressData.lastName} ${addressData.company} ${addressData.address} ${addressData.address2} ${addressData.city} ${addressData.state} ${addressData.zipcode} ${addressData.country} ${addressData.mobileNumber}`;
		await expect(this.deliveryAddressWrapper).toContainText(expectedAddress);
	}

	async verifyBillingAddress(addressData: any): Promise<void> {
		const expectedAddress = `Mr. ${addressData.firstName} ${addressData.lastName} ${addressData.company} ${addressData.address} ${addressData.address2} ${addressData.city} ${addressData.state} ${addressData.zipcode} ${addressData.country} ${addressData.mobileNumber}`;
		await expect(this.billingAddressWrapper).toContainText(expectedAddress);
	}

	// helper method to get product name
	private async getProductName(index: number): Promise<string> {
		const productWrapper = this.rowSelector(index);
		return (await productWrapper.locator(".cart_description").locator("a").textContent()) ?? "Incorrect name";
	}

	// ========== cart section =============
	async verifyProductName(index: number, listName: string): Promise<void> {
		const productName = await this.getProductName(index);
		expect(listName).toBe(productName);
	}

	async verifyProductPrice(index: number, listPrice: number): Promise<number> {
		const productWrapper = this.rowSelector(index);
		const productPrice = await productWrapper.locator(".cart_price p").textContent();
		const priceNumber = productPrice ? parseInt(productPrice.replace(/\D/g, "")) : 0;
		expect(listPrice).toBe(priceNumber);
		return priceNumber;
	}

	async verifyCartTotal(firstProductPrice: number, secondProductPrice: number): Promise<void> {
		const totalText = await this.cartTotal.textContent();
		const expectedNumberTotal = totalText ? parseInt(totalText.replace(/\D/g, "")) : 0;
		const total = firstProductPrice + secondProductPrice;
		expect(total).toBe(expectedNumberTotal);
	}

	async fillCommentAndPlaceOrder(): Promise<void> {
		let content = createContactInfoFaker();
		await this.commentField.fill(content.subject);
		await this.placeOrderButton.click();
	}
}
