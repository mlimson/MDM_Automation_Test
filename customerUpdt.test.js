const puppeteer = require ('puppeteer');
const chalk = require('chalk');
const moment = require('moment');
const { uniqueNamesGenerator, adjectives,languages, names } = require('unique-names-generator');
const config = require('./config')

let browser;
let page;


const pageURL = config.pageURL;

//for Login
const IdField = 'input[id="emp_id"]';
const PasswordField = 'input[id="login_password"]';
const LoginBtn = 'button[id="btn_login"]';

//Company
const company = config.company;

//Login credentials
const salesStaff = config.salesStaff;
const salesHead = config.salesHead;
const functional = config.functional;
const BPGroup = config.BPGroup
const password = '1234';
const customerCode = config.customerCode;

//Test Data
const CustName = "DIAZ , EDWIN";
const requestedCustomer = 'AUTOMATED TESTING - CUSTOMER SEP 29, 1:35:08 PM';
const approvedCustomer = 'AUTOMATED TESTING - CUSTOMER SEP 29, 1:35:08 PM';

beforeAll(async () => {
    browser = await puppeteer.launch(
        {
            devtools: false, 
            headless: false, 
            defaultViewport: null, 
            args: [
                '--start-maximized', '--kiosk-printing', 
                //'--proxy-server=http://192.168.36.35:3128', 
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-sandbox'
            ]
        }
    );
}, 100000);

afterAll(async () => {
    await browser.close();
}, 100000);

describe('Validation for sales staff can create request for customer registraton', () => {
    //start of TC_CSTMR_024
    it('Should allow creating request for new customer registration', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
    
        await page.on('load');
        await page.type(IdField , salesStaff, {delay: 50}); //input valid username
        await page.waitForTimeout(2000);
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        //Navigate to Customers Menu
        await page.waitForSelector('#sb_customers');
        await page.click('#sb_customers');
        
        //Navigate to Request tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#customer_request___BV_tab_button__');
        await page.click('#customer_request___BV_tab_button__');
        
        //Click Create request button
        await page.waitForSelector('#btn_create_request_customer');
        await page.click('#btn_create_request_customer');

        //Select Company
        await page.waitForSelector('#filter_company');
        await page.select('#filter_company', company);

        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden:true});
        
        //Select Business Partner Type
        await page.waitForTimeout(2000);
        await page.waitForSelector('#bp_type_supp_add');
        await page.select('#bp_type_supp_add', 'C');
        
        //Select Request Type
        await page.waitForTimeout(2000);
        await page.waitForSelector('#request_type_supp_add');
        await page.select('#request_type_supp_add', 'U');
        
        await page.waitForSelector('#add_user');
        await page.click('#add_user');
        await page.waitForTimeout(2000);

        await page.waitForSelector('.partner-table tbody > tr:nth-child(1) > td:nth-child(2)');

        await page.waitForSelector('#search_partner_modal');
        await page.type('#search_partner_modal', customerCode);
        
        await page.waitForSelector('.partner-table tbody > tr:nth-child(1) > td:nth-child(2)');
        await page.click('.partner-table tbody > tr:nth-child(1) > td:nth-child(2)');

        await page.waitForTimeout(2000);
        await page.waitForSelector('#select_bp');
        await page.click('#select_bp');
        
        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden: true});

        await page.waitForTimeout(2000);

        //Input Telephone Numbers
        await page.waitForSelector('#telephone_no_cust_add');
        const telPhone = await page.$$('#telephone_no_cust_add');
        await telPhone[0].click({clickCount:2});
        await telPhone[0].type('3901');
        await telPhone[1].click({clickCount:2});
        await telPhone[1].type('3906');
        
        //Input Mobile Number
        await page.waitForTimeout(2000);
        await page.click('#mobile_no_cust_add',{clickCount:2});
        await page.type('#mobile_no_cust_add', '09445123212');

        //Select Region
        await page.waitForTimeout(2000);
        await page.click('#region_cust_add',{clickCount:2});
        await page.select('#region_cust_add', 'REGION XII');
        
        //Input Geographical Location
        await page.waitForTimeout(2000);
        await page.click('#geo_loc_cust_add',{clickCount:2});
        await page.type('#geo_loc_cust_add', 'New Geographical Location');
        
        //Navigate to Payment Terms Tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#payment_terms___BV_tab_button__');
        await page.click('#payment_terms___BV_tab_button__');
        
        //Select Payment Terms
        await page.waitForTimeout(2000);
        await page.waitForSelector('#payment_terms_supp_add');
        await page.select('#payment_terms_supp_add', 'PT102');
                
        //Input Credit Limit
        await page.waitForTimeout(2000);
        await page.click('#credit_limit_supp_add');
        await page.type('#credit_limit_supp_add', '5000');
        
        //Input Commitment Limit
        await page.waitForTimeout(2000);
        await page.click('#commitment_limit_supp_add');
        await page.type('#commitment_limit_supp_add', '5000');

        //---------Expected Result---------
        const nextBTN = await page.$('#btn_next[disabled]');
        expect(nextBTN).toBeFalsy();
    }, 100000);//end of TC_CSTMR_024

    //start of TC_CSTMR_025
    it('Should allow adding Address details', async() => {
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');

        //Select Address Type
        await page.waitForSelector('#address_type_add');
        await page.select('#address_type_add', 'S');

        //Input Address Name 2
        await page.waitForSelector('#address2_add');
        await page.type('#address2_add', 'Office Address');
        
        //Input Address Name 3
        await page.waitForSelector('#address3_add');
        await page.type('#address3_add', 'Main Branch');
        
        //Input Street
        await page.waitForSelector('#street_add');
        await page.type('#street_add', 'Jefferson St N');
        
        //Input Street Number
        await page.waitForSelector('#street_no_add');
        await page.type('#street_no_add', '201');
        
        //Input Building / Floor / Room
        await page.waitForSelector('#bldg_flr_rm_add');
        await page.type('#bldg_flr_rm_add', 'The Avenue Apartments');
        
        //Input Block
        await page.waitForSelector('#block_add');
        await page.type('#block_add', 'Blk 15');
        
        //Input City / Town
        await page.waitForSelector('#town_city_add');
        await page.type('#town_city_add', 'Huntsville');
        
        //Zip Code
        await page.waitForSelector('#zip_code_add');
        await page.type('#zip_code_add', '35801');
        
        //Input County / Province
        await page.waitForSelector('#county_add')
        await page.type('#county_add', 'Madison County')
        
        //Select Country
        await page.waitForSelector('#country_add');
        await page.select('#country_add', 'US');
        
        //Select State
        await page.waitForTimeout(2500);
        await page.select('#state_add', 'AL');
        
        //Click Add Address button
        await page.waitForSelector('#add_address');
        await page.click('#add_address');

        //---------Expected Result---------
        const nextBTN = await page.$('#btn_next[disabled]');
        expect(nextBTN).toBeFalsy();
        
        const tableRow = await page.$('.cardShadow > .card-body > .table > #address_table_supp > tbody > .b-table-empty-row > td');
        expect(tableRow).toBeFalsy();
    }, 100000);//end of TC_CSTMR_025

    //start of TC_CSTMR_026
    it('Should allow adding Contact details', async () => {
        //Click Next button
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');
        await page.waitForTimeout(2000);
        
        //Input Contact Title
        await page.waitForSelector('#contact_title_add');
        await page.type('#contact_title_add', 'HR');
        
        //Input First Name
        await page.waitForSelector('#contacts_fname_add');
        await page.type('#contacts_fname_add', 'Muriel');
        
        //Input Middle Name
        await page.waitForSelector('#contacts_mname_add')
        await page.type('#contacts_mname_add', 'Courage')
        
        //Input Last Name
        await page.waitForSelector('#contacts_lname_add')
        await page.type('#contacts_lname_add', 'Bagge')
        
        //Input Job Title
        await page.waitForSelector('#contacts_job_title_add');
        await page.type('#contacts_job_title_add', 'Human Resource Staff');
        
        //Input Contact Address
        await page.waitForSelector('#contacts_address_add');
        await page.type('#contacts_address_add', 'Fairfield, Connecticut');
        
        //Input Telephone
        await page.waitForSelector('#contacts_phone_no_add');
        const phoneNum = await page.$$('#contacts_phone_no_add');
        await phoneNum[0].type('2124567890');
        await phoneNum[1].type('2125765915');
        
        //Input Mobile Number
        await page.waitForSelector('#contacts_mobile_no_add');
        await page.type('#contacts_mobile_no_add', '2124567890');
        
        //Input Fax
        await page.waitForSelector('#contacts_fax_no_add');
        await page.type('#contacts_fax_no_add', '2124567890');
        
        //Input Email Address
        await page.waitForSelector('#email_add_contacts_add');
        await page.type('#email_add_contacts_add', 'muriel.bagge@email.com');
        
        //Click add Contact button
        await page.waitForSelector('#add_contacts');
        await page.click('#add_contacts');

        //---------Expected Result---------
        const nextBTN = await page.$('#btn_next[disabled]');
        expect(nextBTN).toBeFalsy();
        
        const tableRow = await page.$('.table > #address_table > tbody > .b-table-empty-row > td');
        expect(tableRow).toBeFalsy();
    }, 100000);//end of TC_CSTMR_026

    //start of TC_CSTMR_027
    it('Should submit customer registration request', async () => {
        //Click Submit button
        await page.waitForSelector('#btn_done');
        await page.click('#btn_done');
        await page.waitForTimeout(2000);
        
        //Click Yes button
        await page.waitForSelector('#btn_save_submit-create');
        await page.click('#btn_save_submit-create');
        await page.waitForTimeout(2500);
        //wait for loading to stop
        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden: true})
        
        //---------Expected Result---------
        await page.waitForSelector('#alert-requestCust');
        const alert = await page.$eval('#alert-requestCust', elem => elem.innerText);
        expect(alert).toMatch('Success');
        
        //search request
        await page.waitForSelector('#request_customer_search');
        await page.waitForTimeout(2000);
        const searchBar = await page.$$('#request_customer_search');
        await searchBar[0].type(CustName, {delay:50});
        await page.waitForTimeout(2000);
        await page.waitForSelector('tbody > tr > td > .badge-font-size > .badge');
        const status = await page.$eval('tbody > tr > td > .badge-font-size > .badge', elem => elem.innerText);
        expect(status).toMatch('Pending');
    }, 100000);//end of TC_CSTMR_027
}, 500000),

describe('Validation for sales staff can update request created for customer registration', () => {
    it('Should update customer request', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});

        await page.type(IdField , salesStaff, {delay: 50}); //input valid username
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        //Navigate to Customers Menu
        await page.waitForSelector('#sb_customers');
        await page.click('#sb_customers');
        
        //Navigate to Request tab
        await page.waitForSelector('#customer_request___BV_tab_button__');
        await page.click('#customer_request___BV_tab_button__');

        //search request
        await page.waitForSelector('#request_customer_search');
        const searchBar = await page.$$('#request_customer_search');
        await searchBar[0].type(CustName);

        //Click Update Request button
        await page.waitForSelector('tr:nth-child(1) > td > #btn_edit_customer_details > .icons > path');
        await page.click('tr:nth-child(1) > td > #btn_edit_customer_details > .icons > path');
     
        await page.waitForSelector('.container-fluid > div > #loader > .loader3 > .logoz', {hidden: true})

        //Click Next button to proceed to Addresses
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');
        
        //Click Next button to proceed to Contacts
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');
        
        //Click Submit button
        await page.waitForSelector('#btn_done');
        await page.click('#btn_done');
        
        //Click Yes button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_save_edit');
        await page.click('#btn_save_edit');
        //wait for loading to stop
        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden: true})

        //---------Expected Result---------
        await page.waitForSelector('#alert-requestCust');
        const alert = await page.$eval('#alert-requestCust', elem => elem.innerText);
        expect(alert).toMatch('Success');
        
        //search request
        await page.waitForTimeout(2000);
        await page.waitForSelector('tbody > tr > td > .badge-font-size > .badge');
        const status = await page.$eval('tbody > tr > td > .badge-font-size > .badge', elem => elem.innerText);
        expect(status).toMatch('Requested');
    }, 100000);
}, 500000),

describe('Validation for Sales Head can approve customer registration request', () => {
    //start of TC_CSTMR_035
    it('Should approve customer request', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});

        await page.type(IdField , salesHead, {delay: 50}); //input valid username
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        //Navigate to Customers Menu
        await page.waitForSelector('#sb_customers');
        await page.click('#sb_customers');
        
        //Navigate to Request tab
        await page.waitForSelector('#customer_request___BV_tab_button__');
        await page.click('#customer_request___BV_tab_button__');

        //search request
        await page.waitForSelector('#request_customer_search');
        const searchBar = await page.$$('#request_customer_search');
        await searchBar[0].type(CustName);

        //Click Approve Request button
        await page.waitForSelector('#btn_approve_customer_request');
        await page.click('#btn_approve_customer_request');
        
        //Click Approve button
        await page.waitForSelector('#btn_approve_requestCustomer');
        await page.click('#btn_approve_requestCustomer');
        
        //---------Expected Result---------
        await page.waitForTimeout(2000);
        await page.waitForSelector('#alert-requestCust');
        const alert = await page.$eval('#alert-requestCust', elem => elem.innerText);
        expect(alert).toMatch('Success');

        //Navigate to Approve Tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#customer_approved___BV_tab_button__');
        await page.click('#customer_approved___BV_tab_button__');
        
        //search request
        await page.waitForTimeout(2000);
        await searchBar[1].type(CustName, {delay:50});

        const status = await page.$eval('tbody > tr > td > .badge-font-size > .badge-third-level', elem => elem.innerText);
        expect(status).toMatch('Approved');
    }, 100000);//end of TC_CSTMR_035

}, 500000),

describe('Validation for functional financials can process customer registration request', () => {
    //start of TC_CSTMR_037
    it('Should process customer registration request', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
        // await page.setViewport({
        //     width: 1920,
        //     height: 1080
        // });
    
        await page.on('load');
        await page.on('domcontentloaded');
        const ptitle = await page.title();
        const title = 'Master Data Management System';
        expect(ptitle).toMatch(title);

        console.log(chalk.green('Should submit customer request'));
        await page.waitForTimeout(2000);

        await page.type(IdField , functional, {delay: 50}); //input valid username
        await page.waitForTimeout(2000);
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        //Navigate to Customers Menu
        await page.waitForTimeout(2500);
        await page.waitForSelector('#sb_customers');
        await page.click('#sb_customers');

        //Navigate to Approve Tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#customer_approved___BV_tab_button__');
        await page.click('#customer_approved___BV_tab_button__');
        
        //search request
        await page.waitForTimeout(2000);
        const searchBar = await page.$$('#request_customer_search');
        await searchBar[1].type(CustName, {delay:50});

        //Click Process Request button
        await page.waitForTimeout(2000);
        await page.waitForSelector('tbody > tr:nth-child(1) > td > #btn_process_cusRequest > .icons');
        await page.click('tbody > tr:nth-child(1) > td > #btn_process_cusRequest > .icons');
        
        //wait to finish loading
        await page.waitForSelector('.container-fluid > div > #loader > .loader3 > .logoz', {hidden: true});
        
        //Select VAT Definition
        await page.waitForTimeout(2000);
        await page.waitForSelector('#vat_definition_cust_process');
        await page.click('#vat_definition_cust_process');
        await page.waitForTimeout(2000);
        await page.select('#vat_definition_cust_process', 'Y');
        await page.click('#vat_definition_cust_process');

        //Select VAT Group
        await page.waitForTimeout(2000);
        await page.waitForSelector('#vat_group_cust_process');
        await page.click('#vat_group_cust_process');
        await page.waitForTimeout(2000);
        await page.select('#vat_group_cust_process', 'VG112');
        await page.click('#vat_group_cust_process');
        
        const BPCode = await page.$eval('#customer_code_process', elem => elem.value);
        expect(BPCode).toBe(customerCode);

        //Click Next to proceed to Addresses
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');
        
        //Click Next to proceed to Contacts
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');
        
        //Click Submit button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_done');
        await page.click('#btn_done');
        
        //Click Yes button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_process_request');
        await page.click('#btn_process_request');
        
        //wait for loading to finish
        await page.waitForSelector('.container-fluid > div > #loader > .loader3 > .logoz', {hidden: true});
        
        //---------Expected Result---------
        await page.waitForTimeout(2000);
        await page.waitForSelector('#alert-approveCust');
        const alert = await page.$eval('#alert-approveCust', elem => elem.innerText);
        expect(alert).toMatch('Success');

        //Navigate to Process Tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#customer_processed___BV_tab_button__');
        await page.click('#customer_processed___BV_tab_button__');
        
        //search request
        await page.waitForTimeout(2000);
        await searchBar[3].type(CustName, {delay:50});
        await page.waitForTimeout(2000);
        await page.waitForSelector('tbody > tr > td > .badge-font-size > .badge-fourth-level');
        const status = await page.$eval('tbody > tr > td > .badge-font-size > .badge-fourth-level', elem => elem.innerText);
        expect(status).toMatch('Processed');
        
        await page.waitForTimeout(2500);        
    }, 100000);//end of TC_CSTMR_037

}, 500000)