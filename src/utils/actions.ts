import { Page, Locator, FrameLocator, expect } from '@playwright/test';

/**
 * Waits for an element to become visible within the given timeout.
 * @param object - The page or frame context.
 * @param locator - The locator of the element.
 * @param timeout - Maximum time to wait in milliseconds (default: 60 seconds).
 * @returns Promise<boolean> - True if the element is visible, false otherwise.
 */
export async function waitForElementVisible(object: Page | Locator, locator: string,timeout: number = 60000): Promise<boolean> {
	try {
		await object.locator(locator).waitFor({ state: 'visible', timeout });
		return true;
	} catch {
		return false;
	}
}

/**
 * Checks if an element is visible and throws an error if not.
 * @param object - The page, locator, or frame context.
 * @param locatorOrResolvedLocator - The locator of the element or an already resolved locator.
 * @param timeout - Maximum time to wait in milliseconds (default: 2 seconds).
 * @returns Promise<boolean> - True if the element is visible.
 */
export async function isElementVisible(
    object: Page | Locator | FrameLocator,
    locatorOrResolvedLocator: string | Locator,
    timeout: number = 2000
): Promise<boolean> {
    const resolvedLocator = typeof locatorOrResolvedLocator === 'string'
        ? object.locator(locatorOrResolvedLocator)
        : locatorOrResolvedLocator;

    try {
		await expect(async () => {
			await resolvedLocator.waitFor({ state: 'visible', timeout });
		}).toPass()
        return true;
    } catch {
        throw new Error(`Element not found or not visible: ${locatorOrResolvedLocator}`);
    }
}

/**
 * Clicks an element, optionally performing key presses during or after the click.
 * @param object - The page, frame context, or locator.
 * @param locator - The locator of the element or an already resolved locator.
 * @param timeout - Maximum time to wait for visibility (default: 2 seconds).
 * @param keyCombination - Optional key press or combination (e.g., 'Enter', 'Control+Enter').
 */

export async function clickElement(
    object: Page | Locator | FrameLocator,
    locator: string,
    timeout: number = 2000,
    keyCombination?: string | string[]
): Promise<void> {
    // Ensure the element is visible before clicking
    await isElementVisible(object, locator, timeout);

    if ('locator' in object && 'click' in object) {
        // If the object is a Page, resolve the locator and click
        const pageOrFrame = object as Page | FrameLocator;
        await pageOrFrame.locator(locator).click();

        if (keyCombination && 'keyboard' in object) {
            // Handle optional key presses for Page
            const page = object as Page;
            if (Array.isArray(keyCombination)) {
                for (const key of keyCombination) {
                    await page.keyboard.press(key);
                }
            } else {
                await page.keyboard.press(keyCombination);
            }
        }
    } else if (isLocator(object)) {
        // If the object is a Locator, click directly
        await object.click();
    } else if ('locator' in object) {
        // If the object is a FrameLocator, handle keyCombination or click
        const frameLocator = object as FrameLocator;
        const resolvedLocator = frameLocator.locator(locator);

        if (keyCombination) {
            // Handle key presses inside the resolved frame
            if (Array.isArray(keyCombination)) {
                for (const key of keyCombination) {
                    await resolvedLocator.press(key);
                }
            } else {
				console.log(`Sending ${keyCombination} keycombination to ${locator} locator`)
                await resolvedLocator.press(keyCombination);
            }
        } else {
            // Click the resolved locator if no keyCombination is specified
            await resolvedLocator.click();
        }
    } else {
        throw new Error('Unsupported object type for clickElement');
    }
}



/**
 * Type guard to check if an object is a Locator.
 * @param object - The object to check.
 * @returns True if the object is a Locator, false otherwise.
 */
function isLocator(object: any): object is Locator {
    return 'click' in object && !('locator' in object);
}


/**
 * Fills a field with the specified value after ensuring visibility.
 * @param object - The page, locator, or frame context.
 * @param locatorOrResolvedLocator - The locator of the field or an already resolved locator.
 * @param value - The value to input.
 * @param timeout - Maximum time to wait for visibility (default: 2 seconds).
 */
export async function fillField(
    object: Page | Locator | FrameLocator,
    locatorOrResolvedLocator: string | Locator,
    value: string,
    timeout: number = 2000
): Promise<void> {
    const resolvedLocator = typeof locatorOrResolvedLocator === 'string'
        ? object.locator(locatorOrResolvedLocator)
        : locatorOrResolvedLocator;

    await isElementVisible(object, resolvedLocator, timeout);
    await resolvedLocator.fill(value);
}


/**
 * Checks if the page has fully loaded based on specific conditions.
 * @param object - The page context.
 * @param timeout - Maximum time to wait for the page to load (default: 60 seconds).
 * @returns Promise<boolean> - True if the page has loaded, false otherwise.
 */
export async function hasPageLoaded(object: Page, timeout: number = 60000): Promise<boolean> {
	try {
		await object.waitForLoadState('load', { timeout });
		return true;
	} catch {
		return false;
	}
}


export async function typeText(
    object: Page | FrameLocator | Locator,
    locator: string,
    text: string,
    timeout: number = 2000
): Promise<void> {
    await isElementVisible(object, locator, timeout);

    if ('locator' in object) {
        // If object is a Page or FrameLocator, resolve locator and type
        const resolvedLocator = object.locator(locator);
        await resolvedLocator.type(text);
    } else if ('type' in object) {
        // If object is a Locator, type directly
        const locatorObject = object as Locator;
        await locatorObject.type(text);
    } else {
        throw new Error('Unsupported object type for typeText');
    }
}

