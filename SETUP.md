# Jubilee Captions - Setup Guide

## Overview
This is a modern web application for collecting and voting on caption ideas for a college Jubilee event. Students can submit creative captions and vote for their favorites with an interactive like animation.

## Features
- ✨ Clean, modern UI with smooth animations
- 🔐 Email-based authentication with magic links
- 💬 Submit caption ideas with department selection
- 👍 Interactive like button with particle animations
- 📊 Real-time like count updates
- 🎨 Responsive design for all devices

## Setup Instructions

### 1. Create Database Tables

The app requires two main tables: `captions` and `likes`. Follow these steps:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query and copy the entire contents of `/scripts/001_create_tables.sql`
4. Execute the query

This will create:
- `public.captions` - Stores all caption submissions
- `public.likes` - Tracks which users liked which captions
- Row Level Security (RLS) policies for data protection
- Indexes for performance optimization
- Triggers for automatic like count management

### 2. Verify Environment Variables

Your project should have these Supabase environment variables (they're usually auto-configured):
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### 3. Test the Application

1. Run the development server: `npm run dev`
2. Navigate to http://localhost:3000
3. Click "Sign In" and enter your email
4. Check your email for the magic link
5. Once signed in, click "Submit Caption" to add a caption
6. Click the heart icon to like captions

## Database Schema

### captions table
```sql
- id (UUID, primary key)
- caption_text (TEXT) - The caption content
- author_name (TEXT) - Name of the person who submitted
- department (TEXT) - Department (IT, CSE, EC, EEE, ME, EP, PT)
- like_count (INTEGER) - Number of likes (auto-updated by trigger)
- user_id (UUID) - Reference to auth.users
- created_at (TIMESTAMPTZ) - Submission timestamp
```

### likes table
```sql
- id (UUID, primary key)
- caption_id (UUID) - Reference to captions
- user_id (UUID) - Reference to auth.users
- created_at (TIMESTAMPTZ) - Like timestamp
- UNIQUE(caption_id, user_id) - Prevents duplicate likes
```

## Departments Supported
- IT - Information Technology
- CSE - Computer Science & Engineering
- EC - Electronics & Communication
- EEE - Electrical & Electronics Engineering
- ME - Mechanical Engineering
- EP - Engineering Physics
- PT - Production Technology

## Architecture Overview

### Authentication
- Email-based magic link authentication via Supabase Auth
- Users sign in with their email and receive a magic link
- Session automatically maintained with JWT tokens

### Frontend Components
- **Header** - Navigation and user menu
- **CaptionFeed** - Displays all captions sorted by likes
- **CaptionCard** - Individual caption with author and department
- **LikeButton** - Interactive heart button with animation
- **CaptionSubmitForm** - Multi-step stepper form for submission

### Data Flow
1. User submits caption → CaptionSubmitForm inserts into `captions` table
2. User likes a caption → LikeButton inserts into `likes` table
3. Database trigger automatically increments `like_count` on captions
4. Feed automatically refreshes to show updated like counts
5. RLS policies ensure users can only modify their own data

## Styling & Design
- Modern, clean aesthetic with a purple/indigo primary color
- Responsive design using Tailwind CSS
- Smooth animations and transitions
- Dark mode support
- Custom particle animations for like action
- Semantic HTML and ARIA attributes for accessibility

## Troubleshooting

### "Could not find the table 'public.captions'"
- The database tables haven't been created yet
- Execute the SQL migration script from `/scripts/001_create_tables.sql` in your Supabase SQL Editor

### Magic link not working
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly
- Ensure email confirmation is enabled in Supabase Auth settings
- Check spam/junk email folder

### Likes not updating
- Verify that RLS policies are enabled on the `likes` table
- Check that you're authenticated (user is logged in)
- Ensure triggers are created (check Supabase database triggers)

## Performance Optimizations
- Server-side rendered home page for fast initial load
- Database indexes on `like_count` and `created_at` for sorting
- Supabase Real-time capabilities available for future enhancements
- Optimized images and lazy loading

## Future Enhancements
- Real-time updates using Supabase subscriptions
- Filtering/searching captions
- User profiles with submission history
- Comments on captions
- Social sharing features
- Vote statistics and trends

## Support
For issues or questions about the setup, check the debug logs in your browser console or refer to the Supabase documentation at https://supabase.com/docs
