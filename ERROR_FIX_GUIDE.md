# Error Fix Guide - PGRST205 "Table Not Found"

## The Problem

You were seeing this error:

```
fetch to https://...supabase.co/rest/v1/captions?select=...
failed with status 404 and body:
{"code":"PGRST205","message":"Could not find the table 'public.captions' in the schema cache"}
```

## What Was Wrong

The database tables (`captions` and `likes`) didn't exist in your Supabase project yet. The app was trying to query them, causing crashes.

## What I Fixed

### 1. **Error Handling on Home Page** (`/app/page.tsx`)
- Wrapped all database queries in try/catch
- Detects PGRST205 errors specifically
- Shows a friendly error message instead of crashing
- Provides clear next steps (Setup Guide button)
- Added "Refresh Page" button to retry after setup

### 2. **Graceful Error Display** (`/app/page.tsx`)
- If database error occurs, shows:
  - Error message explaining what's wrong
  - Step-by-step instructions to fix it
  - Link to detailed setup guide
  - Refresh button to retry

### 3. **Setup Guide Page** (`/app/setup/page.tsx`)
- NEW: Dedicated setup page with visual guides
- Step-by-step instructions with checkmarks
- Shows exactly where to copy the SQL from
- Troubleshooting section
- Link back to main app

### 4. **Form Error Handling** (`/components/caption-submit-form.tsx`)
- Detects PGRST205 errors when submitting captions
- Shows helpful error message
- Tells users to run migration and refresh

### 5. **Like Button Error Handling** (`/components/caption-card.tsx`)
- Silently fails if database is unavailable
- Reverts like state if operation fails
- No crash, graceful degradation

## How It Works Now

### Scenario 1: Database Not Set Up
1. User visits app → Sees error message
2. User clicks "Setup Guide" → Detailed setup page
3. User runs SQL migration → Refreshes page
4. App loads successfully

### Scenario 2: Database Already Set Up
1. User visits app → Captions feed loads
2. User can submit captions and vote
3. Everything works normally

### Scenario 3: User Tries to Submit When DB Down
1. User clicks "Submit Caption"
2. Gets error: "Database tables not initialized"
3. Doesn't freeze, can retry later

### Scenario 4: User Tries to Like When DB Down
1. User clicks heart button
2. Animation plays locally
3. Silently fails to save like
4. Like count reverts when request fails
5. No error shown (graceful)

## Files Changed

- `/app/page.tsx` - Added error handling + setup link
- `/app/setup/page.tsx` - NEW setup guide page
- `/components/caption-card.tsx` - Simplified error handling
- `/components/caption-submit-form.tsx` - Better error messages
- `/ERROR_FIX_GUIDE.md` - This guide

## Key Improvements

✅ **No more crashes** - All database errors are caught and handled
✅ **Clear messaging** - Users know exactly what's wrong
✅ **Easy setup** - Setup guide walks through every step
✅ **Graceful degradation** - Missing DB doesn't break the UI
✅ **User-friendly** - Simple buttons to fix or retry

## To Use the Fixed App

1. Go to http://localhost:3000
2. If you see the error box, click "Setup Guide →"
3. Follow the 5-step setup process
4. Click "Refresh Page" when done
5. App should now work perfectly

## Testing

Try these to verify the fixes work:

1. **Test error display** (if tables don't exist yet)
   - Visit home page → See error message
   - Error message is clear and actionable

2. **Test setup guide**
   - Click "Setup Guide" button
   - See step-by-step instructions
   - Click back to home

3. **Test after setup**
   - Run SQL migration
   - Refresh page
   - Captions feed should load
   - Submit/vote features work

4. **Test form errors**
   - Try submitting caption
   - Check console for any errors
   - Should show friendly message

## Summary

The app is now **bulletproof** against the PGRST205 error. Even if the database tables don't exist, users get a helpful setup guide instead of a broken page. Once they run the migration, everything works perfectly.

All error states are handled gracefully, and the user experience is smooth from start to finish.
