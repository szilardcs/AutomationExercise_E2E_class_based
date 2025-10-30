import { test } from "../fixtures/pomManager.fixture";
import { testUserData } from "../pages/account/Login.page";

test.describe("Checkout flows", async () => {
	test.beforeEach("Navigate to page", async ({ pomManager }) => {
		await pomManager.home.goToHomePageAndAssert();
	});

	test("Test Case 14: Place Order: Register during Checkout", async ({ pomManager }) => {
		let firstProduct: { listName: string; listPrice: number };
		let secondProduct: { listName: string; listPrice: number };
		let username: string;
		let addressData: any;

		await test.step("Add products to cart and try to checkout without logged in user", async () => {
			await pomManager.header.clickProductButton();

			// First product, 0 is index in the list
			firstProduct = {
				listName: await pomManager.allProducts.getProductNameFromlist(0),
				listPrice: await pomManager.allProducts.getProductPriceFromList(0),
			};
			await pomManager.allProducts.hoverAndClickAddToCart(0);
			await pomManager.allProducts.clickContinueShopping();

			// Second product
			secondProduct = {
				listName: await pomManager.allProducts.getProductNameFromlist(1),
				listPrice: await pomManager.allProducts.getProductPriceFromList(1),
			};
			await pomManager.allProducts.hoverAndClickAddToCart(1);
			await pomManager.allProducts.clickViewCartButton();

			await pomManager.cart.verifyPage();
			await pomManager.cart.clickCheckoutButton();
			await pomManager.cart.clickRegisterLogin();
		});

		await test.step("Complete registration and verify account", async () => {
			username = await pomManager.login.fillSignupNameAndReturnIt();
			await pomManager.login.fillSignupEmail();
			await pomManager.login.clickSignupButton();

			await pomManager.signup.fillAccountInfo();
			addressData = await pomManager.signup.fillAddressInfoAndReturnData();
			await pomManager.signup.clickCreateAccountButton();

			await pomManager.accountCreated.verifyCreatedText();
			await pomManager.accountCreated.clickContinueButton();
			await pomManager.header.expectLoggedIn(username);
		});

		await test.step("Complete checkout process", async () => {
			await pomManager.header.clickCartButton();
			await pomManager.cart.clickCheckoutButton();

			// Verify order details
			await pomManager.checkout.verifyDeliveryAddress(addressData);
			await pomManager.checkout.verifyBillingAddress(addressData);

			// First product, 0 is index in cart
			await pomManager.checkout.verifyProductName(0, firstProduct.listName);
			await pomManager.checkout.verifyProductPrice(0, firstProduct.listPrice);

			// Second product
			await pomManager.checkout.verifyProductName(1, secondProduct.listName);
			await pomManager.checkout.verifyProductPrice(1, secondProduct.listPrice);
			await pomManager.checkout.verifyCartTotal(firstProduct.listPrice, secondProduct.listPrice);
		});

		await test.step("Complete payment and cleanup", async () => {
			await pomManager.checkout.fillCommentAndPlaceOrder();
			await pomManager.payment.fillPaymentDetails();
			await pomManager.payment.clickPayAndConfirmButton();
			await pomManager.payment.verifySuccessfulOrder();
			await pomManager.header.clickDeleteAccountButton();
			await pomManager.accountDeleted.verifyDeletedText();
			await pomManager.accountDeleted.clickContinueButton();
		});
	});

	test("Test Case 15: Place Order: Register before Checkout", async ({ pomManager }) => {
		let firstProduct: { listName: string; listPrice: number };
		let secondProduct: { listName: string; listPrice: number };
		let username: string;
		let addressData: any;

		await test.step("Register new user account", async () => {
			await pomManager.header.clickSignupLoginButton();
			username = await pomManager.login.fillSignupNameAndReturnIt();
			await pomManager.login.fillSignupEmail();
			await pomManager.login.clickSignupButton();

			await pomManager.signup.fillAccountInfo();
			addressData = await pomManager.signup.fillAddressInfoAndReturnData();
			await pomManager.signup.clickCreateAccountButton();

			await pomManager.accountCreated.verifyCreatedText();
			await pomManager.accountCreated.clickContinueButton();
			await pomManager.header.expectLoggedIn(username);
		});

		await test.step("Add products to cart and proceed to checkout", async () => {
			await pomManager.header.clickProductButton();

			// First product, 0 is index in the list
			firstProduct = {
				listName: await pomManager.allProducts.getProductNameFromlist(0),
				listPrice: await pomManager.allProducts.getProductPriceFromList(0),
			};
			await pomManager.allProducts.hoverAndClickAddToCart(0);
			await pomManager.allProducts.clickContinueShopping();

			// Second product
			secondProduct = {
				listName: await pomManager.allProducts.getProductNameFromlist(1),
				listPrice: await pomManager.allProducts.getProductPriceFromList(1),
			};
			await pomManager.allProducts.hoverAndClickAddToCart(1);
			await pomManager.allProducts.clickViewCartButton();
			await pomManager.cart.verifyPage();
			await pomManager.cart.clickCheckoutButton();
		});

		await test.step("Verify order details and complete checkout", async () => {
			await pomManager.checkout.verifyBillingAddress(addressData);
			await pomManager.checkout.verifyDeliveryAddress(addressData);

			// First product, 0 is index in the cart
			await pomManager.checkout.verifyProductName(0, firstProduct.listName);
			await pomManager.checkout.verifyProductPrice(0, firstProduct.listPrice);

			// Second product
			await pomManager.checkout.verifyProductName(1, secondProduct.listName);
			await pomManager.checkout.verifyProductPrice(1, secondProduct.listPrice);
			await pomManager.checkout.verifyCartTotal(firstProduct.listPrice, secondProduct.listPrice);
		});

		await test.step("Complete payment and cleanup", async () => {
			await pomManager.checkout.fillCommentAndPlaceOrder();
			await pomManager.payment.fillPaymentDetails();
			await pomManager.payment.clickPayAndConfirmButton();
			await pomManager.payment.verifySuccessfulOrder();
			await pomManager.header.clickDeleteAccountButton();
			await pomManager.accountDeleted.verifyDeletedText();
			await pomManager.accountDeleted.clickContinueButton();
		});
	});

	test("Test Case 16: Place Order: Login before Checkout", async ({ pomManager }) => {
		let firstProduct: { listName: string; listPrice: number };
		let secondProduct: { listName: string; listPrice: number };

		await test.step("Login with existing user credentials", async () => {
			await pomManager.header.clickSignupLoginButton();
			await pomManager.login.loginWithCredentials();
			await pomManager.header.expectLoggedIn(testUserData.presetUser.name);
			await pomManager.cart.clearCartViaAPI();
		});

		await test.step("Add products to cart and proceed to checkout", async () => {
			await pomManager.header.clickProductButton();

			// First product, 0 is index in the list
			firstProduct = {
				listName: await pomManager.allProducts.getProductNameFromlist(0),
				listPrice: await pomManager.allProducts.getProductPriceFromList(0),
			};
			await pomManager.allProducts.hoverAndClickAddToCart(0);
			await pomManager.allProducts.clickContinueShopping();

			// Second product
			secondProduct = {
				listName: await pomManager.allProducts.getProductNameFromlist(1),
				listPrice: await pomManager.allProducts.getProductPriceFromList(1),
			};
			await pomManager.allProducts.hoverAndClickAddToCart(1);
			await pomManager.allProducts.clickViewCartButton();
			await pomManager.cart.verifyPage();
			await pomManager.cart.clickCheckoutButton();
		});

		await test.step("Verify order details and complete checkout", async () => {
			await pomManager.checkout.verifyBillingAddress(testUserData.presetUser.addressData);
			await pomManager.checkout.verifyDeliveryAddress(testUserData.presetUser.addressData);

			// First product, 0 is index in the cart
			await pomManager.checkout.verifyProductName(0, firstProduct.listName);
			await pomManager.checkout.verifyProductPrice(0, firstProduct.listPrice);

			// Second product
			await pomManager.checkout.verifyProductName(1, secondProduct.listName);
			await pomManager.checkout.verifyProductPrice(1, secondProduct.listPrice);
			await pomManager.checkout.verifyCartTotal(firstProduct.listPrice, secondProduct.listPrice);
		});

		await test.step("Complete payment process", async () => {
			await pomManager.checkout.fillCommentAndPlaceOrder();
			await pomManager.payment.fillPaymentDetails();
			await pomManager.payment.clickPayAndConfirmButton();
			await pomManager.payment.verifySuccessfulOrder();
			await pomManager.header.clickLogoutButton();
			// Note: Skipping account deletion for preset test user
		});
	});

	test("Test Case 23: Verify address details in checkout page", async ({ pomManager }) => {
		let username: string;
		let addressData: any;

		await test.step("Register new user account", async () => {
			await pomManager.header.clickSignupLoginButton();
			username = await pomManager.login.fillSignupNameAndReturnIt();
			await pomManager.login.fillSignupEmail();
			await pomManager.login.clickSignupButton();

			await pomManager.signup.fillAccountInfo();
			addressData = await pomManager.signup.fillAddressInfoAndReturnData();
			await pomManager.signup.clickCreateAccountButton();

			await pomManager.accountCreated.verifyCreatedText();
			await pomManager.accountCreated.clickContinueButton();
			await pomManager.header.expectLoggedIn(username);
		});

		await test.step("Add product to cart and proceed to checkout", async () => {
			await pomManager.header.clickProductButton();
			await pomManager.allProducts.hoverAndClickAddToCart(0);
			await pomManager.allProducts.clickViewCartButton();
			await pomManager.cart.verifyPage();
			await pomManager.cart.clickCheckoutButton();
		});

		await test.step("Verify address details match registration data", async () => {
			await pomManager.checkout.verifyDeliveryAddress(addressData);
			await pomManager.checkout.verifyBillingAddress(addressData);
		});

		await test.step("Delete account and cleanup", async () => {
			await pomManager.header.clickDeleteAccountButton();
			await pomManager.accountDeleted.verifyDeletedText();
			await pomManager.accountDeleted.clickContinueButton();
		});
	});

	test("Test Case 24: Download Invoice after purchase order", async ({ pomManager }) => {
		let username: string;
		let addressData: any;

		await test.step("Add product to cart and initiate checkout as guest", async () => {
			await pomManager.header.clickProductButton();

			// 0 is index of first product on the list
			await pomManager.allProducts.hoverAndClickAddToCart(0);
			await pomManager.allProducts.clickViewCartButton();
			await pomManager.cart.verifyPage();
			await pomManager.cart.clickCheckoutButton();
			await pomManager.cart.clickRegisterLogin();
		});

		await test.step("Register new user account", async () => {
			username = await pomManager.login.fillSignupNameAndReturnIt();
			await pomManager.login.fillSignupEmail();
			await pomManager.login.clickSignupButton();

			await pomManager.signup.fillAccountInfo();
			addressData = await pomManager.signup.fillAddressInfoAndReturnData();
			await pomManager.signup.clickCreateAccountButton();

			await pomManager.accountCreated.verifyCreatedText();
			await pomManager.accountCreated.clickContinueButton();
			await pomManager.header.expectLoggedIn(username);
		});

		await test.step("Complete checkout and payment process", async () => {
			await pomManager.header.clickCartButton();
			await pomManager.cart.clickCheckoutButton();

			await pomManager.checkout.verifyDeliveryAddress(addressData);
			await pomManager.checkout.verifyBillingAddress(addressData);
			await pomManager.checkout.fillCommentAndPlaceOrder();

			await pomManager.payment.fillPaymentDetails();
			await pomManager.payment.clickPayAndConfirmButton();
			await pomManager.payment.verifySuccessfulOrder();
		});

		await test.step("Download invoice and cleanup", async () => {
			await pomManager.paymentDone.downloadInvoice();
			await pomManager.paymentDone.clickContinueButton();
			await pomManager.header.clickDeleteAccountButton();
			await pomManager.accountDeleted.verifyDeletedText();
			await pomManager.accountDeleted.clickContinueButton();
		});
	});
});
