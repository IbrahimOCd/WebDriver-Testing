class Books{

    open(){
        return browser.url("/");
    }
    async ClickOnBookLink(){
       return await browser.$("(//ul[contains(@class,'flex flex-col')]//a)[2]");
    }
    async GotoBook(){
        return await browser.url("http://127.0.0.1:8000/books/");
     }

    async CheckTitle(){
        const Title= await browser.getTitle();
        return  await Title;
    }
   
    async SubmitAbook(Name){
        const searchInput = await browser.$("//input[@placeholder='search']"); 
        await searchInput.waitForExist({ timeout: 5000 });
        await searchInput.addValue(Name); 
    }
    async ClickSearch(){
       return await browser.$("//button[@type='submit']");
    }
    async GetNameOfBook(){
       return await browser.$("//div[@class='p-4 bg-gray-200']//h2[1]").getText();
    }
    async VisitAbook(bookName){
        return await browser.$(`//h2[text()='${bookName}']/following-sibling::button[text()='Visit']`);
    }
    async NumberOfDays(){
        return await browser.$("//input[@type='number']");
    }

    async SubmitNumberOfDays(Number){
       const NumberOfDays= await browser.$("//input[@type='number']");
       await NumberOfDays.waitForExist({ timeout: 5000 });
       await NumberOfDays.addValue(Number);
    }
    async ConfirmRent(){
        return await browser.$("(//button[@type='submit'])[2]");
    }
    async NumberOnCart(){
        return await browser.$("//a[contains(@class,'flex text-white')]//span[1]");
    }
    async ClickOnCart(){
        return await browser.$("//a[contains(@class,'flex text-white')]").click();
    }
    async CheckTheBook(bookName){
        return await browser.$(`//p[text()='   ${bookName} ']`);
    }
    async Checkout(){
        return await browser.$("//div[@class='ml-4']//a[1]");
    }
}
export default new Books();