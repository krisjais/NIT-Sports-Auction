# 🚀 Quick Start Guide

Get the NIT Sports Auction platform up and running in 5 minutes!

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- MongoDB ([Install](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Git

## Step 1: Clone and Install

```bash
# Navigate to project
cd Auction2

# Install dependencies
npm install
```

## Step 2: Setup Environment

```bash
# Create .env.local (already provided, but verify it exists)
cat .env.local

# Ensure MongoDB is running
# For local MongoDB:
mongod

# Or use MongoDB Atlas connection string
# Update MONGODB_URI in .env.local
```

## Step 3: Seed Database (Optional)

```bash
# If you want sample data
npm run seed

# Or manually add data through admin interface
```

## Step 4: Start Development Server

```bash
# Terminal 1: Start Next.js
npm run dev

# Server starts at http://localhost:3000
```

## Step 5: Access the Application

Open your browser and navigate to:

| Page | URL | Purpose |
|------|-----|---------|
| Landing | http://localhost:3000 | Project overview |
| Admin Login | http://localhost:3000/admin/login | Admin authentication |
| Admin Dashboard | http://localhost:3000/admin/dashboard | Admin hub |
| Players | http://localhost:3000/admin/players | Player management |
| Teams | http://localhost:3000/admin/teams | Team management |
| Auction | http://localhost:3000/admin/auction | Live auction control |
| Live Viewer | http://localhost:3000/viewer/live | Live auction display |
| Summary | http://localhost:3000/summary | Auction results |

## Default Credentials

```
Username: admin
Password: admin_secure_password_123
```

⚠️ **IMPORTANT**: Change these in `.env.local` for production!

## Workflow: Running Your First Auction

### 1. Create Teams
- Go to **Admin Dashboard** → **Teams**
- Click **+ Add Team** eight times
- Enter team names and captains

### 2. Add Players
- Go to **Players**
- Click **+ Add Player**
- Create 56 players (or start with a few)
- Fill in: Name, Department, Category, Base Price, Skills

### 3. Start Auction
- Go to **Auction**
- System auto-initializes auction state
- Click **Start Auction**

### 4. Conduct Auction
For each player:
1. View player card
2. Teams can place bids (**Place Bid** button)
3. Select highest bidder and click **Sell Player**
4. Or click **Mark Unsold** if no purchase
5. System auto-deducts budget

### 5. View Live
- On a separate browser/device
- Navigate to **http://localhost:3000/viewer/live**
- See real-time updates without refresh
- Optimized for large projector displays

### 6. Complete & View Summary
- After all players
- Click **Complete Auction**
- Go to **Summary** to see results
- Print or download report

## File Structure Overview

```
Auction2/
├── app/                    # Pages and routes
├── components/             # Reusable UI components
├── lib/
│   ├── models/            # Database schemas
│   ├── services/          # Business logic
│   ├── utils/             # Helper functions
│   └── db/                # Database connection
├── hooks/                 # Custom React hooks
├── middleware/            # Auth middleware
├── socket/                # WebSocket setup
├── public/                # Static assets
├── package.json           # Dependencies
├── next.config.js         # Next.js configuration
├── tsconfig.json          # Path aliases
└── .env.local             # Environment variables
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm start                # Start production server

# Database
node scripts/seedDatabase.js    # Seed with sample data

# Linting
npm run lint             # Run ESLint
```

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGODB_URI` | Database connection | `mongodb://localhost:27017/nit-sports-auction` |
| `JWT_SECRET` | Token encryption | Long random string (min 32 chars) |
| `NEXT_PUBLIC_API_URL` | API base URL | `http://localhost:3000` |
| `NEXT_PUBLIC_SOCKET_URL` | WebSocket URL | `http://localhost:3000` |
| `ADMIN_USERNAME` | Default admin | `admin` |
| `ADMIN_PASSWORD` | Default password | Your secure password |

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process on port 3000
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On macOS/Linux:
lsof -i :3000
kill -9 <PID>
```

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongosh

# If not installed, download from:
# https://www.mongodb.com/try/download/community
```

### Database Errors
```bash
# Reset database (WARNING: Deletes all data!)
# Delete MongoDB data folder and restart mongod
# Or in mongosh:
use nit-sports-auction
db.dropDatabase()
```

### CORS Issues
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify API and frontend URLs are accessible

## Performance Tips

1. **Local MongoDB**
   - Use local MongoDB for development
   - Provides faster queries
   - No network latency

2. **Browser DevTools**
   - Monitor Network tab for slow requests
   - Check Console for JavaScript errors
   - Use Performance tab for profiling

3. **Socket.IO Debug**
   - Add to browser console: `localStorage.debug = '*'`
   - See all Socket.IO events in console

## Next Steps

- 📖 Read [README.md](./README.md) for comprehensive documentation
- 🔌 Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
- 🚀 See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
- 🧪 Review code structure for custom modifications

## Need Help?

1. Check the main [README.md](./README.md)
2. Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
3. Check error messages in browser console
4. Verify MongoDB connection
5. Ensure all environment variables are set

---

**Happy Auctioning! 🏏**

For detailed information, see the [README.md](./README.md)
