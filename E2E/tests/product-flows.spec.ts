import { test } from "../fixtures/pomManager.fixture";

test.describe("Product flows", async () => {
	test.beforeEach("Navigate to page", async ({ pomManager }) => {
		await pomManager.home.goToHomePageAndAssert();
	});

	test("Test Case 8: Verify All Products and product detail page", async ({ pomManager }) => {
		let productName: string;
		let productPrice: number;

		await test.step("Navigate to products page and verify", async () => {
			await pomManager.header.clickProductButton();
			await pomManager.allProducts.verifyProductPage();
			await pomManager.allProducts.verifyProductList();
		});

		await test.step("Get first product details and navigate to details page", async () => {
			productName = await pomManager.allProducts.getProductNameFromlist(0);
			productPrice = await pomManager.allProducts.getProductPriceFromList(0);
			await pomManager.allProducts.clickViewProductButton(0);
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
		let firstProduct: { listName: string; listPrice: number; quantity?: number };
		let secondProduct: { listName: string; listPrice: number; quantity?: number };

		await test.step("Navigate to products page", async () => {
			await pomManager.header.clickProductButton();
		});

		await test.step("Add first product to cart and continue shopping", async () => {
			// First product, 0 is index on list
			await pomManager.allProducts.hoverAndClickAddToCart(0);
			firstProduct = {
				listName: await pomManager.allProducts.getProductNameFromlist(0),
				listPrice: await pomManager.allProducts.getProductPriceFromList(0),
			};
			await pomManager.allProducts.clickContinueShopping();
		});

		await test.step("Add second product to cart and view cart", async () => {
			// Second product, 1 is index on list
			await pomManager.allProducts.hoverAndClickAddToCart(1);
			secondProduct = {
				listName: await pomManager.allProducts.getProductNameFromlist(1),
				listPrice: await pomManager.allProducts.getProductPriceFromList(1),
			};
			await pomManager.allProducts.clickViewCartButton();
		});

		await test.step("Verify cart contents and calculations", async () => {
			// Verify products exist in cart
			await pomManager.cart.verifyProductInCart(0);
			await pomManager.cart.verifyProductInCart(1);

			// First product verification
			await pomManager.cart.verifyProductPrice(0, firstProduct.listPrice);
			await pomManager.cart.verifyProductName(0, firstProduct.listName);
			firstProduct.quantity = await pomManager.cart.verifyProductQuantity(0, 1); // index, expected quantity
			await pomManager.cart.verifyProductTotal(0, firstProduct.listPrice, firstProduct.quantity);

			// Second product verification
			await pomManager.cart.verifyProductPrice(1, secondProduct.listPrice);
			await pomManager.cart.verifyProductName(1, secondProduct.listName);
			secondProduct.quantity = await pomManager.cart.verifyProductQuantity(1, 1); // index, expected quantity
			await pomManager.cart.verifyProductTotal(1, secondProduct.listPrice, secondProduct.quantity);
		});
	});

	test("Test Case 13: Verify Product quantity in Cart", async ({ pomManager }) => {
		let productQuantity: number = 4;
		let productDetails: { productName: string; productPrice: number };

		await test.step("Navigate to product details and set quantity", async () => {
			productDetails = {
				productName: await pomManager.home.getProductNameFromlist(0),
				productPrice: await pomManager.home.getProductPriceFromList(0),
			};
			await pomManager.home.clickViewProductButton(0);
			await pomManager.productDetails.verifyPage();
			await pomManager.productDetails.setProductQuantity(productQuantity);
		});

		await test.step("Add product to cart and navigate to cart", async () => {
			await pomManager.productDetails.addProductToCart();
			await pomManager.productDetails.clickViewCartButton();
		});

		await test.step("Verify product quantity and total in cart", async () => {
			await pomManager.cart.verifyProductQuantity(0, productQuantity);
			await pomManager.cart.verifyProductTotal(0, productDetails.productPrice, productQuantity);
		});
	});

	test("Test Case 17: Remove Products From Cart", async ({ pomManager }) => {
		await test.step("Add products to cart and navigate to cart page", async () => {
			await pomManager.header.clickProductButton();

			// First product, 0 is index in list
			await pomManager.allProducts.hoverAndClickAddToCart(0);
			await pomManager.allProducts.clickContinueShopping();

			// Second product
			await pomManager.allProducts.hoverAndClickAddToCart(1);
			await pomManager.allProducts.clickViewCartButton();
			await pomManager.cart.verifyPage();
		});

		await test.step("Remove products and verify empty cart", async () => {
			await pomManager.cart.removeProductFromCart(0);
			await pomManager.cart.removeProductFromCart(1);
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

			// "Women" is category, 1 is index of subcategory
			await pomManager.allProducts.clickSubcategoryByNameAndIndex("Women", 1);
			await pomManager.allProducts.verifyCategoryHeading("WOMEN - TOPS PRODUCTS");
		});

		await test.step("Test Men category subcategories", async () => {
			await pomManager.allProducts.clickCategoryMen();

			// "Men" is category, 0 is index of subcategory
			await pomManager.allProducts.clickSubcategoryByNameAndIndex("Men", 0);
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
			await pomManager.allProducts.clickOnBrandByIndex(0);
			await pomManager.allProducts.verifyBrandHeading("Polo");

			// Second brand
			await pomManager.allProducts.clickOnBrandByIndex(1);
			await pomManager.allProducts.verifyBrandHeading("H&M");
		});
	});

	test("Test Case 20: Search Products and Verify Cart After Login", async ({ pomManager }) => {
		let product: { listName: string; listPrice: number };

		await test.step("Search for product and add to cart", async () => {
			await pomManager.header.clickProductButton();
			await pomManager.allProducts.verifyProductPage();
			await pomManager.allProducts.searchProduct("Blue Top");
			await pomManager.allProducts.verifySearchedProduct("Blue Top");

			product = {
				listName: await pomManager.allProducts.getProductNameFromlist(0),
				listPrice: await pomManager.allProducts.getProductPriceFromList(0),
			};
			await pomManager.allProducts.hoverAndClickAddToCart(0);
			await pomManager.allProducts.clickViewCartButton();
		});

		await test.step("Verify product in cart before login", async () => {
			await pomManager.cart.verifyProductInCart(0);
			await pomManager.checkout.verifyProductName(0, product.listName);
			await pomManager.checkout.verifyProductPrice(0, product.listPrice);
		});

		await test.step("Login and verify cart persistence", async () => {
			await pomManager.header.clickSignupLoginButton();
			await pomManager.login.loginWithCredentials();
			await pomManager.header.clickCartButton();

			await pomManager.cart.verifyProductInCart(0);
			await pomManager.checkout.verifyProductName(0, product.listName);
			await pomManager.checkout.verifyProductPrice(0, product.listPrice);
		});
	});

	test("Test Case 21: Add review on product", async ({ pomManager }) => {
		await test.step("Navigate to product details page", async () => {
			await pomManager.header.clickProductButton();
			await pomManager.allProducts.verifyProductPage();
			await pomManager.allProducts.clickViewProductButton(0);
		});

		await test.step("Submit product review", async () => {
			await pomManager.productDetails.verifyWriteYourReviewText();
			await pomManager.productDetails.fillAndSubmitReview();
			await pomManager.productDetails.verifySuccessMessage();
		});
	});

	test("Test Case 22: Add to cart from Recommended items", async ({ pomManager }) => {
		let product: { recommendedName: string; recommendedPrice: number };

		await test.step("Add recommended product to cart", async () => {
			await pomManager.home.scrollToRecommened();
			await pomManager.home.verifyRecommendedHeading();

			product = {
				recommendedName: await pomManager.home.getProductNameFromRecommended(0),
				recommendedPrice: await pomManager.home.getProductPriceFromRecommended(0),
			};
			await pomManager.home.addRecommendedItemToCartByIndex(0);
			await pomManager.home.clickViewCartButton();
		});

		await test.step("Verify product details in cart", async () => {
			await pomManager.cart.verifyProductName(0, product.recommendedName);
			await pomManager.cart.verifyProductPrice(0, product.recommendedPrice);
			await pomManager.cart.verifyProductInCart(0);
		});
	});
});
