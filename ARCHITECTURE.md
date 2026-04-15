# System Architecture

## Overview Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  Browser (Admin)           │         Browser (Viewer)            │
│  - Dashboard               │         - Live Display              │
│  - Players Management      │         - Real-time Updates         │
│  - Teams Management        │         - No Edit Access            │
│  - Auction Control         │         - Optimized UI              │
└──────────┬──────────────────────────────────────────┬────────────┘
           │                                          │
           │ HTTP/HTTPS                              │
           │ JWT Authentication                      │
           ▼                                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS SERVER (App Router)               │
├─────────────────────────────────────────────────────────────────┤
│  API Routes (/api)                                              │
│  ├── /auth          - Authentication                           │
│  ├── /players       - Player CRUD                              │
│  ├── /teams         - Team CRUD                                │
│  └── /auction       - Auction Management                       │
│                                                                 │
│  Pages (/app) - Server Components + Client Components          │
│  ├── Admin Routes                                              │
│  ├── Viewer Routes                                             │
│  └── Summary Page                                              │
└──────────┬──────────────────────────────────────────┬───────────┘
           │                                          │
           │ Socket.IO                               │ REST API
           │ WebSocket Connection                    │ JWT Auth
           ▼                                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  Services                                                       │
│  ├── userService.js      - User Management                     │
│  ├── playerService.js    - Player Operations                   │
│  ├── teamService.js      - Team Operations                     │
│  └── auctionService.js   - Auction Logic                       │
│                                                                 │
│  Middleware                                                     │
│  └── auth.js             - JWT Verification                    │
│                                                                 │
│  Socket Handler                                                │
│  └── socketHandler.js    - Real-time Events                   │
└──────────┬──────────────────────────────────────────┬───────────┘
           │                                          │
           │ Mongoose ODM                            │ Database Queries
           │ Object Mapping                          │ Schema Validation
           ▼                                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│  Mongoose Models                                                │
│  ├── User          - Admin Accounts                            │
│  ├── Player        - Player Information                        │
│  ├── Team          - Team Data & Budget                        │
│  ├── AuctionLog    - Bid History                               │
│  └── AuctionState  - Live Auction State                        │
│                                                                 │
│  MongoDB Database                                               │
│  └── Collections with Indexes                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

### Admin Hierarchy
```
AdminLayout
├── Header (Logout, User Info)
│
├── AdminSidebar (Navigation)
│
└── Main Content
    ├── Dashboard
    │   └── Stats Cards
    │
    ├── Players Page
    │   ├── PlayerList
    │   │   └── PlayerCard (Edit/Delete)
    │   └── AddPlayerModal
    │
    ├── Teams Page
    │   ├── TeamList
    │   │   └── TeamCard (Budget Bar, Stats)
    │   └── AddTeamModal
    │
    └── Auction Page
        ├── CurrentPlayerDisplay
        │   ├── PlayerCard
        │   ├── BidInfo
        │   └── Controls (Place Bid, Sell, Unsold)
        │
        ├── TeamLeaderboard
        │   └── TeamStatus
        │
        └── Modals
            ├── BidModal
            └── SellModal
```

### Viewer Hierarchy
```
ViewerLayout (No Auth Required)
└── LiveAuctionDisplay
    ├── Header (Status Badge)
    │
    ├── MainContent
    │   ├── PlayerDisplay
    │   │   ├── PlayerCard (Large)
    │   │   ├── Stats Grid
    │   │   ├── Skills
    │   │   └── Status Badge
    │   │
    │   └── BiddingIndicator (Animated)
    │
    └── TeamsPanel
        └── TeamCards (Budget Status)
```

## Data Flow

### Player Creation Flow
```
Admin Input
    ↓
Validation (Frontend)
    ↓
POST /api/players
    ↓
Validation (Backend)
    ↓
Player Model Save
    ↓
MongoDB Insert
    ↓
Response to Frontend
    ↓
Update UI Component State
```

### Auction Bidding Flow
```
Admin Places Bid
    ↓
POST /api/auction (action: bid)
    ↓
Verify Team Budget
    ↓
Update AuctionState
    ↓
Emit Socket Event
    ↓
Viewer Receives Live Update
    ↓
Update UI in Real-time
```

### Player Sale Flow
```
Admin Selects Team & Price
    ↓
POST /api/auction (action: sell)
    ↓
Transaction Start
├── Update Player Status
├── Add to Team Players
├── Deduct Team Budget
└── Create AuctionLog
    ↓
Transaction Commit
    ↓
Emit Socket Event
    ↓
Update All Clients
    ↓
Move to Next Player
```

### Resale Flow
```
Team Out of Budget & <7 Players
    ↓
POST /api/auction (action: resale)
    ↓
Find Highest Priced Player
    ↓
Start Transaction
├── Update Player Status → Resold
├── Remove from Team
├── Refund Budget
└── Create Resale Log
    ↓
Commit Transaction
    ↓
Add Player Back to Pool
    ↓
Emit Socket Event
```

## State Management

### Client-Side State (React Hooks)
```
useAPI Hook
├── request, loading, error
└── Used by: useAuth, page components

useSocket Hook
├── socket, isConnected
└── Real-time event listeners

useAuctionSocket Hook
├── auctionState
├── currentBid
├── notifications
└── Multi-event listener
```

### Server-Side State (Database)
```
AuctionState Collection
├── status (not_started, in_progress, completed)
├── currentPlayerIndex
├── currentBid
├── currentBidder
├── startedAt, completedAt
└── Updated on every action

Player Document
├── status (available, sold, unsold, resold)
├── soldTo (team reference)
├── soldPrice, soldAt
└── Updated on sale/resale

Team Document
├── budgetRemaining, budgetSpent
├── players array (references)
└── Updated on every sale
```

## Authentication Flow

```
User Enters Credentials
        ↓
POST /api/auth (action: login)
        ↓
Verify Username/Password
        ↓
Generate JWT Token
        ↓
Return Token + User Info
        ↓
Client Stores in localStorage
        ↓
Include Token in HTTP Headers
Authorization: Bearer <token>
        ↓
Middleware Verifies Token
        ↓
Attach User to Request
        ↓
Route Handler Processes
        ↓
Response to Client
```

## Socket.IO Real-time Flow

```
Client Connects
    ↓
JOIN message → Server
    ↓
Server joins 'auction-room'
    ↓
Client Listens for Events
├── state-updated
├── bid-placed
├── player-sold
└── user-joined/left
    ↓
Admin Performs Action
    ↓
Server Emits Event to Room
    ↓
All Connected Clients Receive
    ↓
UI Updates (No Page Refresh)
```

## Database Schema Relationships

```
┌──────────────┐
│    User      │
│──────────────│
│ _id (PK)     │
│ username     │
│ role         │
└──────────────┘

┌──────────────┐       ┌──────────────┐
│   Player     │──────→│    Team      │
│──────────────│    1:M│──────────────│
│ _id (PK)     │       │ _id (PK)     │
│ name         │       │ players(FK)[]│
│ status       │       │ budgetSpent  │
│ soldTo (FK)──┼───────→ captain      │
│ soldPrice    │       └──────────────┘
│ soldAt       │
└──────────────┘

┌──────────────────┐
│   AuctionLog     │
│──────────────────│
│ _id (PK)         │
│ playerId (FK)    │
│ teamId (FK)      │
│ soldPrice        │
│ status           │
│ soldAt           │
└──────────────────┘

┌──────────────────┐
│  AuctionState    │
│──────────────────│
│ _id (PK)         │
│ status           │
│ currentBidder(FK)│
│ currentBid       │
│ currentPlayerIdx │
└──────────────────┘
```

## API Request/Response Pattern

### Standard Response Format
```javascript
{
  success: true/false,
  message: "Human readable message",
  data: { /* response payload */ } or null,
  statusCode: 200/400/401/403/500,
  error: { /* error details */ } // Only on error
}
```

### Request Authentication
```
Headers:
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

## Performance Optimizations

### Client-Side
- React lazy loading
- Component memoization
- Input debouncing
- Connection pooling
- Asset caching

### Server-Side
- Database indexing on commonly queried fields
- Connection pooling (MongoDB)
- Query optimization
- Response compression
- Rate limiting (recommended)

### Database
- Indexed queries on: username, status, team name
- Aggregation for complex queries
- Connection pool: 10-50 connections
- Read replicas for observers (if available)

## Scalability Considerations

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Optimize queries and indexes
- Implement caching layer (Redis)

### Horizontal Scaling
- Multiple server instances
- Load balancer (Nginx, HAProxy, ALB)
- Database replication
- Session storage in Redis
- Socket.IO adapter for broadcasting

### Auction Scale
- Current: 8 teams, 56 players
- Can handle: Unlimited players and teams
- Limitations: Real-time updates depend on Socket.IO connections
- Recommended: <1000 concurrent viewers per instance

---

**Last Updated**: April 2025
**Version**: 1.0.0
