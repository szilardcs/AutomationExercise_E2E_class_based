import { DatatypeModule, faker } from "@faker-js/faker";

export function createContactInfoFaker() {
	return {
		name: faker.internet.username(),
		email: faker.internet.email(),
		subject: faker.lorem.sentence(4),
		message: faker.lorem.paragraphs(3),
	};
}
