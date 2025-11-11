import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../Base.page";
import { createAccountInfoFaker, createAddressInfoFaker } from "../../factories/signup.factory";

export class SignupPage extends BasePage {
	// account info
	protected readonly accountHeader: Locator;
	protected readonly titleSelector: Locator;
	protected readonly passwordField: Locator;
	protected readonly dayBirth: Locator;
	protected readonly monthBirth: Locator;
	protected readonly yearBirth: Locator;
	protected readonly newsletter: Locator;
	protected readonly specialOffer: Locator;

	// address info
	protected readonly firstName: Locator;
	protected readonly lastName: Locator;
	protected readonly company: Locator;
	protected readonly address: Locator;
	protected readonly address2: Locator;
	protected readonly country: Locator;
	protected readonly state: Locator;
	protected readonly city: Locator;
	protected readonly zipcode: Locator;
	protected readonly mobileNumber: Locator;

	// submit
	protected readonly createAccountButton: Locator;

	constructor(protected readonly page: Page) {
		super(page);
		// account info
		this.accountHeader = page.getByRole("heading", { name: "Enter Account Information" });
		this.titleSelector = page.getByRole("radio", { name: " Mr." });
		this.passwordField = page.getByRole("textbox", { name: "Password *" });
		this.dayBirth = page.locator("#days");
		this.monthBirth = page.locator("#months");
		this.yearBirth = page.locator("#years");
		this.newsletter = page.getByRole("checkbox", { name: "Sign up for our newsletter!" });
		this.specialOffer = page.getByRole("checkbox", { name: "Receive special offers from our partners!" });

		// address info
		this.firstName = page.getByRole("textbox", { name: "First name *" });
		this.lastName = page.getByRole("textbox", { name: "Last name *" });
		this.company = page.getByRole("textbox", { name: "Company", exact: true });
		this.address = page.getByRole("textbox", { name: "Address * (Street address, P.O. Box, Company name, etc.)" });
		this.address2 = page.getByRole("textbox", { name: "Address 2", exact: true });
		this.country = page.getByRole("combobox", { name: "Country *" });
		this.state = page.getByRole("textbox", { name: "State *" });
		this.city = page.getByRole("textbox", { name: "City *" });
		this.zipcode = page.locator("#zipcode");
		this.mobileNumber = page.getByRole("textbox", { name: "Mobile Number *" });

		// submit button
		this.createAccountButton = page.getByRole("button", { name: "Create Account" });
	}

	async verifyHeader() {
		await expect(this.accountHeader).toBeVisible();
	}

	async checkNewsLetterBox() {
		await this.newsletter.check();
	}

	async checkSpecialOfferBox() {
		await this.specialOffer.check();
	}

	async fillAccountInfo() {
		const accountInfo = createAccountInfoFaker();
		await this.titleSelector.click();
		await this.passwordField.fill(accountInfo.password);
		await this.dayBirth.selectOption(accountInfo.day);
		await this.monthBirth.selectOption(accountInfo.month);
		await this.yearBirth.selectOption(accountInfo.year);
		await this.newsletter.check();
		await this.specialOffer.check();
	}

	async fillAddressInfoAndReturnData() {
		const addressInfo = createAddressInfoFaker();
		await this.firstName.fill(addressInfo.firstName);
		await this.lastName.fill(addressInfo.lastName);
		await this.company.fill(addressInfo.company);
		await this.address.fill(addressInfo.address);
		await this.address2.fill(addressInfo.address2);
		await this.country.selectOption(addressInfo.country);
		await this.state.fill(addressInfo.state);
		await this.city.fill(addressInfo.city);
		await this.zipcode.fill(addressInfo.zipcode);
		await this.mobileNumber.fill(addressInfo.mobileNumber);

		return addressInfo;
	}

	async clickCreateAccountButton() {
		await this.createAccountButton.click();
	}
}
