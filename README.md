# NIT Sports Auction Platform

A production-grade full-stack MERN auction website for managing live sports auctions with real-time bidding, team management, and budget tracking.

## 🎯 Overview

This platform enables professional cricket auction management with:
- Real-time live bidding with Socket.IO
- Complete player and team management
- Automatic budget enforcement
- Smart resale mechanism for budget management
- Comprehensive audit logs and summary reports
- Professional UI optimized for projector display

## 🏗️ Tech Stack

- **Frontend**: Next.js 15+ (App Router), React 19, JSX, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO
- **Authentication**: JWT Tokens
- **File Uploads**: Cloudinary/Local Support
- **Security**: Bcryptjs for password hashing

## 📦 Project Structure

```
auction2/
├── app/
│   ├── api/
│   │   ├── auth/route.js                 # Authentication endpoints
│   │   ├── players/route.js              # Player CRUD operations
│   │   ├── teams/route.js                # Team CRUD operations
│   │   └── auction/route.js              # Auction state management
│   ├── admin/
│   │   ├── login/page.jsx                # Admin login
│   │   ├── dashboard/page.jsx            # Admin dashboard
│   │   ├── players/page.jsx              # Player management
│   │   ├── teams/page.jsx                # Team management
│   │   └── auction/page.jsx              # Live auction control
│   ├── viewer/
│   │   └── live/page.jsx                 # Live auction viewer
│   ├── summary/page.jsx                  # Auction summary
│   ├── page.jsx                          # Landing page
│   ├── layout.jsx                        # Root layout
│   └── globals.css                       # Global styles
├── components/
│   ├── Button.jsx                        # Reusable button
│   ├── Input.jsx                         # Input field
│   ├── Card.jsx                          # Card wrapper
│   ├── Modal.jsx                         # Modal dialog
│   ├── Badge.jsx                         # Badge component
│   ├── Header.jsx                        # Page header
│   ├── AdminSidebar.jsx                  # Admin navigation
│   ├── LoadingSpinner.jsx                # Loading indicator
│   ├── EmptyState.jsx                    # Empty state display
│   ├── Alert.jsx                         # Alert component
│   └── Pagination.jsx                    # Pagination control
├── hooks/
│   ├── useSocket.js                      # Socket.IO hooks
│   └── useAPI.js                         # API request hooks
├── lib/
│   ├── db/
│   │   └── connection.js                 # MongoDB connection
│   ├── models/
│   │   ├── User.js                       # User schema
│   │   ├── Player.js                     # Player schema
│   │   ├── Team.js                       # Team schema
│   │   ├── AuctionLog.js                 # Auction log schema
│   │   └── AuctionState.js               # Auction state schema
│   ├── services/
│   │   ├── userService.js                # User logic
│   │   ├── playerService.js              # Player logic
│   │   ├── teamService.js                # Team logic
│   │   └── auctionService.js             # Auction logic
│   └── utils/
│       ├── jwt.js                        # JWT utilities
│       ├── password.js                   # Password hashing
│       ├── validation.js                 # Input validation
│       ├── response.js                   # API responses
│       └── formatters.js                 # Data formatting
├── middleware/
│   └── auth.js                           # Authentication middleware
├── socket/
│   └── socketHandler.js                  # Socket.IO setup
├── public/                               # Static assets
├── package.json                          # Dependencies
├── next.config.js                        # Next.js config
├── tailwind.config.js                    # Tailwind config
├── postcss.config.js                     # PostCSS config
└── jsconfig.json                         # Path aliases
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   cd Auction2
   npm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/nit-sports-auction
   JWT_SECRET=your_very_long_secure_secret_key_here
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin_secure_password_123
   ```

3. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Landing Page: http://localhost:3000
   - Admin Login: http://localhost:3000/admin/login
   - Live Viewer: http://localhost:3000/viewer/live
   - Summary: http://localhost:3000/summary

## 📋 Database Models

### User Schema
```javascript
{
  username: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['admin', 'viewer']),
  email: String,
  isActive: Boolean,
  timestamps
}
```

### Player Schema
```javascript
{
  name: String (required),
  department: String (required),
  category: String (required),
  skills: [String],
  basePrice: Number (default: 50),
  photoUrl: String,
  status: String (enum: ['available', 'sold', 'unsold', 'resold']),
  soldTo: ObjectId (ref: Team),
  soldPrice: Number,
  soldAt: Date,
  isResold: Boolean,
  timestamps
}
```

### Team Schema
```javascript
{
  name: String (unique, required),
  captain: String (required),
  budgetTotal: Number (default: 1000),
  budgetRemaining: Number (default: 1000),
  budgetSpent: Number (default: 0),
  players: [ObjectId] (ref: Player),
  logo: String,
  timestamps
}
```

### AuctionLog Schema
```javascript
{
  playerId: ObjectId (ref: Player),
  playerName: String,
  teamId: ObjectId (ref: Team),
  teamName: String,
  basePrice: Number,
  soldPrice: Number,
  status: String (enum: ['sold', 'unsold', 'resold']),
  soldAt: Date,
  timestamps
}
```

### AuctionState Schema
```javascript
{
  status: String (enum: ['not_started', 'in_progress', 'completed']),
  currentPlayerIndex: Number,
  currentBid: Number,
  currentBidder: ObjectId (ref: Team),
  startedAt: Date,
  completedAt: Date,
  timestamps
}
```

## 🔐 Authentication

- Admin login with JWT tokens
- Tokens stored in localStorage
- Protected admin routes with middleware
- Automatic token refresh on page load
- Secure password hashing with bcryptjs

## 🎮 API Endpoints

### Authentication
- `POST /api/auth` - Login/Register

### Players
- `GET /api/players` - Get all players
- `GET /api/players?id=ID` - Get specific player
- `POST /api/players` - Create player (admin)
- `PUT /api/players` - Update player (admin)
- `DELETE /api/players?id=ID` - Delete player (admin)

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams?id=ID` - Get specific team
- `POST /api/teams` - Create team (admin)
- `PUT /api/teams` - Update team (admin)
- `DELETE /api/teams?id=ID` - Delete team (admin)

### Auction
- `GET /api/auction?action=state` - Get auction state
- `GET /api/auction?action=logs` - Get auction logs
- `POST /api/auction` with action:
  - `initialize` - Initialize new auction
  - `start` - Start auction
  - `bid` - Place bid
  - `sell` - Sell player
  - `unsold` - Mark player unsold
  - `resale` - Trigger resale
  - `complete` - Complete auction

## 🏃 Auction Workflow

### 1. Setup Phase
- Create 8 teams with captains
- Add 56 players with departments, categories, skills
- Set base prices and default budget

### 2. Initialization
- Admin initializes auction state
- All teams reset to 1000 points budget
- Auction state persists in database

### 3. Auction Execution
- Admin starts auction
- Players displayed one by one
- Teams place bids through admin interface
- Current bid and highest bidder displayed in real-time
- Live viewer sees updates without refresh

### 4. Player Sale
- Admin selects selling team
- Budget auto-deducted from team
- Player assigned to team
- Status changes to 'sold'
- Auction logs entry created

### 5. Resale Mechanism
When a team runs out of budget before 7 players:
- System identifies highest-priced purchased player
- Player automatically removed from team
- Budget refunded to team
- Player marked as 'resold'
- Player returns to auction pool

### 6. Completion
- Admin marks auction complete
- All data persisted
- Summary reports generated
- Detailed logs available for download

## 🎨 UI Features

### Admin Interface
- Clean dashboard with stats
- Player management cards with edit/delete
- Team budget tracking and visualization
- Real-time auction control panel
- Bid management modal
- Sell player modal

### Viewer Display
- Large, projector-friendly interface
- Current player card with details
- Real-time bid updates
- Teams leaderboard with budget status
- Animated bidding indicators
- Professional animations and transitions

### Summary Page
- Team standings with budget breakdown
- Auction logs table
- Detailed statistics
- Print-friendly layout
- Final squad composition

## 🔒 Security Features

- JWT-based authentication
- Protected admin routes
- Password hashing with bcryptjs
- Input validation on frontend and backend
- CORS configuration
- Environment variables for sensitive data
- Database connection pooling

## 📊 Performance Optimizations

- Efficient database queries with indexing
- Connection pooling with MongoDB
- Lazy loading of components
- Optimized re-renders with React hooks
- Image optimization for Cloudinary
- CSS minification with Tailwind

## 🧪 Testing

### Manual Testing Checklist
- [ ] Player CRUD operations
- [ ] Team creation and budget tracking
- [ ] Auction bid placement
- [ ] Player sale and budget deduction
- [ ] Resale mechanism trigger
- [ ] Auction completion flow
- [ ] Summary report generation
- [ ] Admin authentication
- [ ] Live viewer updates

## 📝 Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/nit-sports-auction

# JWT
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_chars
JWT_EXPIRY=7d

# API
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000

# Cloudinary (Optional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin_secure_password_123

# Environment
NODE_ENV=development
```

## 🚀 Production Deployment

### Build
```bash
npm run build
npm start
```

### MongoDB Atlas Setup
1. Create cluster on MongoDB Atlas
2. Copy connection string
3. Update `MONGODB_URI` in `.env.local`

### Environment Variable Management
- Use `.env.local` for local development
- Use `.env.production` for production
- Never commit secrets to repository

### Performance Tips
- Enable database indexing
- Use CDN for static assets
- Implement database backups
- Monitor server logs
- Setup error tracking (e.g., Sentry)

## 🤝 Contributing

- Follow the existing code structure
- Use consistent naming conventions
- Add comments for complex logic
- Test changes before committing
- Update documentation as needed

## 📄 License

This project is for NIT Sports Auction system. All rights reserved.

## 📞 Support

For issues and questions:
1. Check the documentation
2. Review similar issues
3. Contact development team

---

**Version**: 1.0.0  
**Last Updated**: April 2025  
**Status**: Production Ready
#   N I T - S p o r t s - A u c t i o n  
 