import { DatatypeModule, faker } from "@faker-js/faker";

export function createPaymentInfoFaker() {
	return {
		nameOnCard: faker.person.fullName(),
		cardNumber: faker.finance.creditCardNumber(),
		cvc: faker.finance.creditCardCVV(),
		expMonth: faker.number.int({ min: 1, max: 12 }).toString().padStart(2, "0"),
		expYear: faker.number.int({ min: 2025, max: 2035 }).toString(),
	};
}
