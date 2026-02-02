# Jubilee Captions - Caption Voting App

A modern, clean web application for college events where students can submit creative caption ideas and vote on their favorites with interactive animations.

## 🎯 Features

- **Email Authentication**: Simple magic link authentication via Supabase
- **Caption Submission**: Multi-step form to submit captions with department selection
- **Interactive Voting**: Heart button with smooth animations and particle effects
- **Real-time Updates**: Like counts update instantly across all users
- **Department Filtering**: Support for IT, CSE, EC, EEE, ME, EP, PT departments
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, minimal aesthetic with smooth transitions
- **Dark Mode**: Built-in dark mode support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Supabase account and project
- Environment variables set up

### Installation

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Initialize Database Tables**
   - Go to your Supabase SQL Editor
   - Copy and paste the contents of `/scripts/001_create_tables.sql`
   - Execute the query
   - This creates the `captions` and `likes` tables with RLS policies

3. **Set Environment Variables**
   - Your Supabase environment variables should already be configured
   - Verify you have:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Access the App**
   - Open http://localhost:3000
   - Sign in with your email
   - Start submitting and voting on captions!

## 📋 Database Schema

### captions
Stores all submitted captions with metadata
- `id`: Unique identifier
- `caption_text`: The caption content
- `author_name`: Name of the submitter
- `department`: Department (IT, CSE, EC, etc.)
- `like_count`: Auto-updated by database trigger
- `user_id`: Reference to the authenticated user
- `created_at`: Submission timestamp

### likes
Tracks individual likes to prevent duplicates
- `id`: Unique identifier
- `caption_id`: Reference to the caption
- `user_id`: Reference to the authenticated user
- `created_at`: Like timestamp
- **Unique constraint** on (caption_id, user_id)

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 16, React, TypeScript
- **Styling**: Tailwind CSS v4, ShadCN UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with magic links
- **State Management**: SWR for server-side data
- **Animations**: CSS keyframes, Framer Motion principles

### Key Components

```
/app
  ├── page.tsx              # Main feed page
  ├── layout.tsx            # Root layout with metadata
  ├── globals.css           # Global styles and design tokens
  └── auth/
      ├── login/page.tsx    # Magic link authentication
      └── error/page.tsx    # Auth error handling

/components
  ├── caption-feed.tsx      # Feed container
  ├── caption-card.tsx      # Individual caption display
  ├── caption-submit-form.tsx # Multi-step submission form
  ├── like-button.tsx       # Interactive heart button
  └── header.tsx            # Navigation and user menu

/lib
  ├── supabase/
  │   ├── client.ts         # Browser client
  │   ├── server.ts         # Server client
  │   └── proxy.ts          # Middleware proxy
  └── types.ts              # TypeScript interfaces
```

### Data Flow

1. **User Authentication**
   - User enters email on login page
   - Supabase sends magic link
   - User clicks link and is authenticated

2. **Caption Submission**
   - User fills multi-step form (name → department → caption)
   - Form validates and submits to database
   - Trigger auto-creates initial like_count = 0
   - Page refreshes to show new caption

3. **Voting/Likes**
   - User clicks heart button
   - Client-side animation plays immediately
   - Like is inserted into database
   - Trigger increments like_count on caption
   - RLS policies prevent unauthorized modifications

## 🎨 Design System

### Color Palette
- **Primary**: Purple/Indigo (`oklch(0.55 0.2 280)`)
- **Accent**: Warm Orange (`oklch(0.62 0.15 30)`)
- **Neutral**: Light background with subtle grays
- **Destructive**: Red for delete actions

### Typography
- **Font**: Geist (sans-serif) for all text
- **Heading**: Bold weights, good hierarchy
- **Body**: Regular weight, readable line-height
- **Spacing**: Consistent 8px grid system

## 🔐 Security

- **Row Level Security (RLS)**: All tables protected by RLS policies
- **Authentication**: Magic link prevents password sharing
- **Data Isolation**: Users can only modify their own captions
- **SQL Injection Prevention**: Parameterized queries via Supabase
- **CORS**: Secure cross-origin requests

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

All components use Tailwind's responsive prefixes for optimal display.

## 🐛 Troubleshooting

### Tables not found
**Error**: `Could not find the table 'public.captions'`
- **Solution**: Run the SQL migration from `/scripts/001_create_tables.sql` in Supabase SQL Editor

### Magic link not received
- Check spam/junk folders
- Verify email is correct
- Ensure Supabase Auth email is configured

### Likes not saving
- Confirm you're authenticated (logged in)
- Check browser console for errors
- Verify RLS policies are enabled

## 🚀 Deployment

Deploy to Vercel (recommended for Next.js):
```bash
npm run build
vercel deploy
```

Or deploy to any Node.js hosting platform.

## 📚 Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Next.js 16 Guide](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [ShadCN UI](https://ui.shadcn.com)

## 📝 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/
```

## 🎓 Departments

- IT - Information Technology
- CSE - Computer Science & Engineering
- EC - Electronics & Communication
- EEE - Electrical & Electronics Engineering
- ME - Mechanical Engineering
- EP - Engineering Physics
- PT - Production Technology

## 📄 License

This project is created for college events and educational purposes.

## 🤝 Support

For setup help, see `/SETUP.md` for detailed instructions.

---

**Built with ❤️ for college Jubilee events**
