import Books from "../pages/Books";
import BooksJson from "../data/Books.json"
const allure = import('allure-commandline')
const fs = require('fs');

describe('Books', () => {


    beforeEach(async () => {
        await Books.open();
        const LinkBook= await Books.ClickOnBookLink();
        await LinkBook.click();
    })
        
    it('Check Title', async () => {
        const Title= await Books.CheckTitle();
        expect(Title).toEqual("Books | LibraryStore");
    });

    it('Search About a book then check if the book exists', async () => {
        
        for (const bookName of BooksJson.books) {
            await Books.SubmitAbook(bookName);
            const SearchButton = await Books.ClickSearch();
            await SearchButton.click();
            const ExpectedBook = await Books.GetNameOfBook()
            expect(ExpectedBook).toEqual(bookName);
        }
    });

    it('Try To rent a book', async () => {
        let rentedBooksCount = 0; 

        
        for (const bookName of BooksJson.books) {
        try {
        const button = await Books.VisitAbook(bookName);
        button.waitForDisplayed({ timeout: 5000 });
        await button.click();

        const SubmitNumberOfDays=await Books.NumberOfDays();

        const isNumberInputAvailable = await SubmitNumberOfDays.isExisting();

        if (!isNumberInputAvailable) {
            console.log(`Book "${bookName}" is off loan. Skipping to next book.`);
            const screenshotPath = `./screenshots/${bookName}_off_loan.png`;
            await browser.saveScreenshot(screenshotPath);  // Save the screenshot
        
            // Attach the screenshot to Allure report
            const screenshotData = fs.readFileSync(screenshotPath);  // Read screenshot file
            if (typeof allure !== 'undefined' && typeof allure.addAttachment === 'function') {
                allure.addAttachment(`Off Loan Screenshot for ${bookName}`, screenshotData, 'image/png');
            } else {
                console.error('Allure not configured correctly for attachment.');
            }
        
            await Books.GotoBook(); 
            continue;
        }
        await Books.SubmitNumberOfDays(2);
        const Confirm= await Books.ConfirmRent();
        await Confirm.click();
        rentedBooksCount++;
        await Books.ClickOnCart();
        const NameBook = await Books.CheckTheBook(bookName);
        await NameBook.waitForDisplayed({timeout: 5000 });
        const Name= await NameBook.getText();
        await expect(Name).toEqual(bookName);
        const NumberOnCart= await Books.NumberOnCart();
        await NumberOnCart.waitForDisplayed({timeout: 5000 });
        const Number =await  NumberOnCart.getText();
        await expect(Number).toEqual(`(${rentedBooksCount})`);
        await Books.GotoBook(); 
     } catch (error) {
        console.error(`Error processing book: ${bookName}`, error);
        throw error;
        }
    }
    });

});
