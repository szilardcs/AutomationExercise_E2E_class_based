import { test as base } from "@playwright/test";
import PomManager from "../pages/Manager.page";

type Myfixtures = {
	pomManager: PomManager;
};

export const test = base.extend<Myfixtures>({
	pomManager: async ({ page }, use) => {
		await use(new PomManager(page));
	},
});

export { expect } from "@playwright/test";
