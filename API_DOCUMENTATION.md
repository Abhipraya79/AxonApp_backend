# Axon Sales BI Dashboard API - Documentation

## 📋 API Endpoints (18 Total)

Base URL: `http://localhost:5000`

---

## 🏠 Menu 1: Analytics (`/api/analytics`)

### 1. GET `/api/analytics/kpi`
**Description:** Main dashboard KPI metrics
**Response:**
```json
{
  "success": true,
  "message": "KPI metrics retrieved successfully",
  "data": {
    "totalRevenue": 9604190.85,
    "totalProfit": 4251567.23,
    "totalCustomers": 122,
    "totalEmployees": 23
  }
}
```

### 2. GET `/api/analytics/sales-trend`
**Description:** Monthly sales trend for charts
**Response:**
```json
{
  "success": true,
  "message": "Sales trend data retrieved successfully",
  "data": [
    {
      "period": "2003-01",
      "totalOrders": 35,
      "totalRevenue": 587432.10
    }
  ]
}
```

### 3. GET `/api/analytics/customer-distribution`
**Description:** Customer count by country (pie chart)
**Response:**
```json
{
  "success": true,
  "message": "Customer distribution by country retrieved successfully",
  "data": [
    {
      "country": "USA",
      "customerCount": 36
    }
  ]
}
```

---

## 📦 Menu 2: Products (`/api/products`)

### 4. GET `/api/products`
**Query Params:** `?page=1&limit=20&search=toyota`
**Description:** Product catalog with pagination
**Response:**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 110,
      "totalPages": 6
    }
  }
}
```

### 5. GET `/api/products/top-selling`
**Query Params:** `?limit=10`
**Description:** Top 10 best-selling products

### 6. GET `/api/products/categories`
**Description:** Revenue analysis by product line (proves Classic Cars dominance)

### 7. GET `/api/products/unsold`
**Description:** Dead stock - products never ordered

---

## 👥 Menu 3: Customers (`/api/customers`)

### 8. GET `/api/customers`
**Query Params:** `?page=1&limit=20&search=euro`
**Description:** CRM customer list with sales rep info

### 9. GET `/api/customers/top`
**Query Params:** `?limit=5`
**Description:** Top 5 VIP customers by revenue

---

## 🛒 Menu 4: Orders (`/api/orders`)

### 10. GET `/api/orders`
**Query Params:** `?page=1&limit=20&status=Shipped`
**Description:** Order history with customer details

### 11. GET `/api/orders/on-hold`
**Description:** Actionable list for CS - orders stuck on hold

### 12. GET `/api/orders/shipping-delays`
**Query Params:** `?limit=20`
**Description:** Logistics evaluation - longest delivery times

---

## 🏢 Menu 5: Offices (`/api/offices`)

### 13. GET `/api/offices/performance`
**Description:** Regional performance by office location
**Chain:** offices → employees → customers → orders

---

## 💰 Menu 6: Finances (`/api/finances`)

### 14. GET `/api/finances/payments`
**Query Params:** `?page=1&limit=20`
**Description:** Payment history with customer names

### 15. GET `/api/finances/revenue-vs-cash`
**Description:** Compare expected revenue vs actual cash received
**Response:**
```json
{
  "success": true,
  "message": "Revenue vs cash flow comparison retrieved successfully",
  "data": {
    "expectedRevenue": 9604190.85,
    "actualCash": 8853839.23,
    "difference": 750351.62,
    "collectionRate": 92.19,
    "status": "Outstanding"
  }
}
```

---

## 🧑‍💼 Menu 7: Performance (`/api/performance`)

### 16. GET `/api/performance/employees`
**Description:** Sales rep performance - customer count, orders, revenue

### 17. GET `/api/performance/teams`
**Description:** Manager team performance - grouped by reportsto

### 18. GET `/api/performance/vendors`
**Description:** Vendor analysis - products supplied, quantity sold, revenue

---

## 🔧 Standard Response Format

All endpoints follow PRD standard:

```json
{
  "success": true,
  "message": "Clear description",
  "data": { ... }
}
```

---

## 📊 BI Dashboard Sidebar Structure

```
📊 Main Dashboard          → /api/analytics/*
📦 Products & Inventory    → /api/products/*
👥 Customer Management     → /api/customers/*
🛒 Orders & Logistics      → /api/orders/*
🏢 Regional Offices        → /api/offices/performance
💰 Finance & Cash Flow     → /api/finances/*
🧑‍💼 HR & Vendor Performance → /api/performance/*
```

---

## 🚀 Quick Test

```bash
# Health check
curl http://localhost:5000/api/health

# Test KPI
curl http://localhost:5000/api/analytics/kpi

# Test top customers
curl http://localhost:5000/api/customers/top?limit=5
```
