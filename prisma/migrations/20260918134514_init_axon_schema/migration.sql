-- CreateTable
CREATE TABLE "productlines" (
    "productline" VARCHAR(50) NOT NULL,
    "textdescription" TEXT,
    "htmldescription" TEXT,
    "image" BYTEA,

    CONSTRAINT "productlines_pkey" PRIMARY KEY ("productline")
);

-- CreateTable
CREATE TABLE "products" (
    "productcode" VARCHAR(15) NOT NULL,
    "productname" VARCHAR(70) NOT NULL,
    "productline" VARCHAR(50),
    "productscale" VARCHAR(10) NOT NULL,
    "productvendor" VARCHAR(50) NOT NULL,
    "productdescription" TEXT NOT NULL,
    "quantityinstock" SMALLINT NOT NULL,
    "buyprice" DECIMAL(10,2) NOT NULL,
    "msrp" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("productcode")
);

-- CreateTable
CREATE TABLE "offices" (
    "officecode" VARCHAR(10) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "addressline1" VARCHAR(50) NOT NULL,
    "addressline2" VARCHAR(50),
    "state" VARCHAR(50),
    "country" VARCHAR(50) NOT NULL,
    "postalcode" VARCHAR(15) NOT NULL,
    "territory" VARCHAR(10) NOT NULL,

    CONSTRAINT "offices_pkey" PRIMARY KEY ("officecode")
);

-- CreateTable
CREATE TABLE "employees" (
    "employeenumber" INTEGER NOT NULL,
    "lastname" VARCHAR(50) NOT NULL,
    "firstname" VARCHAR(50) NOT NULL,
    "extension" VARCHAR(10) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "officecode" VARCHAR(10),
    "reportsto" INTEGER,
    "jobtitle" VARCHAR(50) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("employeenumber")
);

-- CreateTable
CREATE TABLE "customers" (
    "customernumber" INTEGER NOT NULL,
    "customername" VARCHAR(50) NOT NULL,
    "contactlastname" VARCHAR(50) NOT NULL,
    "contactfirstname" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "addressline1" VARCHAR(50) NOT NULL,
    "addressline2" VARCHAR(50),
    "city" VARCHAR(50) NOT NULL,
    "state" VARCHAR(50),
    "postalcode" VARCHAR(15),
    "country" VARCHAR(50) NOT NULL,
    "salesrepemployeenumber" INTEGER,
    "creditlimit" DECIMAL(10,2),

    CONSTRAINT "customers_pkey" PRIMARY KEY ("customernumber")
);

-- CreateTable
CREATE TABLE "orders" (
    "ordernumber" INTEGER NOT NULL,
    "orderdate" DATE NOT NULL,
    "requireddate" DATE NOT NULL,
    "shippeddate" DATE,
    "status" VARCHAR(15) NOT NULL,
    "comments" TEXT,
    "customernumber" INTEGER,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("ordernumber")
);

-- CreateTable
CREATE TABLE "orderdetails" (
    "ordernumber" INTEGER NOT NULL,
    "productcode" VARCHAR(15) NOT NULL,
    "quantityordered" INTEGER NOT NULL,
    "priceeach" DECIMAL(10,2) NOT NULL,
    "orderlinenumber" SMALLINT NOT NULL,

    CONSTRAINT "orderdetails_pkey" PRIMARY KEY ("ordernumber","productcode")
);

-- CreateTable
CREATE TABLE "payments" (
    "customernumber" INTEGER,
    "checknumber" VARCHAR(50) NOT NULL,
    "paymentdate" DATE NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("checknumber")
);

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_productline_fkey" FOREIGN KEY ("productline") REFERENCES "productlines"("productline") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_officecode_fkey" FOREIGN KEY ("officecode") REFERENCES "offices"("officecode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_reportsto_fkey" FOREIGN KEY ("reportsto") REFERENCES "employees"("employeenumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_salesrepemployeenumber_fkey" FOREIGN KEY ("salesrepemployeenumber") REFERENCES "employees"("employeenumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customernumber_fkey" FOREIGN KEY ("customernumber") REFERENCES "customers"("customernumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderdetails" ADD CONSTRAINT "orderdetails_ordernumber_fkey" FOREIGN KEY ("ordernumber") REFERENCES "orders"("ordernumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderdetails" ADD CONSTRAINT "orderdetails_productcode_fkey" FOREIGN KEY ("productcode") REFERENCES "products"("productcode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_customernumber_fkey" FOREIGN KEY ("customernumber") REFERENCES "customers"("customernumber") ON DELETE SET NULL ON UPDATE CASCADE;
