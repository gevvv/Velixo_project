import { test, expect, chromium } from '@playwright/test'
import { LoginPage } from '../src/pages/LoginPage'
import { ExcelPage } from '../src/pages/ExcelPage'
import { config } from '../config/config'

test('Validate Today() function in exel online', async () => {
    const browser = await chromium.launch();

    const context = await browser.newContext({
        recordVideo: {
          dir: './videos/', // Directory to save the video
          size: { width: 1280, height: 720 }, // Optional: set video resolution
        },
    })

    const page = await context.newPage();

    const loginPage = new LoginPage(page)
    const excelPage = new ExcelPage(page)

    page.setDefaultTimeout(10000)

    // Navigate to the Excel Online homepage
    await page.goto(config.urls.excelOnline)

    //Log in
    await loginPage.login(config.credentials.username, config.credentials.password)

     // Create a new blank Excel workbook and get the new page (tab)
    const newExcelPage = await excelPage.createBlankExcel()
    
    // Input =TODA() function in A2 cell
    await excelPage.inputFormulaInCell(newExcelPage, 'A2', '=TODAY()')

    // Close Technical Notification
    await excelPage.closeNotification(newExcelPage)
  
    // Get the data from A2 cell
    const cellData = await excelPage.getCellData(newExcelPage, 'A2');
    console.log('Cell A2 data:', cellData);
    
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB').replace(/\//g, '.')
    console.log('Date in my machine is: ', formattedDate )
    expect(cellData).toBe(formattedDate);

    await page.waitForTimeout(5000)
    await browser.close()
})