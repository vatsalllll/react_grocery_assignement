# Grocery App - Full Stack Project

A full-stack grocery shopping application built with Node.js, Express, MongoDB, and React Native.

## 📚 Learning Objectives

- Build RESTful APIs with Express.js and MongoDB
- Implement Mongoose schemas with validation
- Create React Native mobile interfaces
- Fetch and display data from backend APIs
- Handle loading, error, and success states in mobile apps
- Work with environment variables and configuration
- Test APIs with proper error handling

## 🎯 Project Overview

**Backend:** Node.js + Express + MongoDB (Atlas)
- RESTful API with 3 main endpoints
- Product model with validation
- CORS enabled for mobile access
- Environment-based configuration

**Frontend:** React Native (Expo)
- Product listing screen
- Pull-to-refresh functionality
- Responsive card-based UI
- Error and loading states

## ✅ Prerequisites

### Required Software

1. **Node.js** (v16 or higher)
   ```bash
   node --version  # Should be v16+
   ```

2. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

3. **MongoDB Atlas Account** (Cloud database)
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get your connection string

4. **Expo CLI** (for React Native)
   ```bash
   npm install -g expo-cli
   ```

5. **Mobile Testing** (choose one):
   - iOS Simulator (macOS only) - Install Xcode
   - Android Emulator - Install Android Studio
   - Expo Go app on physical device

## 🚀 Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables

### 3. Configure Environment Variables

Create `.env` file (already exists):

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/grocery_homework
PORT=5000
NODE_ENV=development
```

**Important:** Replace `username` and `password` with your actual MongoDB Atlas credentials.

### 4. Seed the Database

Populate the database with sample products:

```bash
npm run seed
```

You should see:
```
✅ Connected to MongoDB successfully
📦 Database: grocery_homework
✅ Successfully inserted 6 products
```

### 5. Start the Backend Server

```bash
npm start
```

Server should be running on `http://localhost:5000`

You should see:
```
✅ Connected to MongoDB successfully
🚀 Server is running on port 5000
📍 Products endpoint: http://localhost:5000/products
```

## 📱 Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure API Base URL

**This is the most important step!** Open `screens/ProductsScreen.js` and update line 13:

```javascript
const API_BASE = 'http://YOUR_IP_HERE:5000';
```

#### IP Configuration Guide:

| Environment | API_BASE Value | Notes |
|------------|----------------|-------|
| **iOS Simulator** | `http://localhost:5000` | Works directly with localhost |
| **Android Emulator** | `http://10.0.2.2:5000` | Special IP that maps to host machine |
| **Physical Device (Same WiFi)** | `http://192.168.x.x:5000` | Your computer's LAN IP address |

#### Finding Your IP Address:

**macOS:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}'
```

**Windows:**
```bash
ipconfig
# Look for "IPv4 Address" under your active network adapter
```

**Linux:**
```bash
hostname -I | awk '{print $1}'
```

**Example:**
```javascript
const API_BASE = 'http://192.168.1.100:5000';  // Your computer's IP
```

### 4. Start the Expo App

```bash
npm start
```

This opens Expo DevTools. Then:

- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Scan QR code with **Expo Go** app on your phone (iOS/Android)

### 5. Verify the App Works

You should see:
- A green header "Grocery Products"
- List of 6 products with images
- Each card showing name, category, price, and stock
- Pull down to refresh

## 🧪 Testing Guide

### Test All Endpoints with curl

Make sure your backend server is running first (`npm start` in backend directory).

#### 1. Test GET /products (List all products)

```bash
curl http://localhost:5000/products
```

Expected response:
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "_id": "...",
      "name": "Fresh Apples",
      "price": 3.99,
      "category": "Fruits",
      "stock": 100,
      ...
    }
  ]
}
```

**Test with query parameters:**

```bash
# Search by name
curl "http://localhost:5000/products?q=apple"

# Filter by category
curl "http://localhost:5000/products?category=Fruits"

# Combine filters
curl "http://localhost:5000/products?q=organic&category=Fruits"
```

#### 2. Test GET /products/:id (Get single product)

First, get a product ID from the list above, then:

```bash
# Replace with actual product ID
curl http://localhost:5000/products/6937032f3125982206238b9c
```

Expected response:
```json
{
  "success": true,
  "data": {
    "_id": "6937032f3125982206238b9c",
    "name": "Fresh Apples",
    "price": 3.99,
    ...
  }
}
```

**Test error cases:**

```bash
# Invalid ID format (should return 400)
curl http://localhost:5000/products/invalid123

# Non-existent ID (should return 404)
curl http://localhost:5000/products/507f1f77bcf86cd799439011
```

#### 3. Test POST /products (Create new product)

```bash
curl -X POST http://localhost:5000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fresh Oranges",
    "price": 4.99,
    "category": "Fruits",
    "description": "Sweet and juicy oranges",
    "stock": 75,
    "imageUrl": "https://images.unsplash.com/photo-1547514701-42782101795e"
  }'
```

Expected response (status 201):
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "...",
    "name": "Fresh Oranges",
    "price": 4.99,
    ...
  }
}
```

**Test validation errors:**

```bash
# Missing required field (name)
curl -X POST http://localhost:5000/products \
  -H "Content-Type: application/json" \
  -d '{"price": 4.99}'

# Missing required field (price)
curl -X POST http://localhost:5000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Product"}'

# Invalid price (negative)
curl -X POST http://localhost:5000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Product", "price": -5}'
```

### Verify in Mobile App

After creating a new product:
1. Pull down to refresh the list in the mobile app
2. New product should appear at the top
3. Verify all fields display correctly

## 🐛 Troubleshooting

### CORS Issues

**Symptom:** Frontend shows "Network request failed" or CORS error

**Solution:** 
- CORS is already enabled in `server.js`
- Make sure backend is running
- Check API_BASE URL is correct

### IP Address Configuration

#### Problem: "Network request failed" on mobile app

**For Android Emulator:**
```javascript
const API_BASE = 'http://10.0.2.2:5000';  // NOT localhost!
```

**For iOS Simulator:**
```javascript
const API_BASE = 'http://localhost:5000';  // localhost works
```

**For Physical Device:**
1. Connect phone and computer to **same WiFi network**
2. Find your computer's IP address (see "Finding Your IP Address" above)
3. Use that IP:
```javascript
const API_BASE = 'http://192.168.1.100:5000';  // Your actual IP
```
4. Make sure firewall allows port 5000

#### Testing IP Connection:

From your phone's browser, visit: `http://YOUR_IP:5000`

You should see:
```json
{
  "message": "Grocery Homework API is running",
  "status": "active",
  ...
}
```

### MongoDB Connection Problems

#### Error: "bad auth : authentication failed"

**Solution:**
1. Check your MongoDB Atlas password is correct in `.env`
2. Make sure you're using the correct username
3. URL-encode special characters in password:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`

#### Error: "MongoServerError: IP not whitelisted"

**Solution:**
1. Go to MongoDB Atlas dashboard
2. Navigate to Network Access
3. Add your current IP or use `0.0.0.0/0` (allow all - for development only)

### React Native Fetch Errors

#### Error: "Network request failed"

**Checklist:**
1. ✅ Backend server is running (`npm start` in backend folder)
2. ✅ API_BASE URL is correct for your environment
3. ✅ Phone and computer on same WiFi (for physical device)
4. ✅ Firewall allows port 5000
5. ✅ Test URL in browser first

#### Error: "JSON Parse error"

**Solution:**
- Backend is returning HTML instead of JSON
- Check backend console for errors
- Verify endpoint URL is correct (should be `/products` not `/api/products`)

#### Error: "Timeout"

**Solution:**
- Backend might be slow or not responding
- Check MongoDB connection is working
- Restart backend server

## 📂 Project Structure

```
grocery/
├── backend/
│   ├── models/
│   │   └── Product.js              # Mongoose schema
│   ├── routes/
│   │   └── products.js             # API routes
│   ├── server.js                   # Express app
│   ├── seed.js                     # Database seeding
│   ├── package.json                # Dependencies
│   ├── .env                        # Environment variables (not in git)
│   ├── .env.example                # Template
│   └── .gitignore
│
└── frontend/
    ├── screens/
    │   └── ProductsScreen.js       # Main screen
    ├── App.js                      # Root component
    ├── package.json                # Dependencies
    └── .gitignore

```

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/products` | List all products | - |
| GET | `/products?q=search` | Search products | - |
| GET | `/products?category=Fruits` | Filter by category | - |
| GET | `/products/:id` | Get single product | - |
| POST | `/products` | Create product | JSON (name, price required) |

## 📝 Product Schema

```javascript
{
  name: String (required, max 100 chars),
  price: Number (required, min 0),
  imageUrl: String (optional),
  category: String (optional),
  description: String (optional, max 500 chars),
  stock: Number (default 0, min 0),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## 🎓 What You Learned

- ✅ Building RESTful APIs with Express
- ✅ MongoDB integration with Mongoose
- ✅ Input validation and error handling
- ✅ Environment variable management
- ✅ React Native mobile development
- ✅ Async data fetching with useEffect
- ✅ State management in React
- ✅ Cross-platform mobile configuration
- ✅ API testing with curl
- ✅ Full-stack application integration

## 📞 Support

If you encounter issues:
1. Check the Troubleshooting section
2. Verify all prerequisites are installed
3. Make sure both servers are running
4. Check console logs for error messages

## 📄 License

ISC
