# API Routes

## Overview

This API implements a matching/swipe system with the following flow:
1. Users see a feed of profiles they haven't been shown yet
2. Users swipe accept/reject on profiles
3. When both users accept each other, a match is created
4. Matched users get a message thread created automatically

## Database Structure

### Collections

**feeds** - Tracks which users have been shown to each user
```
feeds/{userId}
  - shownUsers: string[] // Array of user IDs already shown
  - updatedAt: timestamp
```

**matches** - Stores match data
```
matches/{matchId} // matchId format: "userId1_userId2" (sorted)
  - users: string[] // Array of user IDs who accepted
  - status: 'pending' | 'matched'
  - createdAt: timestamp
  - matchedAt: timestamp (only when status is 'matched')
```

**messages** - Message threads for matched users
```
messages/{matchId}
  - participants: string[] // [userId1, userId2]
  - createdAt: timestamp
  - lastMessage: string | null
  - lastMessageAt: timestamp | null
```

---

## Feed API

Get unseen profiles for the authenticated user.

### Endpoint
`GET /api/feed`

### Authentication
```
Authorization: Bearer <firebase-id-token>
```

### Query Parameters
- `limit` (optional): Number of profiles to return (default: 20)

### Response
```json
{
  "feed": [
    {
      "id": "user123",
      "displayName": "John Doe",
      "bio": "...",
      // other user fields (email excluded)
    }
  ],
  "hasMore": true
}
```

### Usage
```typescript
import { useFeed } from '@/hooks/use-feed'

const { feed, loading, error, refresh } = useFeed(20)
```

---

## Swipe API

Accept or reject a user profile.

### Endpoint
`POST /api/swipe`

### Authentication
```
Authorization: Bearer <firebase-id-token>
```

### Request Body
```json
{
  "targetUserId": "user123",
  "action": "accept" // or "reject"
}
```

### Response
```json
{
  "success": true,
  "matched": true, // true if mutual match occurred
  "matchId": "user1_user2" // only present if matched
}
```

### Behavior
- **Reject**: Marks user as shown, no match created
- **Accept**: 
  - Marks user as shown
  - Creates/updates match entry
  - If other user already accepted → creates mutual match + message thread
  - If other user hasn't accepted yet → creates pending match

### Usage
```typescript
import { useSwipe } from '@/hooks/use-swipe'

const { accept, reject, loading } = useSwipe()

// Accept a user
const result = await accept('user123')
if (result?.matched) {
  console.log('It\'s a match!', result.matchId)
}

// Reject a user
await reject('user456')
```

---

## Matches API

Get all mutual matches for the authenticated user.

### Endpoint
`GET /api/matches`

### Authentication
```
Authorization: Bearer <firebase-id-token>
```

### Response
```json
{
  "matches": [
    {
      "matchId": "user1_user2",
      "user": {
        "id": "user2",
        "displayName": "Jane Doe",
        "bio": "..."
      },
      "matchedAt": "2026-02-06T..."
    }
  ]
}
```

### Usage
```typescript
import { useMatches } from '@/hooks/use-matches'

const { matches, loading, error, refresh } = useMatches()
```

---

## Setup

1. Get Firebase Admin SDK credentials:
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Download the JSON file

2. Add to `.env.local`:
   ```
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
   ```
   (Paste the entire JSON as a single line)

3. All API routes automatically verify user tokens and enforce authorization.

---

## Example: Complete Swipe Flow

```typescript
function SwipeComponent() {
  const { feed, loading: feedLoading, refresh } = useFeed()
  const { accept, reject, loading: swipeLoading } = useSwipe()
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleAccept = async () => {
    const user = feed[currentIndex]
    const result = await accept(user.id)
    
    if (result?.matched) {
      alert(`It's a match with ${user.displayName}!`)
    }
    
    setCurrentIndex(prev => prev + 1)
    if (currentIndex >= feed.length - 1) {
      refresh() // Load more profiles
    }
  }

  const handleReject = async () => {
    const user = feed[currentIndex]
    await reject(user.id)
    setCurrentIndex(prev => prev + 1)
  }

  if (feedLoading) return <div>Loading...</div>
  if (!feed[currentIndex]) return <div>No more profiles</div>

  return (
    <div>
      <ProfileCard user={feed[currentIndex]} />
      <button onClick={handleReject} disabled={swipeLoading}>
        Reject
      </button>
      <button onClick={handleAccept} disabled={swipeLoading}>
        Accept
      </button>
    </div>
  )
}
```
