import Books from "../pages/Books";
import BooksJson from "../data/Books.json"

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
        await Books.GotoBook(); 
        continue;
    }
        await Books.SubmitNumberOfDays(2);
        const Confirm= await Books.ConfirmRent();
        await Confirm.click();
        rentedBooksCount++;

        const NumberOnCart= await Books.NumberOnCart();
        await expect(NumberOnCart).toEqual(`(${rentedBooksCount})`);
        await Books.ClickOnCart();
        const NameBook = await Books.CheckTheBook(bookName);
        await expect(NameBook).toEqual(bookName);
        await Books.GotoBook(); 
     } catch (error) {
        console.error(`Error processing book: ${bookName}`, error);
        throw error;
        }
    }
    });

});