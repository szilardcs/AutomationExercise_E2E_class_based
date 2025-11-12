import { Locator, Page, expect } from "@playwright/test";
import { createContactInfoFaker } from "../factories/contactUs.factory";
import { BasePage } from "./Base.page";

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

	async goToHomePageAndAssert(): Promise<void> {
		await this.page.goto("/");
		await expect(this.page).toHaveURL("https://automationexercise.com/");
	}

	// helper method to get product wrapper by product name
	private getProductWrapperByName(productName: string): Locator {
		return this.productsList.locator(".col-sm-4").filter({ hasText: `${productName}` });
	}

	// Products
	async clickViewProductButton(productName: string): Promise<void> {
		await this.getProductWrapperByName(productName).getByRole("link", { name: "View Product" }).click();
	}

	async getProductPriceFromList(productName: string): Promise<number> {
		const productWrapper = this.getProductWrapperByName(productName);
		const productPrice = await productWrapper.locator("h2").first().textContent();
		const priceNumber = productPrice ? parseInt(productPrice.replace(/\D/g, "")) : 0;
		return priceNumber;
	}

	async clickViewCartButton(): Promise<void> {
		await this.viewCartButton.click();
	}

	// recommended items section

	async scrollToRecommened(): Promise<void> {
		await this.recommendedWrapper.scrollIntoViewIfNeeded();
	}

	async verifyRecommendedHeading(): Promise<void> {
		await expect(this.recommendedHeading).toBeVisible();
	}

	// helper method to get active item by name
	private getActiveItemByName(productName: string): Locator {
		return this.recommendedCarouselWrapper.locator(".single-products").filter({ hasText: `${productName}` });
	}

	async getProductPriceFromRecommended(productName: string): Promise<number> {
		const productWrapper = this.getActiveItemByName(productName);
		const productPrice = await productWrapper.locator("h2").first().textContent();
		const priceNumber = productPrice ? parseInt(productPrice.replace(/\D/g, "")) : 0;
		return priceNumber;
	}

	async addRecommendedItemToCartByName(productName: string): Promise<void> {
		const addToCartButton = this.getActiveItemByName(productName).locator(".add-to-cart");
		await addToCartButton.click();
	}

	// subscription
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

	async scrollToTopWithArrow(): Promise<void> {
		await this.scrollToTopArrow.click();
	}

	async scrollToTop(): Promise<void> {
		await this.fullFledgedText.scrollIntoViewIfNeeded();
	}

	async verifyFullFledgedText(): Promise<void> {
		await expect(this.fullFledgedText).toBeVisible();
	}
}
