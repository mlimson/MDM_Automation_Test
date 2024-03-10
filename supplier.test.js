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
const purchaser = config.purchaser;
const purchasingHead = config.purchasingHead;
const functional = config.functional;
const password = '1234';

//Test Data
const SuppName = uniqueNamesGenerator({dictionaries: [adjectives, languages, names], style: 'capital', separator: ' '}).toUpperCase(); //prevent duplicates of Supplier Name
const requestedSupplier = SuppName;
const approvedSupplier = SuppName;
const BPAccount = config.BPAccount;

beforeAll(async () => {
    browser = await puppeteer.launch(
        {
            devtools: false, 
            headless: false, 
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

afterAll(async () => {
    await browser.close();
}, 100000);

describe('Validation for purcahsing staff can create request for new supplier registration', () => {
    //start of TC_SPLR_024
    it('TC_SPLR_024 Should allow creating request for new supplier registration', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
        await page.setViewport({
            width: 1920,
            height: 1080
        });
        
        await page.type(IdField , purchaser, {delay: 50}); //input valid username
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        //Navigate to Suppliers Menu
        await page.waitForTimeout(2000);
        await page.waitForSelector('#sb_suppliers');
        await page.click('#sb_suppliers');

        //Navigate to Request Tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#supplier_request___BV_tab_button__');
        await page.click('#supplier_request___BV_tab_button__');

        //Click Create Request button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_create_request');
        await page.click('#btn_create_request');
        
        //Select Company
        await page.waitForSelector('#filter_company');
        await page.select('#filter_company', company);

        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden:true});
        
        //Select Business Partner Type
        await page.waitForSelector('#bp_type_supp_add');
        await page.select('#bp_type_supp_add', 'S');
        
        //Select Request Type
        await page.waitForSelector('#request_type_supp_add');
        await page.select('#request_type_supp_add', 'N');
        
        //Input Supplier Name
        await page.waitForSelector('#supp_name_add');
        await page.type('#supp_name_add',SuppName)
        console.log(chalk.yellow(SuppName));
        
        //Input Payee Name
        await page.waitForSelector('#payee_name_supp_add');
        await page.type('#payee_name_supp_add', SuppName);
        
        //Select Vendor Type
        await page.waitForSelector('#vendor_type');
        await page.select('#vendor_type', 'C');
        
        //Select Group
        await page.waitForSelector('#group_supp_add');
        await page.select('#group_supp_add', 'BV121');

        //Select Currency
        await page.waitForSelector('#currency_supp_add');
        await page.select('#currency_supp_add', 'USD');
        
        //Input TIN
        await page.waitForSelector('#tin_supp_add');
        const SuppTIN = '123-123-12' + moment().format('DDhmmss'); //prevent duplicates of TIN
        await page.type('#tin_supp_add', SuppTIN);
        
        //Input Telephone Numbers
        await page.waitForSelector('#telephone_no_supp_add');
        const telPhone = await page.$$('#telephone_no_supp_add');
        await telPhone[0].type('2424242242');
        await telPhone[1].type('1238787780');
        
        //Input Mobile Number
        const field = await page.$$('#mobile_no_supp_add');
        await field[0].type('2124567890');

        //Input Fax
        await field[1].type('215415813223');
        
        //Input E-mail
        await field[2].type('vendor_email@email.com');
        
        //Input Website
        await field[3].type('#website_supp_add', 'vendor-site.nat');
        
        //Select Region
        await page.select('#region_supp_add', 'REGION XII');
        
        //Input Business Style / Trade Name
        await page.type('#bus_style', 'BussStyle');
        
        //Input Nature OF Business
        await page.type('#nature_of_business_add', 'Nature Of Business');
        
        //Input Geographical Location
        await page.type('#geo_loc_supp_add', 'Geographical Location');
        
        //Toggle Issue Invoice
        await page.click('.card-body > .row > .col > .mt-3 > .custom-control-label');
        
        //Navigate to Payment Terms tab
        await page.click('#payment_terms___BV_tab_button__');
        
        //Select Payment Terms
        await page.waitForSelector('#payment_terms_supp_add');
        await page.select('#payment_terms_supp_add', 'PT102');
        
        //Select Price List        
        await page.waitForSelector('#price_list_supp_add');
        await page.select('#price_list_supp_add', 'PL103');
        
        //Input Credit Limit
        await page.click('#credit_limit_supp_add');
        await page.type('#credit_limit_supp_add', '1234');
        
        //Input Commitment Limit
        await page.click('#commitment_limit_supp_add');
        await page.type('#commitment_limit_supp_add', '1234');
 
        //---------Expected Result---------
        const nextBTN = await page.$('#btn_next[disabled]');
        expect(nextBTN).toBeFalsy();
    }, 100000);//end of TC_SPLR_024

    //start of TC_SPLR_025
    it('TC_SPLR_025 Should allow adding Address details', async() => {
        await page.click('#btn_next');

        //Select Address Type
        await page.select('#address_type_add', 'B');

        //Input Address Name 2
        await page.type('#address2_add', 'Office Address');
        
        //Input Address Name 3
        await page.type('#address3_add', 'Main Branch');
        
        //Input Street
        await page.type('#street_add', 'Jefferson St N');
        
        //Input Street Number
        await page.type('#street_no_add', '201');
        
        //Input Building / Floor / Room
        await page.type('#bldg_flr_rm_add', 'The Avenue Apartments');
        
        //Input Block
        await page.type('#block_add', 'Blk 15');
        
        //Input City / Town
        await page.type('#town_city_add', 'Huntsville');
        
        //Zip Code
        await page.type('#zip_code_add', '35801');
        
        //Input County / Province
        await page.type('#county_add', 'Madison County')
        
        //Select Country
        await page.select('#country_add', 'US');
        
        //Select State
        await page.select('#state_add', 'AL');
        
        //Click Add Address button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#add_address');
        await page.click('#add_address');

        //---------Expected Result---------
        await page.waitForTimeout(2000);
        const nextBTN = await page.$('#btn_next[disabled]');
        expect(nextBTN).toBeFalsy();
        
        const tableRow = await page.$('.cardShadow > .card-body > .table > #address_table_supp > tbody > .b-table-empty-row > td');
        expect(tableRow).toBeFalsy();
    }, 100000);//end of TC_SPLR_025

    //start of TC_SPLR_026
    it('TC_SPLR_026 Should allow adding Contact details', async () => {
        //Click Next button
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');
        
        //Input Contact Title
        await page.type('#contact_title_add', 'HR');
        
        //Input First Name
        await page.type('#contacts_fname_add', 'Muriel');
        
        //Input Middle Name
        await page.type('#contacts_mname_add', 'Courage')
        
        //Input Last Name
        await page.type('#contacts_lname_add', 'Bagge')
        
        //Input Job Title
        await page.type('#contacts_job_title_add', 'Human Resource Staff');
        
        //Input Contact Address
        await page.type('#contacts_address_add', 'Fairfield, Connecticut');
        
        //Input Telephone
        const phoneNum = await page.$$('#contacts_phone_no_add');
        await phoneNum[0].type('2124567890');
        await phoneNum[1].type('2125765915');
        
        //Input Mobile Number
        await page.type('#contacts_mobile_no_add', '2124567890');
        
        //Input Fax
        await page.type('#contacts_fax_no_add', '2124567890');
        
        //Input Email Address
        await page.type('#email_add_contacts_add', 'muriel.bagge@email.com');
        
        //Click add Contact button
        await page.waitForSelector('#add_contacts');
        await page.click('#add_contacts');

        //---------Expected Result---------
        const nextBTN = await page.$('#btn_next[disabled]');
        expect(nextBTN).toBeFalsy();
        
        const tableRow = await page.$('.table > #address_table > tbody > .b-table-empty-row > td');
        expect(tableRow).toBeFalsy();
    }, 100000);//end of TC_SPLR_026

    //start of TC_SPLR_027
    it('TC_SPLR_027 Should submit request', async () => {
        //Click Next button
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');

        //Click Submit button
        await page.waitForSelector('#btn_done');
        await page.click('#btn_done');
        
        //Click Yes button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_save_submit-create');
        await page.click('#btn_save_submit-create');

        //wait for loading to stop
        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden: true})

        //---------Expected Result---------
        await page.waitForSelector('#alert-supplier');
        const alert = await page.$eval('#alert-supplier', elem => elem.innerText);
        expect(alert).toMatch('Success');
        
        //search request
        await page.waitForTimeout(2500);
        await page.waitForSelector('#request_supplier_search');
        const searchBar = await page.$$('#request_supplier_search');
        await searchBar[0].type(SuppName);

        await page.waitForSelector('tbody > tr > td > .badge-font-size > .badge-first-level');
        const status = await page.$eval('tbody > tr > td > .badge-font-size > .badge-first-level', elem => elem.innerText);
        expect(status).toMatch('Pending');
    }, 100000);//end of TC_SPLR_027
}, 500000),

describe('Validation for purchasing staff can update request created for suplier registration', () => {
    //start of TC_SPLR_028
    it('TC_SPLR_028 Should update supplier request', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
        await page.type(IdField , purchaser, {delay: 50}); //input valid username
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        //Navigate to Suppliers Menu
        await page.waitForTimeout(2000);
        await page.waitForSelector('#sb_suppliers');
        await page.click('#sb_suppliers');

        //Navigate to Request Tab
        await page.waitForSelector('#supplier_request___BV_tab_button__');
        await page.click('#supplier_request___BV_tab_button__');

        //search request
        await page.waitForSelector('#request_supplier_search');
        const searchBar = await page.$$('#request_supplier_search');
        await searchBar[0].type(SuppName);

        //Click Update Request button
        await page.waitForSelector('tr:nth-child(1) > td > #btn-view_supplier_details > .svg-inline--fa > path');
        await page.click('tr:nth-child(1) > td > #btn-view_supplier_details > .svg-inline--fa > path');
        
        //wait for loading
        await page.waitForSelector('.container-fluid > div > #loader > .loader3 > .logoz', {hidden: true});

        //Click Next button to proceed to Addresses
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');
        
        //Click Next button to proceed to Contacts
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');

        //---------Expected Result---------
        await page.waitForTimeout(2000);
        const nextBTN = await page.$('#btn_next[disabled]');
        expect(nextBTN).toBeFalsy();
    }, 100000);//end of TC_SPLR_028

    //start of TC_SPLR_029
    it('TC_SPLR_029 Should attach Documents', async () => {
        //Click Next button to proceed to attachments
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');
        
        //Upload attachments
        await page.waitForTimeout(2000);
        const attachment = await page.$$('.custom-file-input');
        await attachment[0].uploadFile('C:\\Users\\BFI\\Pictures\\download.png');
        await page.waitForTimeout(2000);
        //---------Expected Result---------
        let attchField = await page.$eval('.custom-file-label', elem => elem.innerText);
        expect(attchField).not.toMatch('Choose a file or drop it here...');
    }, 100000);//end of TC_SPLR_029

    //start of TC_SPLR_030
    it('TC_SPLR_030 Should submit request', async () => {
        //Click Next button to proceed to Signatories
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');
        
        //Click Submit button
        await page.waitForSelector('#btn_done');
        await page.click('#btn_done');
        
        //Click Yes button
        await page.waitForSelector('#btn_save_edit');
        await page.click('#btn_save_edit');

        //wait for loading to stop
        await page.waitForSelector('.container-fluid > div > #loader > .loader3 > .logoz', {hidden: true});

        //---------Expected Result---------
        await page.waitForSelector('#alert-supplier');
        const alert = await page.$eval('#alert-supplier', elem => elem.innerText);
        expect(alert).toMatch('Success');
        
        //validate status
        await page.waitForTimeout(2000);
        await page.waitForSelector('tbody > tr > td > .badge-font-size > .badge-second-level');
        const status = await page.$eval('tbody > tr > td > .badge-font-size > .badge-second-level', elem => elem.innerText);
        expect(status).toMatch('Requested');
    }, 100000);//end of TC_SPLR_030
}, 500000),

describe('Validation for purchasing head can approve request for supplier registration', () => {
    //start of TC_SPLR_037
    it('TC_SPLR_037 Should approve new supplier request', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
        await page.type(IdField , purchasingHead, {delay: 50}); //input valid username
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button
        
        //Navigate to Suppliers Menu
        await page.waitForSelector('#sb_suppliers');
        await page.click('#sb_suppliers');

        //Navigate to Request Tab
        await page.waitForSelector('#supplier_request___BV_tab_button__');
        await page.click('#supplier_request___BV_tab_button__');

        //search request
        await page.waitForSelector('#request_supplier_search');
        const searchBar = await page.$$('#request_supplier_search');
        await searchBar[0].type(requestedSupplier, {delay:50});

        //Click Approve Request buttton
        await page.waitForSelector('tbody > tr:nth-child(1) > td > #btn_approve_request_other_approvers > .icons');
        await page.click('tbody > tr:nth-child(1) > td > #btn_approve_request_other_approvers > .icons');
        
        //Click Approve button
        await page.waitForSelector('#btn_approve_requestSupplier');
        await page.click('#btn_approve_requestSupplier');
        
        await page.waitForSelector('.card-text > .container-fluid > #loader > .loader3 > .logoz', {hidden: true});
        
        //---------Expected Result---------
        await page.waitForSelector('#alert-supplier');
        await page.waitForTimeout(2000);
        const alert = await page.$eval('#alert-supplier', elem => elem.innerText);
        expect(alert).toMatch('Success');

        //Navigate to Approve tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#supplier_approved___BV_tab_button__');
        await page.click('#supplier_approved___BV_tab_button__');
        
        //Search for approved Supplier request
        await page.waitForTimeout(2000);
        await page.waitForSelector('#request_customer_search');
        await page.type('#request_customer_search', requestedSupplier, {delay:50});
        
        const status = await page.$eval('tbody > tr:nth-child(1) > td > .badge-font-size > .badge-third-level', elem => elem.innerText);
        expect(status).toMatch('Approved');
    }, 100000);//end of TC_SPLR_037
}, 500000),

describe('Validation for error if the supplier name was already requested', () => {
    //start of TC_SPLR_024
    it('Should not allow creating request if supplier name was already requested', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
        await page.setViewport({
            width: 1920,
            height: 1080
        });
        
        await page.type(IdField , purchaser, {delay: 50}); //input valid username
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        //Navigate to Suppliers Menu
        await page.waitForTimeout(2000);
        await page.waitForSelector('#sb_suppliers');
        await page.click('#sb_suppliers');

        //Navigate to Request Tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#supplier_request___BV_tab_button__');
        await page.click('#supplier_request___BV_tab_button__');

        //Click Create Request button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_create_request');
        await page.click('#btn_create_request');
        
        //Select Company
        await page.waitForSelector('#filter_company');
        await page.select('#filter_company', company);

        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden:true});
        
        //Select Business Partner Type
        await page.waitForSelector('#bp_type_supp_add');
        await page.select('#bp_type_supp_add', 'S');
        
        //Select Request Type
        await page.waitForSelector('#request_type_supp_add');
        await page.select('#request_type_supp_add', 'N');
        
        //Input Supplier Name
        await page.waitForSelector('#supp_name_add');
        await page.type('#supp_name_add',SuppName)
        console.log(chalk.yellow(SuppName));
        
        //Input Payee Name
        await page.waitForSelector('#payee_name_supp_add');
        await page.type('#payee_name_supp_add', SuppName);
        
        //Select Vendor Type
        await page.waitForSelector('#vendor_type');
        await page.select('#vendor_type', 'C');
        
        //Select Group
        await page.waitForSelector('#group_supp_add');
        await page.select('#group_supp_add', 'BV121');
        
        //Input Mobile Number
        const field = await page.$$('#mobile_no_supp_add');
        await field[0].type('2124567890');
        
        //Navigate to Payment Terms tab
        await page.click('#payment_terms___BV_tab_button__');
        
        //Select Payment Terms
        await page.waitForSelector('#payment_terms_supp_add');
        await page.select('#payment_terms_supp_add', 'PT102');
 
        //---------Expected Result---------
        const nxtBTN = await page.$('#btn_next[disabled]');
        expect(nxtBTN).toBeFalsy();
    
        await page.click('#btn_next');

        //Select Address Type
        await page.select('#address_type_add', 'B');

        //Input Address Name 2
        await page.type('#address2_add', 'Office Address');
        
        //Input Address Name 3
        await page.type('#address3_add', 'Main Branch');
        
        //Input Street
        await page.type('#street_add', 'Jefferson St N');
        
        //Input Street Number
        await page.type('#street_no_add', '201');
        
        //Input Building / Floor / Room
        await page.type('#bldg_flr_rm_add', 'The Avenue Apartments');
        
        //Input Block
        await page.type('#block_add', 'Blk 15');
        
        //Input City / Town
        await page.type('#town_city_add', 'Huntsville');
        
        //Zip Code
        await page.type('#zip_code_add', '35801');
        
        //Input County / Province
        await page.type('#county_add', 'Madison County')
        
        //Select Country
        await page.select('#country_add', 'US');
        
        //Select State
        await page.select('#state_add', 'AL');
        
        //Click Add Address button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#add_address');
        await page.click('#add_address');

        //---------Expected Result---------
        await page.waitForTimeout(2000);
        const nextBN = await page.$('#btn_next[disabled]');
        expect(nextBN).toBeFalsy();
        
        const tblRow = await page.$('.cardShadow > .card-body > .table > #address_table_supp > tbody > .b-table-empty-row > td');
        expect(tblRow).toBeFalsy();

        //Click Next button
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');
        
        //Input First Name
        await page.type('#contacts_fname_add', 'Muriel');
        
        //Input Last Name
        await page.type('#contacts_lname_add', 'Bagge')
        
        //Click add Contact button
        await page.waitForSelector('#add_contacts');
        await page.click('#add_contacts');

        //---------Expected Result---------
        const nextBTN = await page.$('#btn_next[disabled]');
        expect(nextBTN).toBeFalsy();
        
        const tableRow = await page.$('.table > #address_table > tbody > .b-table-empty-row > td');
        expect(tableRow).toBeFalsy();

        //Click Next button
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');

        //Click Submit button
        await page.waitForSelector('#btn_done');
        await page.click('#btn_done');
        
        //Click Yes button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_save_submit-create');
        await page.click('#btn_save_submit-create');

        //wait for loading to stop
        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden: true})

        //---------Expected Result---------
        await page.waitForSelector('#alert-supplier');
        const alert = await page.$eval('#alert-supplier', elem => elem.innerText);
        expect(alert).toMatch(/BP already exist with request no: /);

    }, 100000);//end of TC_SPLR_027
}, 500000),

describe('Validation for error if the supplier name is already existing in SAP', () => {
    //start of TC_SPLR_024
    it('Should not allow creating request if supplier name was already requested', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
        await page.setViewport({
            width: 1920,
            height: 1080
        });
        
        await page.type(IdField , purchaser, {delay: 50}); //input valid username
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        //Navigate to Suppliers Menu
        await page.waitForTimeout(2000);
        await page.waitForSelector('#sb_suppliers');
        await page.click('#sb_suppliers');

        //Navigate to Request Tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#supplier_request___BV_tab_button__');
        await page.click('#supplier_request___BV_tab_button__');

        //Click Create Request button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_create_request');
        await page.click('#btn_create_request');
        
        //Select Company
        await page.waitForSelector('#filter_company');
        await page.select('#filter_company', company);

        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden:true});
        
        //Select Business Partner Type
        await page.waitForSelector('#bp_type_supp_add');
        await page.select('#bp_type_supp_add', 'S');
        
        //Select Request Type
        await page.waitForSelector('#request_type_supp_add');
        await page.select('#request_type_supp_add', 'N');
        
        //Input Supplier Name
        await page.waitForSelector('#supp_name_add');
        await page.type('#supp_name_add','KCC PROPERTY HOLDINGS, INC.')
        console.log(chalk.yellow('KCC PROPERTY HOLDINGS, INC.'));
        
        //Select Vendor Type
        await page.waitForSelector('#vendor_type');
        await page.select('#vendor_type', 'C');
        
        //Select Group
        await page.waitForSelector('#group_supp_add');
        await page.select('#group_supp_add', 'BV121');

        //Input Mobile Number
        const field = await page.$$('#mobile_no_supp_add');
        await field[0].type('2124567890');
        
        //Navigate to Payment Terms tab
        await page.click('#payment_terms___BV_tab_button__');
        
        //Select Payment Terms
        await page.waitForSelector('#payment_terms_supp_add');
        await page.select('#payment_terms_supp_add', 'PT102');
 
        //---------Expected Result---------
        const nxtBTN = await page.$('#btn_next[disabled]');
        expect(nxtBTN).toBeFalsy();
    
        await page.click('#btn_next');

        //Select Address Type
        await page.select('#address_type_add', 'B');

        //Input Address Name 2
        await page.type('#address2_add', 'Office Address');
        
        //Input Address Name 3
        await page.type('#address3_add', 'Main Branch');
        
        //Input Street
        await page.type('#street_add', 'Jefferson St N');
        
        //Input Street Number
        await page.type('#street_no_add', '201');
        
        //Input Building / Floor / Room
        await page.type('#bldg_flr_rm_add', 'The Avenue Apartments');
        
        //Input Block
        await page.type('#block_add', 'Blk 15');
        
        //Input City / Town
        await page.type('#town_city_add', 'Huntsville');
        
        //Zip Code
        await page.type('#zip_code_add', '35801');
        
        //Input County / Province
        await page.type('#county_add', 'Madison County')
        
        //Select Country
        await page.select('#country_add', 'US');
        
        //Select State
        await page.select('#state_add', 'AL');
        
        //Click Add Address button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#add_address');
        await page.click('#add_address');

        //---------Expected Result---------
        await page.waitForTimeout(2000);
        const nextBN = await page.$('#btn_next[disabled]');
        expect(nextBN).toBeFalsy();
        
        const tblRow = await page.$('.cardShadow > .card-body > .table > #address_table_supp > tbody > .b-table-empty-row > td');
        expect(tblRow).toBeFalsy();

        //Click Next button
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');
        
        //Input First Name
        await page.type('#contacts_fname_add', 'Muriel');
        
        //Input Last Name
        await page.type('#contacts_lname_add', 'Bagge')
        
        //Click add Contact button
        await page.waitForSelector('#add_contacts');
        await page.click('#add_contacts');

        //---------Expected Result---------
        const nextBTN = await page.$('#btn_next[disabled]');
        expect(nextBTN).toBeFalsy();
        
        const tableRow = await page.$('.table > #address_table > tbody > .b-table-empty-row > td');
        expect(tableRow).toBeFalsy();

        //Click Next button
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');

        //Click Submit button
        await page.waitForSelector('#btn_done');
        await page.click('#btn_done');
        
        //Click Yes button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_save_submit-create');
        await page.click('#btn_save_submit-create');

        //wait for loading to stop
        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden: true})

        //---------Expected Result---------
        await page.waitForSelector('#alert-supplier');
        const alert = await page.$eval('#alert-supplier', elem => elem.innerText);
        expect(alert).toMatch(/already exists/);

    }, 100000);//end of TC_SPLR_027
}, 500000),

describe('Validation for functional financials can process request for supplier registration', () => {
    //start of TC_SPLR_040
    it('TC_SPLR_040 Should select VAT Definition and Group', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
        await page.type(IdField , functional, {delay: 50}); //input valid username
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button
        
        //Navigate to Suppliers Menu
        await page.waitForSelector('#sb_suppliers');
        await page.click('#sb_suppliers');

        //Navigate to Approve tab
        await page.waitForSelector('#supplier_approved___BV_tab_button__');
        await page.click('#supplier_approved___BV_tab_button__');
        
        //Search for approved Supplier request
        await page.waitForSelector('#request_customer_search');
        await page.type('#request_customer_search', approvedSupplier, {delay:50});

        //Click Process Request button
        await page.waitForSelector('#btn-process-supp-request');
        await page.click('#btn-process-supp-request');

        await page.waitForSelector('.container-fluid > div > #loader > .loader3 > .logoz', {hidden:true})

        //Select VAT Definition
        await page.select('#vat_definition_supp_process', 'Y');
        
        //Select VAT Group
        await page.select('#vat_group_supp_process', 'VG108');

        //---------Expected Result---------
        await page.waitForTimeout(2000);
        const nextBTN = await page.$('#btn_next[disabled]');
        expect(nextBTN).toBeFalsy();
    }, 100000);//end of TC_SPLR_040

    //start of TC_SPLR_041
    it('TC_SPLR_041 Should allow adding Bank Account', async () => {
        // Navigate to Bank Accounts tab
        await page.waitForSelector('#bank-accounts___BV_tab_button__');
        await page.click('#bank-accounts___BV_tab_button__');
        
        //Select Bank Name
        await page.select('#bank_name_process', 'BDO');
        
        //Input Bank Branch
        await page.type('#branch_process', 'BDO PIONEER GSC BRANCH', {delay:50});
        
        //Input Bank Account Name
        await page.type('#bank_account_name_process', approvedSupplier, {delay:50})
        
        //Input Bank Account Number
        await page.type('#bank_account_no_process', '41123154120',{delay:50})
        
        //Inout Currency
        await page.type('#account_currency_process', 'USD', {delay:50});
        
        //Input Account Type
        await page.type('#account_type_process', 'Current', {delay:50});
        
        //Swift Code
        await page.type('#swift_code_process', 'BDOPNRGSCBRNCH', {delay:50});
        
        //Input Street No
        await page.type('#street_no_process', '35th', {delay:50});
        
        //Input Street
        await page.type('#street_process', 'Arriola St', {delay:50});
        
        //Input City
        await page.type('#city_process', 'General Santos City', {delay:50});
        
        //Input Zip
        await page.type('#zip_code_process', '9500', {delay:50})
        
        //Click Add button
        await page.click('#add_bank_account');

        //---------Expected Result---------
        await page.waitForTimeout(2000);
        const tableRow = await page.$('.my-table > #bank_account_table_process > tbody > .b-table-empty-row > td');
        expect(tableRow).toBeFalsy();
    }, 100000);//end of TC_SPLR_041

    //start of TC_SPLR_042
    it('TC_SPLR_042 Should show default Account', async () => {
        //Navigate to Accounting Inputs tab
        page.waitForSelector('#accounting___BV_tab_button__');
        await page.click('#accounting___BV_tab_button__');
        
        //---------Expected Results---------
        await page.waitForTimeout(2000);
        const accountsPayable = await page.$eval('.card-body > .row >.col > .row > .col-10 > #credit_limit_supp_add', elem => elem.value);
        expect(accountsPayable).toMatch(BPAccount);
    }, 100000);//end of TC_SPLR_042

    //start of TC_SPLR_043
    it('TC_SPLR_043 Should submit request', async () => {
        //Click Next button to proceed to Addresses
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');
        
        //Click Next button to proceed to Contacts
        await page.click('#btn_next');
        
        //Click Next button to proceed to Signatories
        await page.click('#btn_next');
        
        //Click Submit button
        await page.click('#btn_done');
        
        //Click Yes button
        await page.click('#btn_process_request');
        
        //wait for loading to finish
        await page.waitForSelector('.container-fluid > div > #loader > .loader3 > .logoz', {hidden: true});
        
        //---------Expected Result---------
        await page.waitForSelector('#alert-supplier');
        const alert = await page.$eval('#alert-supplier', elem => elem.innerText);
        expect(alert).toMatch('Success');
        
        //Navigate to Process tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#supplier_processed___BV_tab_button__');
        await page.click('#supplier_processed___BV_tab_button__');
        
        //Search processed Supplier request
        await page.waitForSelector('#request_supplier_search');
        const searchBar = await page.$$('#request_supplier_search');
        await searchBar[2].type(approvedSupplier, {delay:50});

        //validate status
        await page.waitForSelector('tbody > tr > td > .badge-font-size > .badge-fourth-level');
        const status = await page.$eval('tbody > tr > td > .badge-font-size > .badge-fourth-level', elem => elem.innerText);
        expect(status).toMatch('Processed');
    }, 100000);//end of TC_SPLR_043
}, 500000),

describe('Validation for error if the supplier name is existing in SAP', () => {
    //start of TC_SPLR_024
    it('Should  not allow creating request for existing supplier in SAP', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
        await page.setViewport({
            width: 1920,
            height: 1080
        });
        
        await page.type(IdField , purchaser, {delay: 50}); //input valid username
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        //Navigate to Suppliers Menu
        await page.waitForTimeout(2000);
        await page.waitForSelector('#sb_suppliers');
        await page.click('#sb_suppliers');

        //Navigate to Request Tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#supplier_request___BV_tab_button__');
        await page.click('#supplier_request___BV_tab_button__');

        //Click Create Request button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_create_request');
        await page.click('#btn_create_request');
        
        //Select Company
        await page.waitForSelector('#filter_company');
        await page.select('#filter_company', company);

        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden:true});
        
        //Select Business Partner Type
        await page.waitForSelector('#bp_type_supp_add');
        await page.select('#bp_type_supp_add', 'S');
        
        //Select Request Type
        await page.waitForSelector('#request_type_supp_add');
        await page.select('#request_type_supp_add', 'N');
        
        //Input Supplier Name
        await page.waitForSelector('#supp_name_add');
        await page.type('#supp_name_add',"KCC PROPERTY HOLDINGS, INC.")
        console.log(chalk.yellow("KCC PROPERTY HOLDINGS, INC."));
        
        //Input Payee Name
        await page.waitForSelector('#payee_name_supp_add');
        await page.type('#payee_name_supp_add', SuppName);
        
        //Select Vendor Type
        await page.waitForSelector('#vendor_type');
        await page.select('#vendor_type', 'C');
        
        //Select Group
        await page.waitForSelector('#group_supp_add');
        await page.select('#group_supp_add', 'BV121');

        //Select Currency
        await page.waitForSelector('#currency_supp_add');
        await page.select('#currency_supp_add', 'USD');
        
        //Input TIN
        await page.waitForSelector('#tin_supp_add');
        const SuppTIN = '123-123-12' + moment().format('DDhmmss'); //prevent duplicates of TIN
        await page.type('#tin_supp_add', SuppTIN);
        
        //Input Telephone Numbers
        await page.waitForSelector('#telephone_no_supp_add');
        const telPhone = await page.$$('#telephone_no_supp_add');
        await telPhone[0].type('2424242242');
        await telPhone[1].type('1238787780');
        
        //Input Mobile Number
        const field = await page.$$('#mobile_no_supp_add');
        await field[0].type('2124567890');

        //Input Fax
        await field[1].type('215415813223');
        
        //Input E-mail
        await field[2].type('vendor_email@email.com');
        
        //Input Website
        await field[3].type('#website_supp_add', 'vendor-site.nat');
        
        //Select Region
        await page.select('#region_supp_add', 'REGION XII');
        
        //Input Business Style / Trade Name
        await page.type('#bus_style', 'BussStyle');
        
        //Input Nature OF Business
        await page.type('#nature_of_business_add', 'Nature Of Business');
        
        //Input Geographical Location
        await page.type('#geo_loc_supp_add', 'Geographical Location');
        
        //Toggle Issue Invoice
        await page.click('.card-body > .row > .col > .mt-3 > .custom-control-label');
        
        //Navigate to Payment Terms tab
        await page.click('#payment_terms___BV_tab_button__');
        
        //Select Payment Terms
        await page.waitForSelector('#payment_terms_supp_add');
        await page.select('#payment_terms_supp_add', 'PT102');
        
        //Select Price List        
        await page.waitForSelector('#price_list_supp_add');
        await page.select('#price_list_supp_add', 'PL103');
        
        //Input Credit Limit
        await page.click('#credit_limit_supp_add');
        await page.type('#credit_limit_supp_add', '1234');
        
        //Input Commitment Limit
        await page.click('#commitment_limit_supp_add');
        await page.type('#commitment_limit_supp_add', '1234');
 
        //---------Expected Result---------
        const nxtBTN = await page.$('#btn_next[disabled]');
        expect(nxtBTN).toBeFalsy();
    
        await page.click('#btn_next');

        //Select Address Type
        await page.select('#address_type_add', 'B');

        //Input Address Name 2
        await page.type('#address2_add', 'Office Address');
        
        //Input Address Name 3
        await page.type('#address3_add', 'Main Branch');
        
        //Input Street
        await page.type('#street_add', 'Jefferson St N');
        
        //Input Street Number
        await page.type('#street_no_add', '201');
        
        //Input Building / Floor / Room
        await page.type('#bldg_flr_rm_add', 'The Avenue Apartments');
        
        //Input Block
        await page.type('#block_add', 'Blk 15');
        
        //Input City / Town
        await page.type('#town_city_add', 'Huntsville');
        
        //Zip Code
        await page.type('#zip_code_add', '35801');
        
        //Input County / Province
        await page.type('#county_add', 'Madison County')
        
        //Select Country
        await page.select('#country_add', 'US');
        
        //Select State
        await page.select('#state_add', 'AL');
        
        //Click Add Address button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#add_address');
        await page.click('#add_address');

        //---------Expected Result---------
        await page.waitForTimeout(2000);
        const nextBN = await page.$('#btn_next[disabled]');
        expect(nextBN).toBeFalsy();
        
        const tblRow = await page.$('.cardShadow > .card-body > .table > #address_table_supp > tbody > .b-table-empty-row > td');
        expect(tblRow).toBeFalsy();

        //Click Next button
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');
        
        //Input Contact Title
        await page.type('#contact_title_add', 'HR');
        
        //Input First Name
        await page.type('#contacts_fname_add', 'Muriel');
        
        //Input Middle Name
        await page.type('#contacts_mname_add', 'Courage')
        
        //Input Last Name
        await page.type('#contacts_lname_add', 'Bagge')
        
        //Input Job Title
        await page.type('#contacts_job_title_add', 'Human Resource Staff');
        
        //Input Contact Address
        await page.type('#contacts_address_add', 'Fairfield, Connecticut');
        
        //Input Telephone
        const phoneNum = await page.$$('#contacts_phone_no_add');
        await phoneNum[0].type('2124567890');
        await phoneNum[1].type('2125765915');
        
        //Input Mobile Number
        await page.type('#contacts_mobile_no_add', '2124567890');
        
        //Input Fax
        await page.type('#contacts_fax_no_add', '2124567890');
        
        //Input Email Address
        await page.type('#email_add_contacts_add', 'muriel.bagge@email.com');
        
        //Click add Contact button
        await page.waitForSelector('#add_contacts');
        await page.click('#add_contacts');

        //---------Expected Result---------
        const nextBTN = await page.$('#btn_next[disabled]');
        expect(nextBTN).toBeFalsy();
        
        const tableRow = await page.$('.table > #address_table > tbody > .b-table-empty-row > td');
        expect(tableRow).toBeFalsy();

        //Click Next button
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');

        //Click Submit button
        await page.waitForSelector('#btn_done');
        await page.click('#btn_done');
        
        //Click Yes button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_save_submit-create');
        await page.click('#btn_save_submit-create');

        //wait for loading to stop
        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden: true})

        //---------Expected Result---------
        await page.waitForSelector('#alert-supplier');
        const alert = await page.$eval('#alert-supplier', elem => elem.innerText);
        expect(alert).toMatch("'KCC PROPERTY HOLDINGS, INC.' already exists.");
    }, 100000);//end of TC_SPLR_027
}, 500000)