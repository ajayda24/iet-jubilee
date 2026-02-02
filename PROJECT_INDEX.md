# Jubilee Captions - Project Index & Navigation

## 📍 Where to Start?

Choose based on your needs:

### 🚀 **I want to get started NOW**
→ Read [`QUICKSTART.md`](./QUICKSTART.md) (5 minutes)

### 📖 **I need detailed setup instructions**
→ Read [`SETUP.md`](./SETUP.md) (15 minutes)

### 🏗️ **I want to understand the architecture**
→ Read [`IMPLEMENTATION.md`](./IMPLEMENTATION.md) (30 minutes)

### 📚 **I want a quick reference**
→ Read [`README.md`](./README.md) (10 minutes)

---

## 📁 Project Structure Guide

### 🗄️ Database & Backend

```
/scripts/
  └── 001_create_tables.sql
      ├── Creates captions table
      ├── Creates likes table
      ├── Sets up RLS policies
      ├── Creates database triggers
      └── **START HERE**: Run this in Supabase SQL Editor first!

/lib/supabase/
  ├── client.ts          - Browser-side Supabase client
  ├── server.ts          - Server-side Supabase client  
  └── proxy.ts           - Middleware for session refresh
```

### 🎨 Frontend Pages

```
/app/
  ├── page.tsx           - Main caption feed page ⭐
  ├── layout.tsx         - Root layout with metadata
  ├── globals.css        - Global styles & design tokens
  ├── auth/
  │   ├── login/page.tsx - Magic link sign-in
  │   └── error/page.tsx - Auth error page
  └── api/
      └── init/route.ts  - Database initialization endpoint
```

### ⚛️ React Components

```
/components/
  ├── header.tsx                  - Top navigation bar
  ├── caption-feed.tsx            - Container for caption list
  ├── caption-card.tsx            - Individual caption display
  ├── caption-submit-form.tsx     - Multi-step submission form ⭐
  ├── like-button.tsx             - Interactive heart button ⭐
  └── /ui/                        - ShadCN UI components
      ├── button.tsx
      ├── card.tsx
      ├── input.tsx
      ├── textarea.tsx
      ├── select.tsx
      ├── dialog.tsx
      ├── badge.tsx
      └── ... (50+ UI components)
```

### 🔧 Configuration & Types

```
/lib/
  ├── types.ts           - TypeScript interfaces
  │   ├── Caption interface
  │   ├── Like interface
  │   ├── Department type
  │   └── DEPARTMENTS enum
  └── utils.ts           - Utility functions (cn, etc.)

/middleware.ts           - Next.js middleware for auth

next.config.mjs          - Next.js configuration
tailwind.config.ts       - Tailwind CSS v4 config
tsconfig.json            - TypeScript configuration
package.json             - Dependencies & scripts
```

---

## 🎯 Feature Implementation Map

### Authentication (Magic Links)
- **File**: `/app/auth/login/page.tsx`
- **Backend**: Supabase Auth
- **How it works**: User enters email → Supabase sends magic link → User clicks link → Session created

### Caption Submission (Multi-step Form)
- **Component**: `/components/caption-submit-form.tsx`
- **Database**: Inserts to `captions` table
- **Features**:
  - Step 1: Enter name
  - Step 2: Select department
  - Step 3: Write caption
  - Form validation & error handling

### Caption Display
- **Component**: `/components/caption-card.tsx`
- **Data**: Reads from `captions` table via server component
- **Shows**: Caption text, author name, department badge, like count

### Like/Vote System ⭐
- **Component**: `/components/like-button.tsx`
- **Database**: Manages `likes` table
- **Features**:
  - Optimistic UI update
  - Particle burst animation
  - Heart color change
  - Real-time count update via database trigger
  - RLS prevents cheating

### Feed Display
- **Component**: `/components/caption-feed.tsx`
- **Data**: Sorted by like_count (DESC), then created_at (DESC)
- **Shows**: All captions in chronological order

---

## 🔐 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       USER AUTHENTICATION                        │
├─────────────────────────────────────────────────────────────────┤
│ User enters email → Supabase Auth → Magic link sent → Verify   │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CAPTION SUBMISSION FLOW                       │
├─────────────────────────────────────────────────────────────────┤
│ CaptionSubmitForm                                               │
│  ├─ Step 1: Get author_name                                   │
│  ├─ Step 2: Get department                                    │
│  ├─ Step 3: Get caption_text                                  │
│  └─ Submit: Insert to captions table                          │
│             ↓                                                  │
│       Database Trigger                                         │
│        └─ Set like_count = 0                                  │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                      CAPTION FEED DISPLAY                        │
├─────────────────────────────────────────────────────────────────┤
│ HomePage (Server Component)                                      │
│  ├─ Fetch captions sorted by like_count DESC                  │
│  ├─ Fetch user's likes                                         │
│  └─ Pass data to CaptionFeed                                   │
│       └─ Render CaptionCard for each caption                   │
│            ├─ Display caption text                             │
│            ├─ Display author & department                      │
│            └─ Render LikeButton                                │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                      LIKING CAPTIONS                             │
├─────────────────────────────────────────────────────────────────┤
│ User clicks ❤️ heart                                            │
│  ├─ LikeButton: Optimistic UI update                          │
│  ├─ Play particle animation                                    │
│  └─ Insert to likes table                                      │
│       ↓                                                         │
│  Database Trigger                                              │
│   └─ Increment caption.like_count by 1                        │
│       ↓                                                         │
│  Page refreshes                                                │
│   └─ User sees updated like count                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Design System Map

### Colors
```
Primary (Purple):     oklch(0.55 0.2 280)    - Buttons, links, active states
Accent (Orange):      oklch(0.62 0.15 30)    - CTAs, highlights
Muted (Gray):         oklch(0.92 0.02 270)   - Secondary info, disabled
Border (Light Gray):  oklch(0.90 0.02 270)   - Dividers, borders
```

### Typography
```
Headings:   Bold Geist, 24px-48px
Body:       Regular Geist, 14px-16px, line-height 1.5-1.6
Labels:     Medium Geist, 12px-14px
Monospace:  Geist Mono for code
```

### Components Used
```
Buttons:      /components/ui/button.tsx
Cards:        /components/ui/card.tsx
Forms:        /components/ui/input.tsx, textarea.tsx, select.tsx
Dialogs:      /components/ui/dialog.tsx
Badges:       /components/ui/badge.tsx
Icons:        lucide-react library
```

---

## 📊 Database Schema Quick Reference

### captions table
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| caption_text | TEXT | The caption content |
| author_name | TEXT | Submitter's name |
| department | TEXT | IT/CSE/EC/EEE/ME/EP/PT |
| like_count | INTEGER | Auto-updated by trigger |
| user_id | UUID | Links to auth.users |
| created_at | TIMESTAMPTZ | Auto-set on insert |

### likes table
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| caption_id | UUID | Foreign key to captions |
| user_id | UUID | Foreign key to auth.users |
| created_at | TIMESTAMPTZ | Auto-set on insert |
| unique | (caption_id, user_id) | Prevents duplicate votes |

---

## 🚀 Deployment Checklist

- [ ] Database tables created via SQL script
- [ ] Supabase environment variables configured
- [ ] Local testing complete (sign in, submit, like)
- [ ] All animations working smoothly
- [ ] Responsive design tested on mobile
- [ ] Magic link email tested
- [ ] Error messages display correctly
- [ ] Built for production: `npm run build`
- [ ] Deployed to Vercel or hosting platform
- [ ] Production environment variables set
- [ ] Live app tested end-to-end

---

## 📞 Quick Troubleshooting

### "Could not find the table"
→ Run `/scripts/001_create_tables.sql` in Supabase SQL Editor

### "Magic link not received"  
→ Check spam folder and verify email address

### "Can't submit caption"
→ Make sure you're logged in (user object exists)

### "Likes not saving"
→ Check browser console for errors, verify RLS policies enabled

### "Animations not smooth"
→ Check performance in DevTools, clear browser cache

---

## 🔗 Quick Links

| Resource | Link |
|----------|------|
| Supabase Docs | https://supabase.com/docs |
| Next.js Docs | https://nextjs.org/docs |
| React Docs | https://react.dev |
| Tailwind Docs | https://tailwindcss.com |
| ShadCN UI | https://ui.shadcn.com |
| TypeScript | https://typescriptlang.org |

---

## 📄 Documentation Files

1. **`QUICKSTART.md`** - 5-minute setup guide (start here!)
2. **`SETUP.md`** - Detailed setup instructions  
3. **`README.md`** - Project overview
4. **`IMPLEMENTATION.md`** - Architecture & design details
5. **`PROJECT_INDEX.md`** - This file! Navigation guide

---

## 💡 Key Concepts

### Row Level Security (RLS)
Ensures users can only see/modify their own data:
- Anyone can VIEW captions and likes
- Only authenticated users can CREATE captions
- Users can only UPDATE/DELETE their own captions
- Users can only CREATE/DELETE their own likes

### Database Triggers
Automatically update like_count without user interaction:
- AFTER INSERT on likes → increment caption.like_count
- AFTER DELETE on likes → decrement caption.like_count

### Optimistic UI
Shows changes immediately before server confirms:
- Click like → heart fills immediately
- Show new count immediately
- Revert if server response fails

### Magic Links
Authentication without passwords:
- User enters email
- Supabase sends time-limited link
- User clicks link
- Session automatically created
- Very secure and user-friendly

---

## 🎓 Learning Path

1. **Day 1**: Read QUICKSTART.md, get app running
2. **Day 2**: Read SETUP.md, understand database setup
3. **Day 3**: Read README.md, understand project overview
4. **Day 4**: Read IMPLEMENTATION.md, deep dive into architecture
5. **Day 5+**: Customize and deploy!

---

## 📞 Support Resources

**For Setup Issues**
→ See SETUP.md troubleshooting section

**For Architecture Questions**
→ See IMPLEMENTATION.md architecture section

**For API/Database Questions**
→ Visit Supabase Docs at supabase.com/docs

**For Next.js Questions**
→ Visit Next.js Docs at nextjs.org/docs

---

**Ready to build amazing things!** 🎉

Start with [`QUICKSTART.md`](./QUICKSTART.md) →
