import { test } from "../fixtures/pomManager.fixture";

test.describe("Product flows", async () => {
	test.beforeEach("Navigate to page", async ({ pomManager }) => {
		await pomManager.home.goToHomePageAndAssert();
	});

	test("Test Case 8: Verify All Products and product detail page", async ({ pomManager }) => {
		const productName = "Blue Top";
		let productPrice: number;

		await test.step("Navigate to products page and verify", async () => {
			await pomManager.header.clickProductButton();
			await pomManager.allProducts.verifyProductPage();
			await pomManager.allProducts.verifyProductList();
		});

		await test.step("Get first product details and navigate to details page", async () => {
			productPrice = await pomManager.allProducts.getProductPriceFromList(productName);
			await pomManager.allProducts.clickViewProductButton(productName);
		});

		await test.step("Verify product details page and consistency", async () => {
			await pomManager.productDetails.verifyProductDetails(productName, productPrice);
		});
	});

	test("Test Case 9: Search Product", async ({ pomManager }) => {
		const searchQuery = "Blue Top";

		await test.step("Navigate to products page and search for product", async () => {
			await pomManager.header.clickProductButton();
			await pomManager.allProducts.verifyProductPage();
			await pomManager.allProducts.verifyProductList();
			await pomManager.allProducts.searchProduct(searchQuery);
		});

		await test.step("Verify search results", async () => {
			await pomManager.allProducts.verifySearchedProduct(searchQuery);
		});
	});

	test("Test Case 12: Add Products in Cart", async ({ pomManager }) => {
		const firstProductName = "Blue Top";
		const secondProductName = "Men TShirt";
		let firstProductPrice: number;
		let secondProductPrice: number;

		let firstProductQuantity: number = 4;
		let secondProductQuantity: number = 3;

		await test.step("Navigate to products page", async () => {
			await pomManager.header.clickProductButton();
		});

		await test.step("Add first product to cart and continue shopping", async () => {
			firstProductPrice = await pomManager.allProducts.getProductPriceFromList(firstProductName);
			await pomManager.allProducts.clickAddToCartByName(firstProductName);
			await pomManager.allProducts.clickContinueShopping();
		});

		await test.step("Add second product to cart and view cart", async () => {
			secondProductPrice = await pomManager.allProducts.getProductPriceFromList(secondProductName);
			await pomManager.allProducts.clickAddToCartByName(secondProductName);
			await pomManager.allProducts.clickViewCartButton();
		});

		await test.step("Verify cart contents and calculations", async () => {
			// Verify products exist in cart
			await pomManager.cart.verifyProductInCart(firstProductName);
			await pomManager.cart.verifyProductInCart(secondProductName);

			// First product verification
			await pomManager.cart.verifyProductName(firstProductName);
			await pomManager.cart.verifyProductPrice(firstProductName, firstProductPrice);
			firstProductQuantity = await pomManager.cart.verifyProductQuantity(firstProductName, 1); // number is expected quantity
			await pomManager.cart.verifyProductTotal(firstProductName, firstProductPrice, firstProductQuantity);

			// Second product verification
			await pomManager.cart.verifyProductName(secondProductName);
			await pomManager.cart.verifyProductPrice(secondProductName, secondProductPrice);
			secondProductQuantity = await pomManager.cart.verifyProductQuantity(secondProductName, 1); // number is expected quantity
			await pomManager.cart.verifyProductTotal(secondProductName, secondProductPrice, secondProductQuantity);
		});
	});

	test("Test Case 13: Verify Product quantity in Cart", async ({ pomManager }) => {
		const productName = "Blue Top";
		let productPrice: number;
		let productQuantity: number = 4;

		await test.step("Navigate to product details and set quantity", async () => {
			productPrice = await pomManager.allProducts.getProductPriceFromList(productName);
			await pomManager.home.clickViewProductButton(productName);
			await pomManager.productDetails.verifyPage();
			await pomManager.productDetails.setProductQuantity(productQuantity);
		});

		await test.step("Add product to cart and navigate to cart", async () => {
			await pomManager.productDetails.addProductToCart();
			await pomManager.productDetails.clickViewCartButton();
		});

		await test.step("Verify product quantity and total in cart", async () => {
			await pomManager.cart.verifyProductQuantity(productName, productQuantity);
			await pomManager.cart.verifyProductTotal(productName, productPrice, productQuantity);
		});
	});

	test("Test Case 17: Remove Products From Cart", async ({ pomManager }) => {
		const firstProductName = "Blue Top";
		const secondProductName = "Men TShirt";

		await test.step("Add products to cart and navigate to cart page", async () => {
			await pomManager.header.clickProductButton();

			// First product
			await pomManager.allProducts.clickAddToCartByName(firstProductName);
			await pomManager.allProducts.clickContinueShopping();

			// Second product
			await pomManager.allProducts.clickAddToCartByName(secondProductName);
			await pomManager.allProducts.clickViewCartButton();
			await pomManager.cart.verifyPage();
		});

		await test.step("Remove products and verify empty cart", async () => {
			await pomManager.cart.removeProductFromCart(firstProductName);
			await pomManager.cart.removeProductFromCart(secondProductName);
			await pomManager.cart.expectEmptyCart();
		});
	});

	test("Test Case 18: View Category Products", async ({ pomManager }) => {
		await test.step("Navigate to products page and verify categories", async () => {
			await pomManager.header.clickProductButton();
			await pomManager.allProducts.verifyCategoryText();
		});

		await test.step("Test Women category subcategories", async () => {
			await pomManager.allProducts.clickCategoryWomen();
			await pomManager.allProducts.clickSubcategoryByNames("Women", "TOPS");
			await pomManager.allProducts.verifyCategoryHeading("WOMEN - TOPS PRODUCTS");
		});

		await test.step("Test Men category subcategories", async () => {
			await pomManager.allProducts.clickCategoryMen();
			await pomManager.allProducts.clickSubcategoryByNames("Men", "TSHIRTS");
			await pomManager.allProducts.verifyCategoryHeading("Men - Tshirts Products");
		});
	});

	test("Test Case 19: View & Cart Brand Products", async ({ pomManager }) => {
		await test.step("Navigate to products page and verify brands sidebar", async () => {
			await pomManager.header.clickProductButton();
			await pomManager.allProducts.verifyBrandsSidebar();
		});

		await test.step("Test multiple brand navigation", async () => {
			// First brand
			await pomManager.allProducts.clickOnBrandByName("POLO");
			await pomManager.allProducts.verifyBrandHeading("Polo");

			// Second brand
			await pomManager.allProducts.clickOnBrandByName("H&M");
			await pomManager.allProducts.verifyBrandHeading("H&M");
		});
	});

	test("Test Case 20: Search Products and Verify Cart After Login", async ({ pomManager }) => {
		const productName = "Blue Top";
		let productPrice: number;

		await test.step("Search for product and add to cart", async () => {
			await pomManager.header.clickProductButton();
			await pomManager.allProducts.verifyProductPage();
			await pomManager.allProducts.searchProduct("Blue Top");
			await pomManager.allProducts.verifySearchedProduct("Blue Top");

			await pomManager.allProducts.clickAddToCartByName(productName);
			productPrice = await pomManager.allProducts.getProductPriceFromList(productName);

			await pomManager.allProducts.clickViewCartButton();
		});

		await test.step("Verify product in cart before login", async () => {
			await pomManager.cart.verifyProductInCart(productName);
			await pomManager.checkout.verifyProductName(productName);
			await pomManager.checkout.verifyProductPrice(productName, productPrice);
		});

		await test.step("Login and verify cart persistence", async () => {
			await pomManager.header.clickSignupLoginButton();
			await pomManager.login.loginWithCredentials();
			await pomManager.header.clickCartButton();

			await pomManager.cart.verifyProductInCart(productName);
			await pomManager.checkout.verifyProductName(productName);
			await pomManager.checkout.verifyProductPrice(productName, productPrice);
		});
	});

	test("Test Case 21: Add review on product", async ({ pomManager }) => {
		const productName = "Blue Top";

		await test.step("Navigate to product details page", async () => {
			await pomManager.header.clickProductButton();
			await pomManager.allProducts.verifyProductPage();
			await pomManager.allProducts.clickViewProductButton(productName);
		});

		await test.step("Submit product review", async () => {
			await pomManager.productDetails.verifyWriteYourReviewText();
			await pomManager.productDetails.fillAndSubmitReview();
			await pomManager.productDetails.verifySuccessMessage();
		});
	});

	test("Test Case 22: Add to cart from Recommended items", async ({ pomManager }) => {
		const productName = "Blue Top";
		let productPrice: number;

		await test.step("Add recommended product to cart", async () => {
			await pomManager.home.scrollToRecommened();
			await pomManager.home.verifyRecommendedHeading();

			productPrice = await pomManager.home.getProductPriceFromRecommended(productName);
			await pomManager.home.addRecommendedItemToCartByName(productName);
			await pomManager.home.clickViewCartButton();
		});

		await test.step("Verify product details in cart", async () => {
			await pomManager.cart.verifyProductInCart(productName);
			await pomManager.cart.verifyProductName(productName);
			await pomManager.cart.verifyProductPrice(productName, productPrice);
		});
	});
});
