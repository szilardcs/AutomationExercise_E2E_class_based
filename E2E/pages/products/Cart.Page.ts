import { Locator, Page, expect } from "@playwright/test";
import { createContactInfoFaker } from "../../factories/contactUs.factory";
import { BasePage } from "../Base.page";

export class Cart extends BasePage {
	// checkout button
	protected readonly proceedToCheckoutButton: Locator;
	protected readonly registerLoginButton: Locator;

	// cart section
	protected readonly cartWrapper: Locator;
	protected readonly emptyCartMessage: Locator;

	// subscription section
	protected readonly footer: Locator;
	protected readonly subscriptionText: Locator;
	protected readonly subscriptionEmailField: Locator;
	protected readonly subscriptionSubmit: Locator;
	protected readonly subscriptionSuccess: Locator;

	constructor(protected readonly page: Page) {
		super(page);
		this.proceedToCheckoutButton = page.getByText("Proceed To Checkout");
		this.registerLoginButton = page.locator("#checkoutModal").locator("u", { hasText: "Register / login" });

		// cart section
		this.cartWrapper = page.locator("#cart_info_table");
		this.emptyCartMessage = page.locator("#empty_cart");

		// subscription section
		this.footer = page.locator("#footer");
		this.subscriptionText = this.footer.getByRole("heading", { name: "Subscription" });
		this.subscriptionEmailField = this.footer.getByRole("textbox", { name: "Your email address" });
		this.subscriptionSubmit = this.footer.locator("#subscribe");
		this.subscriptionSuccess = this.footer.locator("#success-subscribe");
	}

	// helper method to find product row
	private rowSelector(index: number): Locator {
		return this.cartWrapper.locator(`#product-${index + 1}`);
	}

	// helper method to get product name
	private async getProductName(index: number): Promise<string> {
		const productWrapper = this.rowSelector(index);
		return (await productWrapper.locator(".cart_description").locator("h4 a").textContent()) ?? "Incorrect name";
	}

	async verifyPage(): Promise<void> {
		await expect(this.page).toHaveURL(/view_cart/);
	}

	async clickCheckoutButton(): Promise<void> {
		await this.proceedToCheckoutButton.click();
	}

	async clickRegisterLogin(): Promise<void> {
		await this.registerLoginButton.click();
	}

	// === Cart section ===
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

	// returns productQuantity for calculating total
	async verifyProductQuantity(index: number, expectedQuantity: number): Promise<number> {
		const productWrapper = this.rowSelector(index);
		const productQuantity = await productWrapper.locator(".cart_quantity button").textContent();
		const quantityNumber = productQuantity ? parseInt(productQuantity.replace(/\D/g, "")) : 0;
		expect(expectedQuantity).toBe(quantityNumber);
		return quantityNumber;
	}

	// calculates totalPrice based on productPrice and productQuantity and asserts
	async verifyProductTotal(index: number, productPrice: number, productQuantity: number): Promise<void> {
		const totalPrice = productPrice * productQuantity;
		const productWrapper = this.rowSelector(index);
		const productTotal = await productWrapper.locator(".cart_total p").textContent();
		const priceNumber = productTotal ? parseInt(productTotal.replace(/\D/g, "")) : 0;
		expect(totalPrice).toBe(priceNumber);
	}

	async removeProductFromCart(index: number): Promise<void> {
		const productWrapper = this.rowSelector(index);
		const deleteButton = productWrapper.locator(".cart_delete").locator(".cart_quantity_delete");
		await deleteButton.hover();
		await deleteButton.click();
	}

	async verifyProductInCart(index: number): Promise<void> {
		const productName = await this.getProductName(index);
		expect(productName).toBeTruthy();
	}

	async expectEmptyCart(): Promise<void> {
		await expect(this.emptyCartMessage).toBeVisible();
	}

	// ========= subscription section ============
	async scrollDownAndVerifyText(): Promise<void> {
		await this.footer.scrollIntoViewIfNeeded();
		await expect(this.subscriptionText).toBeVisible();
	}

	async enterEmailAndSubmit(): Promise<void> {
		const info = createContactInfoFaker();
		await this.subscriptionEmailField.fill(info.email);
		await this.subscriptionSubmit.click();
	}

	async verifySubSuccess(): Promise<void> {
		await expect(this.subscriptionSuccess).toBeVisible();
	}

	async clearCartViaAPI(): Promise<void> {
		await this.page.request.get("delete_cart/1");
		await this.page.request.get("delete_cart/2");
	}
}
