var assert = require('assert');
require('chromedriver');
const {Builder, By, until} = require('selenium-webdriver');
const chai = require("chai");
const expect = chai.expect;

describe("Test 1", function () {

    this.timeout(30000);

    it("Should show Warehouse Web App title on login screen", async () => {

        let driver = await new Builder().forBrowser("chrome").build();
        await driver.get("https://warehouse-web-app.herokuapp.com/");
        await driver.findElement(By.xpath('//*[@id="root"]/div/div/div[1]/h1')).getText()
            .then(textValue => {
                assert.equal('Warehouse Web app', textValue);
            }).then(() => driver.quit());
    });

});

describe("Test 2", function () {

    this.timeout(30000);

    it("Should show Product information for a logged in user on the homepage", async () => {

        let driver = await new Builder().forBrowser("chrome").build();
        await driver.get("https://warehouse-web-app.herokuapp.com/");
        // Ovaj xpath elementa se pronadje tako sto se u aplikaciji klikne desni klik na element, Inspect,
        // i onda dole gdje mu pronadje poziciju u html-u, klikne se desni klik na njegov html dio => copy => Copy Xpath, ili Copy full Xpath

        // Login:
        await driver.findElement(By.xpath('//*[@id="normal_login_username"]')).sendKeys("matej");
        await driver.findElement(By.xpath('//*[@id="normal_login_password"]')).sendKeys("password");
        await driver.findElement(By.xpath('//*[@id="normal_login"]/div[3]/div/div/div/button')).click();

        // Ulogovao se, sad treba provjerit postojanje teksta "Products" za ulogovanog korisnika
        await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/section/section[2]/main/div/div[1]/h2')), 15000);
        await driver.findElement(By.xpath('//*[@id="root"]/div/section/section[2]/main/div/div[1]/h2')).getText()
            .then(textValue => {
                assert.equal('Products', textValue);
            }).then(() => driver.quit());
    });

});

describe("Test 3", function () {

    this.timeout(30000);

    it("Should show Username field after Logout", async () => {

        let driver = await new Builder().forBrowser("chrome").build();
        driver.manage().window().setRect({x:0,y:0,width:1920,height:1080});
        await driver.get("https://warehouse-web-app.herokuapp.com/");
        // Login:
        await driver.findElement(By.xpath('//*[@id="normal_login_username"]')).sendKeys("matej");
        await driver.findElement(By.xpath('//*[@id="normal_login_password"]')).sendKeys("password");
        await driver.findElement(By.xpath('//*[@id="normal_login"]/div[3]/div/div/div/button')).click();
        await driver.wait(until.elementLocated(By.xpath('//*[@id="user"]/div')), 15000);
        await driver.findElement(By.xpath('//*[@id="user"]/div')).then(function(element) {
            driver.actions().move({duration:5000,origin:element,x:0,y:0}).perform();
        });
        await driver.wait(until.elementLocated(By.xpath('//*[@id="item_7$Menu"]/li')), 15000);
        await driver.findElement(By.xpath('//*[@id="item_7$Menu"]/li')).click();
        await driver.findElement(By.xpath('//*[@id="normal_login_username"]')).then(()=>driver.quit);
    });

});

describe("Test 4", function () {

    this.timeout(30000);

    it("Should show Number of Imports by Month after Login and click on Display Statistics", async () => {

        let driver = await new Builder().forBrowser("chrome").build();
        driver.manage().window().setRect({x:0,y:0,width:1920,height:1080});
        await driver.get("https://warehouse-web-app.herokuapp.com/");
        // Login:
        await driver.findElement(By.xpath('//*[@id="normal_login_username"]')).sendKeys("matej");
        await driver.findElement(By.xpath('//*[@id="normal_login_password"]')).sendKeys("password");
        await driver.findElement(By.xpath('//*[@id="normal_login"]/div[3]/div/div/div/button')).click();

        await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/section/section[1]/header/ul/li[10]/div')), 15000);
        await driver.findElement(By.xpath('//*[@id="root"]/div/section/section[1]/header/ul/li[10]/div')).then(function(element) {
            driver.actions().move({duration:5000,origin:element,x:0,y:0}).perform();
        });
        await driver.wait(until.elementLocated(By.xpath('//*[@id="sub5$Menu"]/li')), 15000);
        await driver.findElement(By.xpath('//*[@id="sub5$Menu"]/li')).click();
        await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/section/section[2]/main/div[1]/div[3]/h1')), 15000);
        await driver.findElement(By.xpath('//*[@id="root"]/div/section/section[2]/main/div[1]/div[3]/h1')).getText()
            .then(textValue => {
                assert.equal('Number of Imports by Month', textValue);
            }).then(() => driver.quit());
    });

});

describe("Test 5", function () {

    this.timeout(30000);

    it("Should show Login Notification for current user", async () => {

        let driver = await new Builder().forBrowser("chrome").build();
        driver.manage().window().setRect({x:0,y:0,width:1920,height:1080});
        await driver.get("https://warehouse-web-app.herokuapp.com/");
        // Login:
        await driver.findElement(By.xpath('//*[@id="normal_login_username"]')).sendKeys("matej");
        await driver.findElement(By.xpath('//*[@id="normal_login_password"]')).sendKeys("password");
        await driver.findElement(By.xpath('//*[@id="normal_login"]/div[3]/div/div/div/button')).click();

        await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/section/section[1]/header/ul/li[12]/div')), 15000);
        await driver.findElement(By.xpath('//*[@id="root"]/div/section/section[1]/header/ul/li[12]/div')).then(function(element) {
            driver.actions().move({duration:5000,origin:element,x:0,y:0}).perform();
        });
        await driver.wait(until.elementLocated(By.xpath('//*[@id="sub6$Menu"]/li')), 15000);
        await driver.findElement(By.xpath('//*[@id="sub6$Menu"]/li')).click();
        await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/section/section[2]/main/div/div/div/div/ul/li/div/div[2]/h4/a')), 15000);
        await driver.findElement(By.xpath('//*[@id="root"]/div/section/section[2]/main/div/div/div/div/ul/li/div/div[2]/h4/a')).getText()
            .then(textValue => {
                assert.equal('You have successfully logged in as matej', textValue);
            }).then(() => driver.quit());
    });

});
