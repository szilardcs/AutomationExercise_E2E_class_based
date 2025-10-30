import { Page } from "@playwright/test";
import { Header } from "./Header";
import { HomePage } from "./Home.page";
import { LoginPage } from "./account/Login.page";
import { SignupPage } from "./account/Signup.page";
import { AccountCreated } from "./account/AccountCreated.page";
import { AccountDeleted } from "./account/AccountDeleted.page";
import { ContactUs } from "./ContactUs.page";
import { TestCases } from "./TestCases.page";
import { AllProducts } from "./products/AllProducts.page";
import { ProductDetails } from "./products/ProductDetails.page";
import { Cart } from "./products/Cart.Page";
import { Checkout } from "./products/Checkout.page";
import { Payment } from "./products/Payment.page";
import { PaymentDone } from "./products/PaymentDone.page";

export default class ManagePage {
	constructor(private readonly page: Page) {}

	private _header?: Header;
	private _home?: HomePage;
	private _login?: LoginPage;
	private _signup?: SignupPage;
	private _accountCreated?: AccountCreated;
	private _accountDeleted?: AccountDeleted;
	private _contactUs?: ContactUs;
	private _testCases?: TestCases;
	private _allProducts?: AllProducts;
	private _productDetails?: ProductDetails;
	private _cart?: Cart;
	private _checkout?: Checkout;
	private _payment?: Payment;
	private _paymentDone?: PaymentDone;

	// lazy getters
	get header(): Header {
		return (this._header ??= new Header(this.page));
	}

	get home(): HomePage {
		return (this._home ??= new HomePage(this.page));
	}

	get login(): LoginPage {
		return (this._login ??= new LoginPage(this.page));
	}

	get signup(): SignupPage {
		return (this._signup ??= new SignupPage(this.page));
	}

	get accountCreated(): AccountCreated {
		return (this._accountCreated ??= new AccountCreated(this.page));
	}

	get accountDeleted(): AccountDeleted {
		return (this._accountDeleted ??= new AccountDeleted(this.page));
	}

	get contactUs(): ContactUs {
		return (this._contactUs ??= new ContactUs(this.page));
	}

	get testCases(): TestCases {
		return (this._testCases ??= new TestCases(this.page));
	}

	get allProducts(): AllProducts {
		return (this._allProducts ??= new AllProducts(this.page));
	}

	get productDetails(): ProductDetails {
		return (this._productDetails ??= new ProductDetails(this.page));
	}

	get cart(): Cart {
		return (this._cart ??= new Cart(this.page));
	}

	get checkout(): Checkout {
		return (this._checkout ??= new Checkout(this.page));
	}

	get payment(): Payment {
		return (this._payment ??= new Payment(this.page));
	}

	get paymentDone(): PaymentDone {
		return (this._paymentDone ??= new PaymentDone(this.page));
	}
}
