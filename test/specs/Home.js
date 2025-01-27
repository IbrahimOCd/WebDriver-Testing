import Home from "../pages/Home";



    describe('Home', () => {

    beforeEach(async () => {
         await Home.open();
    })

    
    it('Getting Title Then Check it', async () => {
        const Title = await Home.GetTitle(); 
        const titleText = await Title.getText(); 
        console.log("The Title is:", titleText);
        await expect(titleText).toEqual("LibraryStore");
    });

    it('Get the text of all menu items & assert them', async () => {
        const expectedLinks = [
            "Home",
            "Books",
            "On-Site Consultation",
            "Contact",
            "Explore"
        ];
    
        const actualLinks = [];
        const navElements = await Home.GetNavbar();
        
        for (let i = 0; i < navElements.length; i++) {
            const text = await navElements[i].getText();
            actualLinks.push(text);
        }
    
        await expect(actualLinks).toEqual(expectedLinks);
    });

    it('Cekck if The button is Clickable', async () => {
        const { Login, Signup, cart } = await Home.GetLinks();
        await Login.waitForDisplayed();
        await Login.click();
    
        await Signup.waitForDisplayed();
        await Signup.click();
    
        await cart.waitForDisplayed();
        await cart.click();
    });
    
    it('Checking Explore Button', async () => {
        const exploreButton = await Home.ExploreButton();
        await exploreButton.click();
        
        const currentUrl = await browser.getUrl();
        expect(currentUrl).toContain('books'); 
    });
    

    it('Send an email to subscribe', async() => {
        await Home.inputEmail("Brahimoussiddi@gmail.com");
        const subscribeButton = await Home.subscribe();
        await subscribeButton.waitForDisplayed();
        await subscribeButton.click();
    });
});