# 🔧 Troubleshooting Guide

Common issues and their solutions for the NIT Sports Auction Platform.

---

## 🚀 Startup Issues

### Issue: "Port 3000 Already in Use"

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

**Windows:**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace <PID> with actual ID)
taskkill /PID <PID> /F

# Or use Next.js default
npm run dev -- -p 3001
```

**macOS/Linux:**
```bash
# Find process
lsof -i :3000

# Kill process (replace <PID> with actual ID)
kill -9 <PID>

# Or change port
npm run dev -- -p 3001
```

---

### Issue: "Module Not Found"

**Error Message:**
```
Error: Cannot find module 'next'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

---

### Issue: "Environment Variable Not Found"

**Error Message:**
```
ReferenceError: process.env.MONGODB_URI is undefined
```

**Solution:**
1. Ensure `.env.local` exists in root directory
2. Verify all required variables are set:
   ```bash
   cat .env.local
   ```
3. Check variable names exactly (case-sensitive)
4. Restart dev server after changes:
   ```bash
   npm run dev
   ```

---

## 💾 Database Issues

### Issue: "MongoDB Connection Failed"

**Error Message:**
```
MongooseError: Cannot connect to MongoDB
```

**Solution:**

**For Local MongoDB:**
```bash
# Check if MongoDB is running
mongosh

# If not installed, verify installation
mongod --version

# Start MongoDB
mongod

# On macOS with Homebrew
brew services start mongodb-community
```

**For MongoDB Atlas:**
1. Go to mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/nit-sports-auction
   ```
5. Whitelist your IP address
6. Add database user credentials

---

### Issue: "Authentication Failed to MongoDB"

**Error:**
```
MongoAuthenticationError: Authentication failed
```

**Solution:**
1. Verify credentials in connection string
2. Check username/password are URL-encoded if they contain special chars
3. Ensure user has access to the database
4. Check IP whitelist in MongoDB Atlas

---

### Issue: "Database Is Empty"

**Solution:**
```bash
# Option 1: Seed database with sample data
node scripts/seedDatabase.js

# Option 2: Manually add data through admin interface
# 1. Login to admin dashboard
# 2. Create teams
# 3. Add players
```

---

### Issue: "Database Operations Slow"

**Solutions:**
1. Check if indexes are created:
   ```bash
   # In mongosh
   use nit-sports-auction
   db.players.createIndex({ status: 1 })
   db.teams.createIndex({ name: 1 }, { unique: true })
   ```

2. Review query performance
3. Increase database resources
4. Archive old auction logs

---

## 🔐 Authentication Issues

### Issue: "Login Failed with Correct Credentials"

**Error:**
```
Invalid credentials
```

**Solution:**
1. Check if admin user exists:
   ```bash
   mongosh
   use nit-sports-auction
   db.users.find()
   ```

2. If no users exist, seed database:
   ```bash
   node scripts/seedDatabase.js
   ```

3. Verify password hashing:
   ```bash
   # In .env.local verify
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin_secure_password_123
   ```

---

### Issue: "JWT Token Not Working"

**Error:**
```
Invalid or expired token
```

**Solution:**
1. Check token is being stored:
   ```javascript
   // In browser console
   localStorage.getItem('token')
   ```

2. Verify JWT_SECRET in .env.local
3. Check token expiry:
   ```javascript
   // In browser console
   const token = localStorage.getItem('token');
   console.log(JSON.parse(atob(token.split('.')[1])));
   ```

4. Clear storage and re-login:
   ```javascript
   localStorage.clear()
   // Reload page and login again
   ```

---

### Issue: "Cannot Access Admin Pages"

**Error:**
```
Redirected to login page
```

**Solution:**
1. Ensure you're logged in:
   ```bash
   # Check localStorage
   localStorage.getItem('token')
   ```

2. Token may have expired:
   - Login again

3. Check network response:
   - Open DevTools (F12) → Network tab
   - Check if API returns 401 Unauthorized

---

## 🌐 API Issues

### Issue: "API Requests Failing"

**Error in Console:**
```
Cross-Origin Request Blocked (CORS)
```

**Solution:**
1. Check API URL in `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

2. Verify API endpoint URL matches environment
3. Check if dev server is running
4. Clear browser cache

---

### Issue: "404 Not Found on API Route"

**Error:**
```
POST /api/players 404 (Not Found)
```

**Solution:**
1. Verify file exists at correct path:
   ```
   app/api/players/route.js
   ```

2. Check route file syntax
3. Restart dev server
4. Verify API URL in env variables

---

### Issue: "Validation Error on Player Creation"

**Error:**
```
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Player name is required"]
}
```

**Solution:**
1. Check all required fields are filled:
   - Name (required)
   - Department (required)
   - Category (required)
   - Base Price (required, minimum 50)

2. Verify data types:
   - basePrice should be number, not string

---

## 🎨 Frontend Issues

### Issue: "Styles Not Loading"

**Symptoms:**
- Page looks unstyled
- No background colors
- Text looks plain

**Solution:**
```bash
# Rebuild Tailwind CSS
npm run dev

# Clear cache
rm -rf .next

# Restart
npm run dev
```

---

### Issue: "Components Not Rendering"

**Symptoms:**
- Blank page
- Partial content
- JavaScript errors in console

**Solution:**
1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Clear cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

---

### Issue: "Modal Not Closing"

**Solution:**
1. Check onClose handler is properly passed
2. Verify modal state management
3. Check browser console for errors
4. Refresh page if stuck

---

## 🔌 Socket.IO Issues

### Issue: "Real-time Updates Not Working"

**Symptoms:**
- Live viewer doesn't update
- No real-time bid changes
- WebSocket connection errors

**Solution:**
1. Enable Socket.IO debug:
   ```javascript
   // In browser console
   localStorage.debug = '*'
   ```

2. Check WebSocket connection:
   ```javascript
   // Check in console
   // Look for "Socket.IO connection established"
   ```

3. Verify Socket.IO URL:
   ```
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
   ```

4. Check firewall isn't blocking WebSocket

---

### Issue: "WebSocket Connection Refused"

**Error:**
```
WebSocket connection failed
```

**Solution:**
1. Ensure dev server is running
2. Check port 3000 is accessible
3. Verify no SSL issues
4. Check browser WebSocket support

---

## 🔄 Auction Logic Issues

### Issue: "Budget Not Deducting"

**Scenario:**
- Player sold but team budget unchanged

**Solution:**
1. Check team budget in Teams page
2. Refresh page to see latest data
3. Check database directly:
   ```bash
   mongosh
   use nit-sports-auction
   db.teams.findOne({})
   ```

4. Check auction logs created properly

---

### Issue: "Cannot Sell Player - Budget Error"

**Error:**
```
Insufficient budget for this bid
```

**Solution:**
1. Check team's remaining budget
2. Try lower bid amount
3. Trigger resale if team has players
4. Check other teams' budgets for comparison

---

### Issue: "Resale Not Triggering"

**Scenario:**
- Team has < 7 players and no budget
- Resale button not working

**Solution:**
1. Ensure team has at least 1 player purchased
2. Check team budget is actually 0
3. Click "Resale" button multiple times if needed
4. Check browser console for errors

---

### Issue: "Cannot Mark Player Unsold"

**Solution:**
1. Ensure player is in auction
2. Check auction is in progress
3. Verify admin is logged in
4. Try refreshing page

---

## 📊 Data Issues

### Issue: "Players Not Showing in Auction"

**Symptoms:**
- Auction page blank
- No current player displayed

**Solution:**
1. Verify players exist in database
2. Check player status is "available"
3. Go to Players page and add/verify players
4. Refresh page

---

### Issue: "Duplicate Player Data"

**Solution:**
1. Check database directly
2. Delete duplicates via admin interface
3. Reseed database if necessary:
   ```bash
   # WARNING: Deletes all data
   mongosh
   use nit-sports-auction
   db.dropDatabase()
   
   # Then seed
   node scripts/seedDatabase.js
   ```

---

### Issue: "Old Auction Data Still Showing"

**Solution:**
1. Complete current auction properly
2. Initialize new auction
3. Or reset database for fresh start

---

## 📱 Browser Issues

### Issue: "Page Doesn't Render on Mobile"

**Solution:**
1. Check responsive design:
   - Open DevTools
   - Toggle device toolbar
   - Test different screen sizes

2. Verify Tailwind responsive classes used

---

### Issue: "localStorage Issues"

**Symptoms:**
- Logged in but redirected to login
- Settings not remembered

**Solution:**
```javascript
// Clear all storage
localStorage.clear()
sessionStorage.clear()

// Re-login
```

---

### Issue: "Browser Console Errors"

**Action Steps:**
1. Open DevTools (F12)
2. Check Console tab
3. Follow error messages for guidance
4. Search for error message online

---

## 🖥️ Server Issues

### Issue: "Build Fails"

**Error:**
```
Build failed
```

**Solution:**
1. Check for TypeScript errors (should be JSX only)
2. Verify all imports are correct
3. Check for syntax errors
4. Try clean build:
   ```bash
   rm -rf .next
   npm run build
   ```

---

### Issue: "Out of Memory Error"

**Error:**
```
JavaScript heap out of memory
```

**Solution:**
```bash
# Increase Node.js memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

---

## 🔍 Debugging Tips

### Enable Debug Logging
```javascript
// Browser console
localStorage.debug = '*'

// Restart and check console for Socket.IO events
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action
4. Check request/response details

### Database Exploration
```bash
# Connect to MongoDB
mongosh

# View databases
show dbs

# Select database
use nit-sports-auction

# View collections
show collections

# Query data
db.players.find()
db.teams.find()
db.users.find()
```

### Check Logs
```bash
# Next.js dev server logs show in terminal
# Check for warnings and errors

# Check MongoDB logs
# Location varies by OS and installation
```

---

## 🚨 Emergency Reset

If everything goes wrong:

```bash
# 1. Stop dev server
# Press Ctrl+C

# 2. Clear Next.js cache
rm -rf .next

# 3. Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 4. Reset database (WARNING: DATA LOSS)
mongosh
use nit-sports-auction
db.dropDatabase()

# 5. Exit mongosh
exit

# 6. Seed fresh data
node scripts/seedDatabase.js

# 7. Restart dev server
npm run dev
```

---

## 📞 Still Having Issues?

1. **Check Documentation**
   - [README.md](./README.md)
   - [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
   - [ARCHITECTURE.md](./ARCHITECTURE.md)

2. **Check Browser Console**
   - F12 → Console tab
   - Look for error messages
   - Check Network tab

3. **Check MongoDB Connection**
   - Verify MongoDB is running
   - Test connection string

4. **Check Environment Variables**
   - Verify .env.local exists
   - All required variables set
   - Restart dev server

5. **Try Clean Rebuild**
   - Clear cache and node_modules
   - Reinstall dependencies
   - Restart everything

---

**Still stuck?** Review the main documentation files or check the project structure for clues!

---

**Last Updated**: April 2025
**Version**: 1.0.0
