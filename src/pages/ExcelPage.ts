import { Page } from '@playwright/test'
import { excelLocators } from '../locators/excelLocators'
import { isElementVisible, fillField, hasPageLoaded, clickElement, typeText } from '../utils/actions'

export class ExcelPage {
    constructor(private page: Page) {}

    /**
     * Creates a new blank Excel workbook by opening a new tab.
     * Ensures the new tab is fully loaded before returning it.
     * @returns Promise<Page> - The newly opened Excel tab.
     */
    async createBlankExcel(): Promise<Page> {
        const DEFAULT_TIMEOUT = 30000; // Default timeout for initial interactions

         // Wait for a new page (tab) to open after clicking "Blank workbook"
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'), // Wait for the new tab
            clickElement(this.page, excelLocators.createBlankWorkbookButton, DEFAULT_TIMEOUT) // Click the button
        ]);

        // Ensure the new page is fully loaded before returning
        if (!(await hasPageLoaded(newPage))) {
            throw new Error('The new Excel page did not load correctly');
        }

        return newPage; 
    }

    /**
     * Inputs a formula into a specific cell in the Excel sheet.
     * Ensures all elements are visible and actions are completed step-by-step.
     * @param newExcelPage - The newly opened Excel page (tab).
     * @param cellName - The name of the cell to input the formula (e.g., "A2").
     * @param formula - The formula to input (e.g., "=TODAY()").
     */
    async inputFormulaInCell(newExcelPage: Page, cellName: string, formula: string): Promise<void> {
        const DEFAULT_TIMEOUT = 10000; // Default timeout for visibility checks
        const iframe = newExcelPage.frameLocator('#WacFrame_Excel_0');

        // Ensure the cell input field is visible
        const cellInputField = iframe.locator(excelLocators.cellInputSelector)
        await isElementVisible(iframe, excelLocators.cellInputSelector, DEFAULT_TIMEOUT)

        // Fill in the cell name to select the desired cell
        await clickElement(iframe, excelLocators.cellInputSelector, DEFAULT_TIMEOUT)
        await fillField(iframe, excelLocators.cellInputSelector, cellName, DEFAULT_TIMEOUT)
        
        // Confirm cell selection by pressing Enter
        await clickElement(iframe, excelLocators.cellInputSelector, DEFAULT_TIMEOUT, 'Enter')

        // Type the formula into the selected cell
        await clickElement(iframe, excelLocators.formulaInputSelector, DEFAULT_TIMEOUT)
        await typeText(iframe, excelLocators.formulaInputSelector, formula, DEFAULT_TIMEOUT)
        //await newExcelPage.keyboard.type(formula);

        // Confirm the formula input by pressing Control+Enter
        await clickElement(iframe, excelLocators.formulaInputSelector, DEFAULT_TIMEOUT, 'Control+Enter')
    }


    /**
     * Closes any notification pop-ups in the Excel sheet.
     * Uses iframe to locate the notification layer and makes it visible before attempting to close it.
     * Ensures smooth operation by waiting for the notification to appear and closing it if present.
     * @param newExcelPage - The newly opened Excel page (tab).
     */
    async closeNotification(newExcelPage: Page): Promise<void> {
        //await newExcelPage.waitForTimeout(6000)
        const iframe = await newExcelPage.frameLocator('#WacFrame_Excel_0');

        await iframe.locator('#fluent-default-layer-host').evaluate((el) => {
            el.style.display = 'block';
            el.style.visibility = 'visible';
        });

        await newExcelPage.waitForTimeout(2000)
        await iframe.locator('button[aria-label="Close"]').click();
    }


    /**
     * Retrieves the data contained in a specific cell within the Excel sheet.
     * Uses the cell's aria-label attribute to extract and return its content.
     * Ensures the cell data is retrieved reliably by locating the correct cell element.
     * @param newExcelPage - The newly opened Excel page (tab).
     * @param cellName - The name of the cell to retrieve data from (e.g., "A1").
     * @returns Promise<string> - The extracted data from the specified cell.
     * @throws Error if the cell data cannot be retrieved.
     */
    async getCellData(newExcelPage: Page, cellName: string): Promise<string> {
        const DEFAULT_TIMEOUT = 10000; // Default timeout for visibility checks

        const iframe = await newExcelPage.frameLocator('#WacFrame_Excel_0');
        const fontSizeInput = iframe.locator('#FontSize-input');
        await fontSizeInput.waitFor({ state: 'visible' });
        
        await fontSizeInput.fill("8")
        await fontSizeInput.press('Enter')
        
        // Find the cell input field by its name
        // await iframe.locator(excelLocators.cellInputSelector).fill(cellName)
        // await iframe.locator(excelLocators.cellInputSelector).press('Enter');

        // Retrieve the aria-label of the cell
        const element = await iframe.locator(`label[aria-label*="${cellName}"]`).nth(0);
        const ariaLabel = await element.getAttribute('aria-label');

        // Extract and return only the data from the aria-label
        if (ariaLabel) {
            const cellData = ariaLabel.split(' . ')[0];
            return cellData;
        }
        throw new Error(`Unable to retrieve data for cell ${cellName}`);
    }
}