import { faker } from "@faker-js/faker";

export function createAccountInfoFaker() {
	return {
		name: faker.internet.username(),
		email: faker.internet.email(),
		password: faker.internet.password(),
		day: faker.number.int({ min: 1, max: 31 }).toString(),
		month: faker.date.month(),
		year: faker.number.int({ min: 1925, max: 2025 }).toString(),
	};
}

export function createAddressInfoFaker() {
	return {
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		company: faker.company.name(),
		address: faker.location.streetAddress(),
		address2: faker.location.secondaryAddress(),
		country: "Canada",
		state: faker.location.state(),
		city: faker.location.city(),
		zipcode: faker.location.zipCode(),
		mobileNumber: faker.phone.number(),
	};
}

export interface AddressData {
	firstName: string;
	lastName: string;
	company: string;
	address: string;
	address2: string;
	country: string;
	state: string;
	city: string;
	zipcode: string;
	mobileNumber: string;
}
