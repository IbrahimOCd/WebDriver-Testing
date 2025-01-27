class Home{

    open(){
        return browser.url("/");
    }

    async  GetTitle(){
        return await browser.$("//a[@class='flex items-center']//span[1]"); 
    }

    async GetNavbar() {
        return await browser.$$("//a[contains(@class, 'block') or contains(@class, 'text-base')]");
    }
    async GetLinks() {
        const Login = await browser.$('//a[@href="/login/"]'); 
        const Signup = await browser.$('//a[@href="/signup/"]');
        const cart = await browser.$('//a[@href="/cart/"]//span[1]');
        return { Login, Signup, cart };
    }

   async ExploreButton(){
        return await browser.$("//div[contains(@class,'flex flex-col')]//a[1]");
    }
    async inputEmail(){
        return await browser.$('//*[@id="email"]');
    }
    async subscribe(){
        return await browser.$("(//button[@type='submit'])[2]");
    }
    async submitEmail(email) {
        await await this.inputEmail.addValue(email);}
}
export default new Home();