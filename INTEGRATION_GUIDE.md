# API Integration Guide

## ✅ What's Been Integrated

The discover page now uses the Firebase Admin SDK API for:
- **Real-time feed** - Shows users not yet seen
- **Swipe actions** - Accept/reject with match detection
- **Match notifications** - Shows "It's a Match!" when mutual
- **Auto-refresh** - Loads more profiles as you swipe

## 🚀 How It Works

### Discover Page (`/discover`)
- Fetches unseen profiles from `/api/feed`
- Swipe up = accept, swipe down = reject
- Calls `/api/swipe` with each action
- Shows match notification on mutual matches
- Auto-refreshes when running low on profiles

### Matches Page (`/matches`)
- Shows all mutual matches
- Fetches from `/api/matches`
- Ready for messaging integration

## 📝 Next Steps

### 1. Set Up Firebase Admin Credentials

Add to your `.env.local`:
```bash
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}
```

Get this from:
- Firebase Console → Project Settings → Service Accounts
- Click "Generate New Private Key"
- Copy the entire JSON content as a single line

### 2. Test the Flow

1. Sign up/login as User A
2. Go to `/discover` and swipe
3. Sign up/login as User B (different browser/incognito)
4. Swipe on User A's profile
5. Both users should see match notification
6. Check `/matches` to see the match

### 3. Database Structure

The API automatically creates these collections:

**feeds/{userId}**
```json
{
  "shownUsers": ["user1", "user2"],
  "updatedAt": "timestamp"
}
```

**matches/{user1_user2}**
```json
{
  "users": ["user1", "user2"],
  "status": "matched",
  "matchedAt": "timestamp"
}
```

**messages/{matchId}**
```json
{
  "participants": ["user1", "user2"],
  "createdAt": "timestamp",
  "lastMessage": null
}
```

## 🔧 Customization

### Change Feed Algorithm

Edit `app/api/feed/route.ts` to add filtering:
```typescript
const unseenUsers = usersSnapshot.docs
  .filter(doc => 
    doc.id !== userId &&
    !shownUserIds.includes(doc.id) &&
    // Add your custom filters here
    doc.data().age >= 18 &&
    doc.data().location === userData.location
  )
```

### Add Match Scoring

Update the feed to sort by compatibility:
```typescript
.sort((a, b) => {
  const scoreA = calculateCompatibility(userData, a.data())
  const scoreB = calculateCompatibility(userData, b.data())
  return scoreB - scoreA
})
```

## 🎨 UI Components

All hooks are ready to use:

```typescript
// In any component
import { useFeed } from '@/hooks/use-feed'
import { useSwipe } from '@/hooks/use-swipe'
import { useMatches } from '@/hooks/use-matches'

const { feed, loading, refresh } = useFeed()
const { accept, reject } = useSwipe()
const { matches } = useMatches()
```

## 🔒 Security

- All routes verify Firebase auth tokens
- Users can only see their own matches
- Sensitive data (emails) is filtered out
- Feed tracking prevents duplicate shows

## 📱 Features Implemented

✅ Protected API routes with Firebase Admin SDK
✅ User authentication verification
✅ Feed generation (excludes shown users)
✅ Swipe accept/reject
✅ Mutual match detection
✅ Automatic message thread creation
✅ Match listing
✅ Loading states
✅ Error handling
✅ Match notifications
✅ Auto-refresh feed

## 🎯 Ready for Production

The integration is complete and ready to use! Just add your Firebase Admin credentials and start testing.
