import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('⏳ Start seeding data...');

    // 1. Matikan pengecekan Foreign Key
    await prisma.$executeRawUnsafe(`SET session_replication_role = 'replica';`);

    // 2. Eksekusi tabel payments
    await prisma.$executeRawUnsafe(`
        INSERT INTO payments (customernumber, checknumber, paymentdate, amount) VALUES 
        (103, 'HQ336336', '2004-10-19', '6066.78'), (103, 'JM555205', '2003-06-05', '14571.44'), (103, 'OM314933', '2004-12-18', '1676.14'),
        (112, 'BO864823', '2004-12-17', '14191.12'), (112, 'HQ55022', '2003-06-06', '32641.98'), (112, 'ND748579', '2004-08-20', '33347.88'),
        (114, 'GG31455', '2003-05-20', '45864.03'), (114, 'MA765515', '2004-12-15', '82261.22'), (114, 'NP603840', '2003-05-31', '7565.08'),
        (114, 'NR27552', '2004-03-10', '44894.74'), (119, 'DB933704', '2004-11-14', '19501.82'), (119, 'LN373447', '2004-08-08', '47924.19'),
        (119, 'NG94694', '2005-02-22', '49523.67'), (121, 'DB889831', '2003-02-16', '50218.95'), (121, 'FD317790', '2003-10-28', '1491.38'),
        (121, 'KI831359', '2004-11-04', '17876.32'), (121, 'MA302151', '2004-11-28', '34638.14'), (124, 'AE215433', '2005-03-05', '101244.59'),
        (124, 'BG255406', '2004-08-28', '85410.87') ON CONFLICT DO NOTHING;
    `);

    // 3. Eksekusi tabel orders
    await prisma.$executeRawUnsafe(`
        INSERT INTO orders (ordernumber, orderdate, requireddate, shippeddate, status, comments, customernumber) VALUES 
        (10100, '2003-01-06', '2003-01-13', '2003-01-10', 'Shipped', NULL, 363), (10101, '2003-01-09', '2003-01-18', '2003-01-11', 'Shipped', 'Check on availability.', 128),
        (10102, '2003-01-10', '2003-01-18', '2003-01-14', 'Shipped', NULL, 181), (10103, '2003-01-29', '2003-02-07', '2003-02-02', 'Shipped', NULL, 121),
        (10104, '2003-01-31', '2003-02-09', '2003-02-01', 'Shipped', NULL, 141), (10105, '2003-02-11', '2003-02-21', '2003-02-12', 'Shipped', NULL, 145),
        (10106, '2003-02-17', '2003-02-24', '2003-02-21', 'Shipped', NULL, 278), (10107, '2003-02-24', '2003-03-03', '2003-02-26', 'Shipped', 'Difficult to negotiate with customer.', 131),
        (10108, '2003-03-03', '2003-03-12', '2003-03-08', 'Shipped', NULL, 385), (10109, '2003-03-10', '2003-03-19', '2003-03-11', 'Shipped', 'Customer requested that FedEx Ground is used for this shipping', 486),
        (10110, '2003-03-18', '2003-03-24', '2003-03-20', 'Shipped', NULL, 187), (10111, '2003-03-25', '2003-03-31', '2003-03-30', 'Shipped', NULL, 129),
        (10112, '2003-03-24', '2003-04-03', '2003-03-29', 'Shipped', 'Customer requested that ad materials be included in the shippment', 144), (10113, '2003-03-26', '2003-04-02', '2003-03-27', 'Shipped', NULL, 124),
        (10114, '2003-04-01', '2003-04-07', '2003-04-02', 'Shipped', NULL, 172), (10115, '2003-04-04', '2003-04-12', '2003-04-07', 'Shipped', NULL, 424),
        (10116, '2003-04-11', '2003-04-19', '2003-04-13', 'Shipped', NULL, 381), (10117, '2003-04-16', '2003-04-24', '2003-04-17', 'Shipped', NULL, 148),
        (10118, '2003-04-21', '2003-04-29', '2003-04-26', 'Shipped', 'Customer has worked with some of our vendors in the past and is aware of their MSRP', 216),
        (10119, '2003-04-28', '2003-05-05', '2003-05-02', 'Shipped', NULL, 382), (10120, '2003-04-29', '2003-05-08', '2003-05-01', 'Shipped', NULL, 114),
        (10121, '2003-05-07', '2003-05-13', '2003-05-13', 'Shipped', NULL, 353), (10122, '2003-05-08', '2003-05-16', '2003-05-13', 'Shipped', NULL, 350),
        (10123, '2003-05-20', '2003-05-29', '2003-05-22', 'Shipped', NULL, 103), (10124, '2003-05-21', '2003-05-29', '2003-05-25', 'Shipped', 'Customer very concerned about the exact color of the models.', 112) ON CONFLICT DO NOTHING;
    `);

    // 4. Eksekusi tabel orderdetails
    await prisma.$executeRawUnsafe(`
        INSERT INTO orderdetails (ordernumber, productcode, quantityordered, priceeach, orderlinenumber) VALUES 
        (10100, 'S18_1749', 30, '136.00', 3), (10100, 'S18_2248', 50, '55.09', 2), (10100, 'S18_4409', 22, '75.46', 4), (10100, 'S24_3969', 49, '35.29', 1),
        (10101, 'S18_2325', 25, '108.06', 4), (10101, 'S18_2795', 26, '167.06', 1), (10101, 'S24_1937', 45, '32.53', 3), (10101, 'S24_2022', 46, '44.35', 2),
        (10102, 'S18_1342', 39, '95.55', 2), (10102, 'S18_1367', 41, '43.13', 1), (10103, 'S10_1949', 26, '214.30', 11), (10103, 'S10_4962', 42, '119.67', 4),
        (10103, 'S12_1666', 27, '121.64', 8), (10103, 'S18_1097', 35, '94.50', 10), (10103, 'S18_2432', 22, '58.34', 2), (10103, 'S18_2949', 27, '92.19', 12),
        (10103, 'S18_2957', 35, '61.84', 14), (10103, 'S18_3136', 25, '86.92', 13), (10103, 'S18_3320', 46, '86.31', 16), (10103, 'S18_4600', 36, '98.07', 5),
        (10103, 'S18_4668', 41, '40.75', 9), (10103, 'S24_2300', 36, '107.34', 1), (10103, 'S24_4258', 25, '88.62', 15), (10103, 'S32_1268', 31, '92.46', 3),
        (10103, 'S32_3522', 45, '63.35', 7), (10103, 'S700_2824', 42, '94.07', 6), (10104, 'S12_3148', 34, '131.44', 1), (10104, 'S12_4473', 41, '111.39', 9),
        (10104, 'S18_2238', 24, '135.90', 8), (10104, 'S18_2319', 29, '122.73', 12), (10104, 'S18_3232', 23, '165.95', 13), (10104, 'S18_4027', 38, '119.20', 3),
        (10104, 'S24_1444', 35, '52.02', 6), (10104, 'S24_2840', 44, '30.41', 10), (10104, 'S24_4048', 26, '106.45', 5), (10104, 'S32_2509', 35, '51.95', 11),
        (10104, 'S32_3207', 49, '56.55', 4), (10104, 'S50_1392', 33, '114.59', 7), (10104, 'S50_1514', 32, '53.31', 2), (10105, 'S10_4757', 50, '127.84', 2),
        (10105, 'S12_1108', 41, '205.72', 15), (10105, 'S12_3891', 29, '141.88', 14), (10105, 'S18_3140', 22, '136.59', 11), (10105, 'S18_3259', 38, '87.73', 13),
        (10105, 'S18_4522', 41, '75.48', 10), (10105, 'S24_2011', 43, '117.97', 9), (10105, 'S24_3151', 44, '73.46', 4) ON CONFLICT DO NOTHING;
    `);

    // 5. Eksekusi tabel offices
    await prisma.$executeRawUnsafe(`
        INSERT INTO offices (officecode, city, phone, addressline1, addressline2, state, country, postalcode, territory) VALUES 
        ('1', 'San Francisco', '+1 650 219 4782', '100 Market Street', 'Suite 300', 'CA', 'USA', '94080', 'NA'),
        ('2', 'Boston', '+1 215 837 0825', '1550 Court Place', 'Suite 102', 'MA', 'USA', '02107', 'NA'),
        ('3', 'NYC', '+1 212 555 3000', '523 East 53rd Street', 'apt. 5A', 'NY', 'USA', '10022', 'NA'),
        ('4', 'Paris', '+33 14 723 4404', '43 Rue Jouffroy D''abbans', NULL, NULL, 'France', '75017', 'EMEA'),
        ('5', 'Tokyo', '+81 33 224 5000', '4-1 Kioicho', NULL, 'Chiyoda-Ku', 'Japan', '102-8578', 'Japan'),
        ('6', 'Sydney', '+61 2 9264 2451', '5-11 Wentworth Avenue', 'Floor #2', NULL, 'Australia', 'NSW 2010', 'APAC'),
        ('7', 'London', '+44 20 7877 2041', '25 Old Broad Street', 'Level 7', NULL, 'UK', 'EC2N 1HN', 'EMEA') ON CONFLICT DO NOTHING;
    `);

    // 6. Eksekusi tabel employees
    await prisma.$executeRawUnsafe(`
        INSERT INTO employees (employeenumber, lastname, firstname, extension, email, officecode, reportsto, jobtitle) VALUES 
        (1002, 'Murphy', 'Diane', 'x5800', 'dmurphy@classicmodelcars.com', '1', NULL, 'President'), (1056, 'Patterson', 'Mary', 'x4611', 'mpatterso@classicmodelcars.com', '1', 1002, 'VP Sales'),
        (1076, 'Firrelli', 'Jeff', 'x9273', 'jfirrelli@classicmodelcars.com', '1', 1002, 'VP Marketing'), (1088, 'Patterson', 'William', 'x4871', 'wpatterson@classicmodelcars.com', '6', 1056, 'Sales Manager (APAC)'),
        (1102, 'Bondur', 'Gerard', 'x5408', 'gbondur@classicmodelcars.com', '4', 1056, 'Sale Manager (EMEA)'), (1143, 'Bow', 'Anthony', 'x5428', 'abow@classicmodelcars.com', '1', 1056, 'Sales Manager (NA)'),
        (1165, 'Jennings', 'Leslie', 'x3291', 'ljennings@classicmodelcars.com', '1', 1143, 'Sales Rep'), (1166, 'Thompson', 'Leslie', 'x4065', 'lthompson@classicmodelcars.com', '1', 1143, 'Sales Rep'),
        (1188, 'Firrelli', 'Julie', 'x2173', 'jfirrelli@classicmodelcars.com', '2', 1143, 'Sales Rep'), (1216, 'Patterson', 'Steve', 'x4334', 'spatterson@classicmodelcars.com', '2', 1143, 'Sales Rep'),
        (1286, 'Tseng', 'Foon Yue', 'x2248', 'ftseng@classicmodelcars.com', '3', 1143, 'Sales Rep'), (1323, 'Vanauf', 'George', 'x4102', 'gvanauf@classicmodelcars.com', '3', 1143, 'Sales Rep'),
        (1337, 'Bondur', 'Loui', 'x6493', 'lbondur@classicmodelcars.com', '4', 1102, 'Sales Rep'), (1370, 'Hernandez', 'Gerard', 'x2028', 'ghernande@classicmodelcars.com', '4', 1102, 'Sales Rep'),
        (1401, 'Castillo', 'Pamela', 'x2759', 'pcastillo@classicmodelcars.com', '4', 1102, 'Sales Rep'), (1501, 'Bott', 'Larry', 'x2311', 'lbott@classicmodelcars.com', '7', 1102, 'Sales Rep'),
        (1504, 'Jones', 'Barry', 'x102', 'bjones@classicmodelcars.com', '7', 1102, 'Sales Rep'), (1611, 'Fixter', 'Andy', 'x101', 'afixter@classicmodelcars.com', '6', 1088, 'Sales Rep'),
        (1612, 'Marsh', 'Peter', 'x102', 'pmarsh@classicmodelcars.com', '6', 1088, 'Sales Rep'), (1619, 'King', 'Tom', 'x103', 'tking@classicmodelcars.com', '6', 1088, 'Sales Rep'),
        (1621, 'Nishi', 'Mami', 'x101', 'mnishi@classicmodelcars.com', '5', 1056, 'Sales Rep'), (1625, 'Kato', 'Yoshimi', 'x102', 'ykato@classicmodelcars.com', '5', 1621, 'Sales Rep'),
        (1702, 'Gerard', 'Martin', 'x2312', 'mgerard@classicmodelcars.com', '4', 1102, 'Sales Rep') ON CONFLICT DO NOTHING;
    `);

    // 7. Eksekusi tabel productlines
    await prisma.$executeRawUnsafe(`
        INSERT INTO productlines (productline, textdescription, htmldescription, image) VALUES 
        ('Classic Cars', 'Attention car enthusiasts: Make your wildest car ownership dreams come true...', NULL, NULL),
        ('Motorcycles', 'Our motorcycles are state of the art replicas of classic as well as contemporary...', NULL, NULL),
        ('Trucks and Buses', 'The Truck and Bus models are realistic replicas of buses and specialized trucks...', NULL, NULL) ON CONFLICT DO NOTHING;
    `);

    // 8. Eksekusi tabel products
    await prisma.$executeRawUnsafe(`
        INSERT INTO products (productcode, productname, productline, productscale, productvendor, productdescription, quantityinstock, buyprice, msrp) VALUES 
        ('S10_1678', '1969 Harley Davidson Ultimate Chopper', 'Motorcycles', '1:10', 'Min Lin Diecast', 'This replica features working kickstand, front suspension...', 7933, 48.81, 95.70),
        ('S10_1949', '1952 Alpine Renault 1300', 'Classic Cars', '1:10', 'Classic Metal Creations', 'Turnable front wheels; steering function; detailed interior...', 7305, 98.58, 214.30) ON CONFLICT DO NOTHING;
    `);

    // 9. Eksekusi tabel customers
    await prisma.$executeRawUnsafe(`
        INSERT INTO customers (customernumber, customername, contactlastname, contactfirstname, phone, addressline1, addressline2, city, state, postalcode, country, salesrepemployeenumber, creditlimit) VALUES 
        (103, 'Atelier graphique', 'Schmitt', 'Carine ', '40.32.2555', '54, rue Royale', NULL, 'Nantes', NULL, '44000', 'France', 1370, '21000.00'),
        (112, 'Signal Gift Stores', 'King', 'Jean', '7025551838', '8489 Strong St.', NULL, 'Las Vegas', 'NV', '83030', 'USA', 1166, '71800.00'),
        (114, 'Australian Collectors, Co.', 'Ferguson', 'Peter', '03 9520 4555', '636 St Kilda Road', 'Level 3', 'Melbourne', 'Victoria', '3004', 'Australia', 1611, '117300.00'),
        (119, 'La Rochelle Gifts', 'Labrune', 'Janine ', '40.67.8555', '67, rue des Cinquante Otages', NULL, 'Nantes', NULL, '44000', 'France', 1370, '118200.00'),
        (121, 'Baane Mini Imports', 'Bergulfsen', 'Jonas ', '07-98 9555', 'Erling Skakkes gate 78', NULL, 'Stavern', NULL, '4110', 'Norway', 1504, '81700.00'),
        (124, 'Mini Gifts Distributors Ltd.', 'Nelson', 'Susan', '4155551450', '5677 Strong St.', NULL, 'San Rafael', 'CA', '97562', 'USA', 1165, '210500.00'),
        (125, 'Havel & Zbyszek Co', 'Piestrzeniewicz', 'Zbyszek ', '(26) 642-7555', 'ul. Filtrowa 68', NULL, 'Warszawa', NULL, '01-012', 'Poland', NULL, '0.00'),
        (128, 'Blauer See Auto, Co.', 'Keitel', 'Roland', '+49 69 66 90 2555', 'Lyonerstr. 34', NULL, 'Frankfurt', NULL, '60528', 'Germany', 1504, '59700.00'),
        (129, 'Mini Wheels Co.', 'Murphy', 'Julie', '6505555787', '5557 North Pendale Street', NULL, 'San Francisco', 'CA', '94217', 'USA', 1165, '64600.00'),
        (131, 'Land of Toys Inc.', 'Lee', 'Kwai', '2125557818', '897 Long Airport Avenue', NULL, 'NYC', 'NY', '10022', 'USA', 1323, '114900.00'),
        (141, 'Euro+ Shopping Channel', 'Freyre', 'Diego ', '(91) 555 94 44', 'C/ Moralzarzal, 86', NULL, 'Madrid', NULL, '28034', 'Spain', 1370, '227600.00'),
        (144, 'Volvo Model Replicas, Co', 'Berglund', 'Christina ', '0921-12 3555', 'Berguvsvägen  8', NULL, 'Luleå', NULL, 'S-958 22', 'Sweden', 1504, '53100.00'),
        (145, 'Danish Wholesale Imports', 'Petersen', 'Jytte ', '31 12 3555', 'Vinbæltet 34', NULL, 'Kobenhavn', NULL, '1734', 'Denmark', 1401, '83400.00'),
        (146, 'Saveley & Henriot, Co.', 'Saveley', 'Mary ', '78.32.5555', '2, rue du Commerce', NULL, 'Lyon', NULL, '69004', 'France', 1337, '123900.00'),
        (148, 'Dragon Souveniers, Ltd.', 'Natividad', 'Eric', '+65 221 7555', 'Bronz Sok.', 'Bronz Apt. 3/6 Tesvikiye', 'Singapore', NULL, '079903', 'Singapore', 1621, '103800.00'),
        (151, 'Muscle Machine Inc', 'Young', 'Jeff', '2125557413', '4092 Furth Circle', 'Suite 400', 'NYC', 'NY', '10022', 'USA', 1286, '138500.00'),
        (157, 'Diecast Classics Inc.', 'Leong', 'Kelvin', '2155551555', '7586 Pompton St.', NULL, 'Allentown', 'PA', '70267', 'USA', 1216, '100600.00'),
        (161, 'Technics Stores Inc.', 'Hashimoto', 'Juri', '6505556809', '9408 Furth Circle', NULL, 'Burlingame', 'CA', '94217', 'USA', 1165, '84600.00'),
        (166, 'Handji Gifts& Co', 'Victorino', 'Wendy', '+65 224 1555', '106 Linden Road Sandown', '2nd Floor', 'Singapore', NULL, '069045', 'Singapore', 1612, '97900.00'),
        (167, 'Herkku Gifts', 'Oeztan', 'Veysel', '+47 2267 3215', 'Brehmen St. 121', 'PR 334 Sentrum', 'Bergen', NULL, 'N 5804', 'Norway  ', 1504, '96800.00'),
        (168, 'American Souvenirs Inc', 'Franco', 'Keith', '2035557845', '149 Spinnaker Dr.', 'Suite 101', 'New Haven', 'CT', '97823', 'USA', 1286, '0.00'),
        (169, 'Porto Imports Co.', 'de Castro', 'Isabel ', '(1) 356-5555', 'Estrada da saúde n. 58', NULL, 'Lisboa', NULL, '1756', 'Portugal', NULL, '0.00'),
        (171, 'Daedalus Designs Imports', 'Rancé', 'Martine ', '20.16.1555', '184, chaussée de Tournai', NULL, 'Lille', NULL, '59000', 'France', 1370, '82900.00'),
        (172, 'La Corne D''abondance, Co.', 'Bertrand', 'Marie', '(1) 42.34.2555', '265, boulevard Charonne', NULL, 'Paris', NULL, '75012', 'France', 1337, '84300.00'),
        (173, 'Cambridge Collectables Co.', 'Tseng', 'Jerry', '6175555555', '4658 Baden Av.', NULL, 'Cambridge', 'MA', '51247', 'USA', 1188, '43400.00'),
        (175, 'Gift Depot Inc.', 'King', 'Julie', '2035552570', '25593 South Bay Ln.', NULL, 'Bridgewater', 'CT', '97562', 'USA', 1323, '84300.00'),
        (177, 'Osaka Souveniers Co.', 'Kentary', 'Mory', '+81 06 6342 5555', '1-6-20 Dojima', NULL, 'Kita-ku', 'Osaka', ' 530-0003', 'Japan', 1621, '81200.00'),
        (181, 'Vitachrome Inc.', 'Frick', 'Michael', '2125551500', '2678 Kingston Rd.', 'Suite 101', 'NYC', 'NY', '10022', 'USA', 1286, '76400.00'),
        (186, 'Toys of Finland, Co.', 'Karttunen', 'Matti', '90-224 8555', 'Keskuskatu 45', NULL, 'Helsinki', NULL, '21240', 'Finland', 1501, '96500.00'),
        (187, 'AV Stores, Co.', 'Ashworth', 'Rachel', '(171) 555-1555', 'Fauntleroy Circus', NULL, 'Manchester', NULL, 'EC2 5NT', 'UK', 1501, '136800.00'),
        (189, 'Clover Collections, Co.', 'Cassidy', 'Dean', '+353 1862 1555', '25 Maiden Lane', 'Floor No. 4', 'Dublin', NULL, '2', 'Ireland', 1504, '69400.00'),
        (198, 'Auto-Moto Classics Inc.', 'Taylor', 'Leslie', '6175558428', '16780 Pompton St.', NULL, 'Brickhaven', 'MA', '58339', 'USA', 1216, '23000.00'),
        (201, 'UK Collectables, Ltd.', 'Devon', 'Elizabeth', '(171) 555-2282', '12, Berkeley Gardens Blvd', NULL, 'Liverpool', NULL, 'WX1 6LT', 'UK', 1501, '92700.00'),
        (202, 'Canadian Gift Exchange Network', 'Tamuri', 'Yoshi ', '(604) 555-3392', '1900 Oak St.', NULL, 'Vancouver', 'BC', 'V3F 2K1', 'Canada', 1323, '90300.00'),
        (204, 'Online Mini Collectables', 'Barajas', 'Miguel', '6175557555', '7635 Spinnaker Dr.', NULL, 'Brickhaven', 'MA', '58339', 'USA', 1188, '68700.00'),
        (205, 'Toys4GrownUps.com', 'Young', 'Julie', '6265557265', '78934 Hillside Dr.', NULL, 'Pasadena', 'CA', '90003', 'USA', 1166, '90700.00') ON CONFLICT DO NOTHING;
    `);

    // 10. Nyalakan kembali pengecekan Foreign Key
    await prisma.$executeRawUnsafe(`SET session_replication_role = 'origin';`);

    console.log('✅ Seeding data berhasil diselesaikan!');
}

main()
    .catch((e) => {
        console.error('❌ Gagal melakukan seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });