const puppeteer = require ('puppeteer');
const chalk = require('chalk');
const config = require('./config')

let browser;
let page;


const pageURL = config.pageURL;

//for Login
const IdField = 'input[id="emp_id"]';
const PasswordField = 'input[id="login_password"]';
const LoginBtn = 'button[id="btn_login"]';

//Login credentials
const invalidId = 'Super';
const invalidPassword = '1234';
const validId = 'Admin';
const validPassword = 'admin';
const newUser = '154150631';

beforeAll(async () => {
    browser = await puppeteer.launch(
        {
            devtools: false, 
            headless: true, 
            defaultViewport: null, 
            args: [
                '--start-maximized', '--kiosk-printing', 
                '--proxy-server=http://192.168.36.35:3128', 
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-sandbox'
            ]
        }
    );
}, 100000);

beforeEach(async () => {
    page = await browser.newPage();

    await page.setDefaultNavigationTimeout(0);

    await page.goto(pageURL, {waitUntil: 'networkidle0'});
    await page.setViewport({width: 1920, height: 1080});
    await page.on('load');
    await page.on('domcontentloaded');

    const ptitle = await page.title();
    const title = 'Master Data Management System';
    console.log(chalk.yellow('Title Value: ' + ptitle));
    expect(ptitle).toMatch(title);
}, 100000);

afterAll(async () => {
    await browser.close();
}, 100000);

describe('Log-in Module', () => {
    //start of TC_LG_001
    it('TC_LG_001 Should not allow invalid username and invalid password', async () => {
        console.log(chalk.green('TC_LG_001 Should not allow invalid username and invalid password'));
        await page.type(IdField , invalidId, {delay: 50}); //input invalid username
        await page.type(PasswordField, invalidPassword, {delay: 50}); //input invalid password
        await page.click(LoginBtn); //click login button

        await page.waitForTimeout(2500);
        await page.$$('div > .card > .card-body > div > .alert');
        const alert = await page.$eval('div > .card > .card-body > div > .alert', elem => elem.innerText); //error message
        expect(alert).toMatch('User does not exist'); //validate expected result
    }, 100000);//end of TC_LG_001

    //start of TC_LG_002
    it('TC_LG_002 Should not allow valid username and invalid password', async () => {
        console.log(chalk.green('TC_LG_002 Should not allow valid username and invalid password'));
        await page.type(IdField , validId, {delay: 50}); //input valid username
        await page.type(PasswordField, invalidPassword, {delay: 50}); //input invalid password
        await page.click(LoginBtn); //click login button

        await page.waitForTimeout(2500);
        await page.$$('div > .card > .card-body > div > .alert');
        const alert = await page.$eval('div > .card > .card-body > div > .alert', elem => elem.innerText); //error message
        expect(alert).toMatch('Incorrect password.'); //validate expected result
    }, 100000);//end of TC_LG_002

    //start of TC_LG_003
    it('TC_LG_003 Should not allow invalid username and valid password', async () => {
        console.log(chalk.green('TC_LG_003 Should not allow invalid username and valid password'));
        await page.type(IdField , invalidId, {delay: 50}); //input invalid username
        await page.type(PasswordField, validPassword, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        await page.waitForTimeout(2500);
        await page.$$('div > .card > .card-body > div > .alert');
        const alert = await page.$eval('div > .card > .card-body > div > .alert', elem => elem.innerText); //error message
        expect(alert).toMatch('User does not exist.'); //validate expected result
    }, 100000);//end of TC_LG_003

    //start of TC_LG_004
    it('TC_LG_004 Should not allow null username', async () => {
        console.log(chalk.green('TC_LG_004 Should not allow null username'));
        await page.type(PasswordField, validPassword, {delay: 50}); //input valid password

        const btnDisabled = await page.$('button[disabled]') !== null;
        expect(btnDisabled).toBeTruthy();//validate expected result
        
    }, 100000);//end of TC_LG_004

    //start of TC_LG_005
    it('TC_LG_005 Should not allow null password', async () => {
        console.log(chalk.green('TC_LG_005 Should not allow null password'));
        await page.type(IdField , invalidId, {delay: 50}); //input invalid username

        const btnDisabled = await page.$('button[disabled]') !== null;
        expect(btnDisabled).toBeTruthy();//validate expected result        

    }, 100000);//end of TC_LG_005

    //start of TC_LG_006
    it('TC_LG_006 Should not allow null username and null password', async () => {
        console.log(chalk.green('TC_LG_006 Should not allow null username and null password'));

        const btnDisabled = await page.$('button[disabled]') !== null;
        expect(btnDisabled).toBeTruthy();//validate expected result        

    }, 100000);//end of TC_LG_006


    //start of TC_LG_007
    it('TC_LG_007 Should allow valid username and valid password', async () => {
        console.log(chalk.green('TC_LG_007 Should allow valid username and valid password'));
        await page.type(IdField , validId, {delay: 50}); //input valid username
        await page.type(PasswordField, validPassword, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        const mainPage = await page.$('#__layout > #wrapper > .content > .nuxt-table > .mainPages');
        expect(mainPage).toBeDefined();

    }, 100000);//end of TC_LG_007

}, 500000)