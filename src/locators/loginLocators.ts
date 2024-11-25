export const loginLocators = {
    signInButton: 'text="Sign in"',
    emailInput: 'input[type="email"]',
    passwordInput: 'input[type="password"]',
    userNameSubmitBtn: 'input[type="submit"]',
    passSubmitBtn: 'button[type="submit"]',
    kmsiTitle: '#kmsiTitle',
    textButtonContainer: '[data-testid="textButtonContainer"]',
    acceptButton: '#acceptButton',
    emailScreenHeader: 'div#loginHeader:has-text("Sign in")', // Locator for the "Sign in" header
    userDisplayName: 'div#userDisplayName', // Locator for the username (email) displayed
    passwordScreenHeader: 'div#loginHeader:has-text("Enter password")', // Locator for the "Enter password" header
}