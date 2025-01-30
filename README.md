# Menu Management API

This is a **Node.js** and **Express** application using **Sequelize** (ORM) for managing categories, subcategories, and items. The API supports CRUD operations for categories, subcategories, and items, including tax handling and search functionality.

## Features
- CRUD operations for **Categories**, **Subcategories**, and **Items**
- Tax inheritance from Category → Subcategory → Items
- Search API for items
- Proper error handling and validations

## Technologies And Package Used
- **Node.js**
- **Express.js**
- **Sequelize (ORM)**
- **PostgreSQL / MySQL**
- **dotenv** for environment variables

---

## Setup and Installation

### **1. Clone the Repository**
```bash
git clone https://github.com/harshitg27/menu-management
cd menu-management-api
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Configure Environment Variables**
Create a **.env** file in the root directory and add the following:
```env
SERVER_PORT = 7000
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=yourpassword
DB_DATABASE=menu_management
DB_DIALECT=mysql # or postgres
```

### **4. Set Up the Database**
If you are using **PostgreSQL** or **MySQL**, create a database manually or use Sequelize migrations:
```bash
npx sequelize db:create
npx sequelize db:migrate
```

### **5. Run the Application**
```bash
npm start
```
The server should now be running on **http://localhost:7000**.

---

## API Endpoints

### **Category APIs**
- **Create a Category** → `POST /category/create`
- **Get All Categories** → `GET /category/getall`
- **Get Category by ID** → `GET /category/get/:id`
- **Get Category by Name** → `GET /category/get/:name`
- **Update a Category** → `PUT /category/update/:id`

### **Subcategory APIs**
- **Create a Subcategory** → `POST /subcategory/create`
- **Get All Subcategories** → `GET /subcategory/getall`
- **Get Subcategory by ID** → `GET /subcategory/get/:id`
- **Get Subcategory by Name** → `GET /subcategory/get/:name`
- **Get Subcategory by Category ID** → `GET /subcategory/category/:categoryId`
- **Update a Subcategory** → `PUT /subcategory/update/:id`

### **Item APIs**
- **Create an Item** → `POST /items/create`
- **Get All Items** → `GET /items/getall`
- **Get Item by ID** → `GET /items/get/:id`
- **Get Item by Name** → `GET items/get/:name`
- **Get Item by Category ID** → `GET /items/category/:categoryId`
- **Get Item by SubCategory ID** → `GET /items/subcategory/:subCategoryId`
- **Search Items by Name** → `GET /items/search?name=iPhone 14`
- **Update an Item** → `PUT /items/update/:id`

---

## Testing the API
You can use **Postman** or **cURL** to test the API.

Example **cURL request** to create a category:
```bash
curl -X POST http://localhost:7000/categories/create -H "Content-Type: application/json" -d '{"name": "Electronics", "image": "url", "description": "Category for electronics", "taxApplicability": true, "tax": 10}'
```

Example **Postman request** to search for an item:
```
GET http://localhost:7000/items/search?name=iphone
```

---

## Contributing
Feel free to contribute by submitting a pull request!

---

### **Author:**
**Harshit Gupta**  
📧 Email: Harshitg1710@gmail.com
🔗 GitHub: [Harshitg27](https://github.com/harshitg27)

