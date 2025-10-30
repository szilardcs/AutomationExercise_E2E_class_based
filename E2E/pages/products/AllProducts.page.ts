import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../Base.page";

export class AllProducts extends BasePage {
	protected readonly productsList: Locator;
	protected readonly productSearchField: Locator;
	protected readonly productSearchButton: Locator;
	protected readonly searchedHeading: Locator;
	protected readonly viewCartButton: Locator;
	protected readonly continueShoppingButton: Locator;

	protected readonly leftSideBarWrapper: Locator;
	protected readonly categoryWrapper: Locator;
	protected readonly brandWrapper: Locator;
	protected readonly brandHeading: Locator;
	// women
	protected readonly categoryWomen: Locator;
	protected readonly womenWrapper: Locator;
	// men
	protected readonly categoryMen: Locator;
	protected readonly menWrapper: Locator;
	// kids
	protected readonly categoryKids: Locator;
	protected readonly kidsWrapper: Locator;

	constructor(protected readonly page: Page) {
		super(page);
		this.productsList = page.locator(".features_items");
		this.productSearchField = page.locator("#search_product");
		this.productSearchButton = page.locator("#submit_search");
		this.searchedHeading = page.getByRole("heading", { name: "Searched Products" });
		this.viewCartButton = page.locator("#cartModal").getByText("View Cart");
		this.continueShoppingButton = page.getByRole("button", { name: "Continue Shopping" });

		// === left sidebar section ===
		this.leftSideBarWrapper = page.locator(".left-sidebar");

		// category and brands wrappers
		this.categoryWrapper = this.leftSideBarWrapper.locator("#accordian");
		this.brandWrapper = this.leftSideBarWrapper.locator(".brands-name");
		this.brandHeading = page.getByRole("heading", { name: "Brands" });

		// women
		this.categoryWomen = this.categoryWrapper.getByRole("link", { name: " Women" });
		this.womenWrapper = this.categoryWrapper.locator("#Women");

		// men
		this.categoryMen = this.categoryWrapper.getByRole("link", { name: " Men" });
		this.menWrapper = this.categoryWrapper.locator("#Men");

		// kids
		this.categoryKids = this.categoryWrapper.getByRole("link", { name: " Kids" });
		this.kidsWrapper = this.categoryWrapper.locator("#Kids");
	}

	// Helper method to get productWrapper by index
	private getProductWrapperByIndex(index: number): Locator {
		return this.productsList.locator(".col-sm-4").nth(index);
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

	async clickViewProductButton(index: number) {
		await this.getProductWrapperByIndex(index).getByRole("link", { name: "View Product" }).click();
	}

	async hoverAndClickAddToCart(index: number) {
		const productWrapper = this.getProductWrapperByIndex(index);
		const addToCartButton = productWrapper.locator(`[data-product-id="${index + 1}"]`).nth(1);
		await productWrapper.hover();
		await addToCartButton.click();
	}

	async clickViewCartButton() {
		await this.viewCartButton.click();
	}

	async clickContinueShopping() {
		await this.continueShoppingButton.click();
	}

	// === category section ===

	async verifyCategoryText() {
		await expect(this.leftSideBarWrapper.getByRole("heading", { name: "Category" })).toBeVisible();
	}

	// helper method to get brand by index
	private getBrandByIndex(index: number): Locator {
		return this.brandWrapper.getByRole("listitem").nth(index);
	}

	// helper method to get subcategory by index
	private getSubcategoryByIndex(category: "Women" | "Men" | "Kids", index: number): Locator {
		if (category === "Women") {
			return this.womenWrapper.getByRole("listitem").nth(index);
		} else if (category === "Men") {
			return this.menWrapper.getByRole("listitem").nth(index);
		} else if (category === "Kids") {
			return this.kidsWrapper.getByRole("listitem").nth(index);
		}
		throw new Error("Invalid category");
	}

	async verifyCategoryHeading(expectedText: string) {
		const heading = this.page.locator("h2", { hasText: expectedText });
		await expect(heading).toBeVisible();
	}

	async clickSubcategoryByNameAndIndex(category: "Women" | "Men" | "Kids", index: number) {
		await this.getSubcategoryByIndex(category, index).getByRole("link").click();
	}

	async clickCategoryWomen() {
		await this.categoryWomen.click();
	}

	async clickCategoryMen() {
		await this.categoryMen.click();
	}

	async clickCategoryKids() {
		await this.categoryKids.click();
	}

	// brands

	async verifyBrandHeading(expectedText: string) {
		const heading = this.page.locator("h2", { hasText: expectedText });
		await expect(heading).toBeVisible();
	}

	async verifyBrandsSidebar() {
		await expect(this.brandHeading).toBeVisible();
	}

	async clickOnBrandByIndex(index: number) {
		const brand = this.getBrandByIndex(index);
		await brand.getByRole("link").click();
	}

	// assertions

	async verifyProductPage() {
		await expect(this.page).toHaveURL(/products/);
	}

	async verifyProductList() {
		await expect(this.productsList).toBeVisible();
	}

	async searchProduct(searchQuery: string) {
		await this.productSearchField.fill(searchQuery);
		await this.productSearchButton.click();
		await expect(this.searchedHeading).toBeVisible();
	}

	async verifySearchedProduct(searchQuery: string) {
		await expect(this.getProductWrapperByIndex(0).locator("p").first()).toContainText(searchQuery);
	}
}
