import { Page } from '@playwright/test'
import { loginLocators } from '../locators/loginLocators'
import { clickElement, fillField, isElementVisible, hasPageLoaded } from '../utils/actions'

export class LoginPage {
    constructor(private page: Page) {}
    
    /**
     * Logs into the application with the given credentials.
     * @param username - The user's email or username.
     * @param password - The user's password.
     * @param options - Optional parameters (e.g., checkPageLoaded: ensures the page is fully loaded after login).
     */
    
    async login(username: string, password: string,  options: { checkPageLoaded?: boolean } = { checkPageLoaded: true }) {
        const DEFAULT_TIMEOUT = 30000 // Default timeout for the first interaction

        // Ensure the email screen is loaded
        await clickElement(this.page, loginLocators.signInButton, DEFAULT_TIMEOUT);
        if (!(await isElementVisible(this.page, loginLocators.emailScreenHeader))) {
            throw new Error('Email screen did not load correctly');
        }

        // Fill in the username/email field
        await fillField(this.page, loginLocators.emailInput, username, DEFAULT_TIMEOUT)

        // Click the "Next" button after entering username/email
        await clickElement(this.page, loginLocators.userNameSubmitBtn, DEFAULT_TIMEOUT)


        // Ensure the password screen is loaded and the correct email is displayed
        // if (!(await isElementVisible(this.page, loginLocators.userDisplayName))) {
        //     throw new Error('User display name is not visible after entering email');
        // }

        // Verify that the displayed email matches the provided username
        const displayedEmail = await this.page.locator(loginLocators.userDisplayName).textContent();
        if (displayedEmail?.trim() !== username) {
            throw new Error(`Displayed email (${displayedEmail?.trim()}) does not match provided username (${username})`);
        }

        if (!(await isElementVisible(this.page, loginLocators.passwordScreenHeader))) {
            throw new Error('Password screen did not load correctly');
        }

         // Fill in the password field
        await fillField(this.page, loginLocators.passwordInput, password, DEFAULT_TIMEOUT)

        // Click the "Sign In" button after entering password
        await clickElement(this.page, loginLocators.passSubmitBtn, DEFAULT_TIMEOUT)
        
        // Handle "Stay signed in?" prompt
        const kmsiTitle = this.page.locator(loginLocators.kmsiTitle);
        if (await isElementVisible(this.page, loginLocators.kmsiTitle)) {
            const titleText = await kmsiTitle.textContent();
            if (titleText?.trim() === 'Stay signed in?') {
                const acceptButton = this.page.locator(`${loginLocators.textButtonContainer} >> ${loginLocators.acceptButton}`);
                
                // Ensure the "Accept" button in the prompt is visible
                if (!(await isElementVisible(this.page, `${loginLocators.textButtonContainer} >> ${loginLocators.acceptButton}`))) {
                    throw new Error('Accept button in "Stay signed in?" prompt is not visible');
                }

                // Click the "Accept" button
                await clickElement(this.page, `${loginLocators.textButtonContainer} >> ${loginLocators.acceptButton}`, DEFAULT_TIMEOUT);
            }
        }
        
        // Verify the page has fully loaded after login, if specified
        if (options.checkPageLoaded && !(await hasPageLoaded(this.page))) {
            throw new Error('Page did not load correctly after login');
        }
    }
}