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

	// helper method to get product wrapper by product name
	private getProductWrapperByName(productName: string): Locator {
		return this.productsList.locator(".col-sm-4").filter({ hasText: `${productName}` });
	}

	async getProductPriceFromList(productName: string): Promise<number> {
		const productWrapper = this.getProductWrapperByName(productName);
		const productPrice = await productWrapper.locator("h2").first().textContent();
		const priceNumber = productPrice ? parseInt(productPrice.replace(/\D/g, "")) : 0;
		return priceNumber;
	}

	async clickViewProductButton(productName: string): Promise<void> {
		await this.getProductWrapperByName(productName).getByRole("link", { name: "View Product" }).click();
	}

	async clickAddToCartByName(productName: string): Promise<void> {
		const productWrapper = this.getProductWrapperByName(productName);
		const addToCartButton = productWrapper.locator(".add-to-cart").first();
		// await addToCartButton.hover();
		await addToCartButton.click();
	}

	async clickViewCartButton(): Promise<void> {
		await this.viewCartButton.click();
	}

	async clickContinueShopping(): Promise<void> {
		await this.continueShoppingButton.click();
	}

	// === Category section ===

	async verifyCategoryText(): Promise<void> {
		await expect(this.leftSideBarWrapper.getByRole("heading", { name: "Category" })).toBeVisible();
	}

	// helper method to get brand by name
	private getBrandByName(brandName: string): Locator {
		return this.brandWrapper.getByRole("link", { name: `${brandName}` });
	}

	// helper method to get subcategory by name
	private getSubcategoryByNames(category: "Women" | "Men" | "Kids", subcategoryName: string): Locator {
		if (category === "Women") {
			return this.womenWrapper.getByRole("link", { name: `${subcategoryName}` });
		} else if (category === "Men") {
			return this.menWrapper.getByRole("link", { name: `${subcategoryName}` });
		} else if (category === "Kids") {
			return this.kidsWrapper.getByRole("link", { name: `${subcategoryName}` });
		}
		throw new Error("Invalid category");
	}

	async verifyCategoryHeading(expectedText: string): Promise<void> {
		const heading = this.page.locator("h2", { hasText: expectedText });
		await expect(heading).toBeVisible();
	}

	async clickSubcategoryByNames(category: "Women" | "Men" | "Kids", subcategoryName: string): Promise<void> {
		await this.getSubcategoryByNames(category, subcategoryName).click();
	}

	async clickCategoryWomen(): Promise<void> {
		await this.categoryWomen.click();
	}

	async clickCategoryMen(): Promise<void> {
		await this.categoryMen.click();
	}

	async clickCategoryKids(): Promise<void> {
		await this.categoryKids.click();
	}

	// brands

	async verifyBrandHeading(expectedText: string): Promise<void> {
		const heading = this.page.locator("h2", { hasText: expectedText });
		await expect(heading).toBeVisible();
	}

	async verifyBrandsSidebar(): Promise<void> {
		await expect(this.brandHeading).toBeVisible();
	}

	async clickOnBrandByName(brandName: string): Promise<void> {
		const brand = this.getBrandByName(brandName);
		await brand.click();
	}

	// assertions

	async verifyProductPage(): Promise<void> {
		await expect(this.page).toHaveURL(/products/);
	}

	async verifyProductList(): Promise<void> {
		await expect(this.productsList).toBeVisible();
	}

	async searchProduct(searchQuery: string): Promise<void> {
		await this.productSearchField.fill(searchQuery);
		await this.productSearchButton.click();
		await expect(this.searchedHeading).toBeVisible();
	}

	async verifySearchedProduct(searchQuery: string): Promise<void> {
		await expect(this.getProductWrapperByName(searchQuery)).toBeVisible();
	}
}
