import { Locator, Page, expect } from "@playwright/test";
import { createContactInfoFaker } from "../../factories/contactUs.factory";
import { BasePage } from "../Base.page";

export class ProductDetails extends BasePage {
	// product info
	protected readonly productInfoWrapper: Locator;
	protected readonly productName: Locator;
	protected readonly productCategory: Locator;
	protected readonly productPrice: Locator;
	protected readonly productQuantity: Locator;
	protected readonly productAvailability: Locator;
	protected readonly productCondition: Locator;
	protected readonly productBrand: Locator;

	protected readonly viewCartButton: Locator;

	// review section
	protected readonly reviewSectionWrapper: Locator;
	protected readonly reviewNameField: Locator;
	protected readonly reviewEmailField: Locator;
	protected readonly reviewMessageField: Locator;
	protected readonly reviewTextHeading: Locator;
	protected readonly reviewSuccessMessage: Locator;

	// buttons
	protected readonly addToCartButton: Locator;
	protected readonly reviewSubmitButton: Locator;

	constructor(protected readonly page: Page) {
		super(page);

		// product info wrapper and child elements
		this.productInfoWrapper = page.locator(".product-information");
		this.productName = this.productInfoWrapper.locator("h2"); // <--- name
		this.productCategory = this.productInfoWrapper.locator("p:has-text('Category:')");
		this.productPrice = this.productInfoWrapper.locator("span span").first(); // <--- price
		this.productQuantity = this.productInfoWrapper.locator("input#quantity");
		this.productAvailability = this.productInfoWrapper.locator("p:has-text('Availability:')");
		this.productCondition = this.productInfoWrapper.locator("p:has-text('Condition:')");
		this.productBrand = this.productInfoWrapper.locator("p:has-text('Brand:')");

		this.viewCartButton = page.locator("#cartModal").getByText("View Cart");

		// review section wrapper and child elements
		this.reviewSectionWrapper = page.locator("#review-form");
		this.reviewNameField = this.reviewSectionWrapper.getByRole("textbox", { name: "Your Name" });
		this.reviewEmailField = this.reviewSectionWrapper.getByRole("textbox", { name: "Email Address" });
		this.reviewMessageField = this.reviewSectionWrapper.getByRole("textbox", { name: "Add Review Here!" });
		this.reviewTextHeading = page.getByRole("link", { name: "Write Your Review" });
		this.reviewSuccessMessage = this.reviewSectionWrapper.getByText("Thank you for your review.");

		// buttons for sections
		this.addToCartButton = this.productInfoWrapper.getByRole("button", { name: " Add to cart" });
		this.reviewSubmitButton = this.reviewSectionWrapper.getByRole("button", { name: "Submit" });
	}

	// helper method to compare names and prices
	private async compareNameAndPrice(productNameFromList: string, productPriceFromList: number): Promise<void> {
		const productName = await this.productName.textContent();
		const productPrice = await this.productPrice.textContent();

		const rawDetailsPrice = productPrice ? parseInt(productPrice.replace(/\D/g, "")) : 0;

		expect(productNameFromList).toBe(productName);
		expect(productPriceFromList).toBe(rawDetailsPrice);
	}

	async verifyPage(): Promise<void> {
		await expect(this.page).toHaveURL(/product_details/);
	}

	// details assertions
	async verifyProductDetails(productNameFromList: string, productPriceFromList: number): Promise<void> {
		await expect(this.page).toHaveURL(/product_details/);
		await expect(this.productName).toBeVisible();
		await expect(this.productCategory).toBeVisible();
		await expect(this.productPrice).toBeVisible();
		await expect(this.productQuantity).toBeVisible();
		await expect(this.productAvailability).toBeVisible();
		await expect(this.productCondition).toBeVisible();
		await expect(this.productBrand).toBeVisible();
		await this.compareNameAndPrice(productNameFromList, productPriceFromList);
	}

	async addProductToCart(): Promise<void> {
		await this.addToCartButton.click();
	}

	async setProductQuantity(quantity: number): Promise<void> {
		await this.productQuantity.fill(quantity.toString());
	}

	async clickViewCartButton(): Promise<void> {
		await this.viewCartButton.click();
	}

	// fill and submit review section
	async fillAndSubmitReview(): Promise<void> {
		const reviewInfo = createContactInfoFaker();
		await this.reviewNameField.fill(reviewInfo.name);
		await this.reviewEmailField.fill(reviewInfo.email);
		await this.reviewMessageField.fill(reviewInfo.message);
		await this.reviewSubmitButton.click();
	}

	async verifyWriteYourReviewText(): Promise<void> {
		await expect(this.reviewTextHeading).toBeVisible();
	}

	async verifySuccessMessage(): Promise<void> {
		await expect(this.reviewSuccessMessage).toBeVisible();
	}
}
