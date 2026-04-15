# API Documentation

## Authentication Endpoints

### Login
```
POST /api/auth
Content-Type: application/json

{
  "action": "login",
  "username": "admin",
  "password": "admin_secure_password_123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "user_id",
      "username": "admin",
      "role": "admin"
    }
  }
}
```

## Player Endpoints

### Get All Players
```
GET /api/players
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "_id": "player_id",
      "name": "John Doe",
      "department": "CSE",
      "category": "Batsman",
      "basePrice": 50,
      "skills": ["Batting", "Fielding"],
      "status": "available",
      "createdAt": "2025-04-15T...",
      "updatedAt": "2025-04-15T..."
    }
  ]
}
```

### Get Specific Player
```
GET /api/players?id=player_id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": { player_object }
}
```

### Create Player
```
POST /api/players
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "department": "CSE",
  "category": "Batsman",
  "basePrice": 50,
  "skills": ["Batting", "Fielding"]
}

Response:
{
  "success": true,
  "message": "Player created successfully",
  "data": { player_object }
}
```

### Update Player
```
PUT /api/players
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": "player_id",
  "name": "Updated Name",
  "skills": ["New Skills"]
}

Response:
{
  "success": true,
  "message": "Player updated successfully",
  "data": { player_object }
}
```

### Delete Player
```
DELETE /api/players?id=player_id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Player deleted successfully"
}
```

## Team Endpoints

### Get All Teams
```
GET /api/teams
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "_id": "team_id",
      "name": "Titans",
      "captain": "John Doe",
      "budgetTotal": 1000,
      "budgetRemaining": 800,
      "budgetSpent": 200,
      "players": ["player_id1", "player_id2"],
      "createdAt": "2025-04-15T...",
      "updatedAt": "2025-04-15T..."
    }
  ]
}
```

### Get Specific Team
```
GET /api/teams?id=team_id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": { team_object }
}
```

### Create Team
```
POST /api/teams
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Titans",
  "captain": "John Doe"
}

Response:
{
  "success": true,
  "message": "Team created successfully",
  "data": { team_object }
}
```

### Update Team
```
PUT /api/teams
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": "team_id",
  "name": "Updated Team Name",
  "captain": "New Captain"
}

Response:
{
  "success": true,
  "message": "Team updated successfully",
  "data": { team_object }
}
```

### Delete Team
```
DELETE /api/teams?id=team_id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Team deleted successfully"
}
```

## Auction Endpoints

### Get Auction State
```
GET /api/auction?action=state
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "_id": "state_id",
    "status": "in_progress",
    "currentPlayerIndex": 5,
    "currentBid": 150,
    "currentBidder": "team_id",
    "startedAt": "2025-04-15T...",
    "completedAt": null
  }
}
```

### Get Auction Logs
```
GET /api/auction?action=logs
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "_id": "log_id",
      "playerId": "player_id",
      "playerName": "John Doe",
      "teamId": "team_id",
      "teamName": "Titans",
      "basePrice": 50,
      "soldPrice": 150,
      "status": "sold",
      "soldAt": "2025-04-15T..."
    }
  ]
}
```

### Initialize Auction
```
POST /api/auction
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "initialize"
}

Response:
{
  "success": true,
  "message": "Auction state initialized",
  "data": { auction_state_object }
}
```

### Start Auction
```
POST /api/auction
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "start"
}

Response:
{
  "success": true,
  "message": "Auction started",
  "data": { updated_auction_state }
}
```

### Place Bid
```
POST /api/auction
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "bid",
  "teamId": "team_id",
  "bidAmount": 200
}

Response:
{
  "success": true,
  "message": "Bid placed",
  "data": { updated_auction_state }
}
```

### Sell Player
```
POST /api/auction
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "sell",
  "teamId": "team_id",
  "playerId": "player_id",
  "soldPrice": 200
}

Response:
{
  "success": true,
  "message": "Player sold",
  "data": {
    "player": { player_object },
    "team": { team_object },
    "log": { auction_log_object }
  }
}
```

### Mark Player Unsold
```
POST /api/auction
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "unsold",
  "playerId": "player_id"
}

Response:
{
  "success": true,
  "message": "Player marked unsold",
  "data": {
    "player": { player_object },
    "log": { auction_log_object }
  }
}
```

### Handle Resale
```
POST /api/auction
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "resale",
  "teamId": "team_id"
}

Response:
{
  "success": true,
  "message": "Player resold" or "No resale needed",
  "data": {
    "player": { player_object },
    "team": { team_object },
    "log": { auction_log_object }
  } or null
}
```

### Complete Auction
```
POST /api/auction
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "complete"
}

Response:
{
  "success": true,
  "message": "Auction completed",
  "data": { updated_auction_state }
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No authentication token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Field is required", "Field must be valid"]
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "An error occurred"
}
```

## Rate Limiting

- No rate limiting implemented in development
- Recommended for production: 100 requests/minute per IP

## CORS

Allowed origins (from next.config.js):
- http://localhost:3000
- Production domain (configure in deployment)

## Socket.IO Events

### Client → Server Events
- `join-auction`: Join auction room
- `place-bid`: Broadcast bid placed
- `player-sold`: Broadcast player sale
- `auction-state-changed`: Broadcast state change

### Server → Client Events
- `user-joined`: New user joined
- `bid-placed`: Bid update
- `player-sold`: Player sale update
- `state-updated`: Auction state update
- `user-left`: User disconnected

---

**Last Updated**: April 2025
**API Version**: 1.0.0
