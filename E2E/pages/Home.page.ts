import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./Base.page";
import { createContactInfoFaker } from "../factories/contactUs.factory";

export class HomePage extends BasePage {
	// subscription
	protected readonly footer: Locator;
	protected readonly subscriptionText: Locator;
	protected readonly subscriptionEmailField: Locator;
	protected readonly subscriptionSubmit: Locator;
	protected readonly subscriptionSuccess: Locator;
	protected readonly productsList: Locator;

	// recommended items
	protected readonly recommendedWrapper: Locator;
	protected readonly recommendedHeading: Locator;
	protected readonly recommendedCarouselWrapper: Locator;
	protected readonly recommendedActiveItemsWrapper: Locator;
	protected readonly viewCartButton: Locator;
	protected readonly fullFledgedText: Locator;

	protected readonly scrollToTopArrow: Locator;

	constructor(protected readonly page: Page) {
		super(page);
		// subscription
		this.footer = page.locator("#footer");
		this.subscriptionText = this.footer.getByRole("heading", { name: "Subscription" });
		this.subscriptionEmailField = this.footer.getByRole("textbox", { name: "Your email address" });
		this.subscriptionSubmit = this.footer.locator("#subscribe");
		this.subscriptionSuccess = this.footer.locator("#success-subscribe");
		this.productsList = page.locator(".features_items");

		// recommened items
		this.recommendedWrapper = page.locator(".recommended_items");
		this.recommendedHeading = this.recommendedWrapper.getByRole("heading", { name: "recommended items" });
		this.recommendedCarouselWrapper = this.recommendedWrapper.locator("#recommended-item-carousel");
		this.recommendedActiveItemsWrapper = this.recommendedCarouselWrapper.locator(".item, .active");

		this.viewCartButton = page.locator("#cartModal").getByText("View Cart");
		this.scrollToTopArrow = page.locator("#scrollUp");
		this.fullFledgedText = page.getByRole("heading", {
			name: "Full-Fledged practice website for Automation Engineers",
		});
	}

	async goToHomePageAndAssert() {
		await this.page.goto("/");
		await expect(this.page).toHaveURL("https://automationexercise.com/");
	}

	// Helper method to get productWrapper by index
	private getProductWrapperByIndex(index: number): Locator {
		return this.productsList.locator(".col-sm-4").nth(index);
	}

	// Products
	async clickViewProductButton(index: number) {
		await this.getProductWrapperByIndex(index).getByRole("link", { name: "View Product" }).click();
	}

	// Method to get product name
	async getProductNameFromlist(index: number): Promise<string> {
		const productWrapper = this.getProductWrapperByIndex(index);
		const productName = await productWrapper.locator("p").first().textContent();
		return productName || "";
	}

	async getProductPriceFromList(index: number): Promise<number> {
		const productWrapper = this.getProductWrapperByIndex(index);
		const productPrice = await productWrapper.locator("h2").first().textContent();
		const priceNumber = productPrice ? parseInt(productPrice.replace(/\D/g, "")) : 0;
		return priceNumber;
	}

	async clickViewCartButton() {
		await this.viewCartButton.click();
	}

	// recommended items section

	async scrollToRecommened() {
		await this.recommendedWrapper.scrollIntoViewIfNeeded();
	}

	async verifyRecommendedHeading() {
		await expect(this.recommendedHeading).toBeVisible();
	}

	// helper method to get active item by index
	private getActiveItemByIndex(index: number): Locator {
		return this.recommendedCarouselWrapper.locator(".single-products").nth(index);
	}

	async getProductNameFromRecommended(index: number): Promise<string> {
		const productWrapper = this.getActiveItemByIndex(index);
		const productName = await productWrapper.locator("p").first().textContent();
		return productName || "";
	}

	async getProductPriceFromRecommended(index: number): Promise<number> {
		const productWrapper = this.getActiveItemByIndex(index);
		const productPrice = await productWrapper.locator("h2").first().textContent();
		const priceNumber = productPrice ? parseInt(productPrice.replace(/\D/g, "")) : 0;
		return priceNumber;
	}

	async addRecommendedItemToCartByIndex(index: number) {
		const productId = index + 1;
		const addToCartButton = this.getActiveItemByIndex(index).locator(`[data-product-id="${productId}"]`);
		await addToCartButton.scrollIntoViewIfNeeded();
		await addToCartButton.click();
	}

	// subscription
	async scrollDownAndVerifyText() {
		await this.footer.scrollIntoViewIfNeeded();
		await expect(this.subscriptionText).toBeVisible();
	}

	async enterEmailAndSubmit() {
		const info = createContactInfoFaker();
		await this.subscriptionEmailField.fill(info.email);
		await this.subscriptionSubmit.click();
	}

	async verifySubSuccess() {
		await expect(this.subscriptionSuccess).toBeVisible();
	}

	async scrollToTopWithArrow() {
		await this.scrollToTopArrow.click();
	}

	async scrollToTop() {
		await this.fullFledgedText.scrollIntoViewIfNeeded();
	}

	async verifyFullFledgedText() {
		await expect(this.fullFledgedText).toBeVisible();
	}
}
