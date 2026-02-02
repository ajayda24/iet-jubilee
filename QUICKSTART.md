# Jubilee Captions - Quick Start (5 Minutes)

## ⚡ TL;DR - Get Running in 5 Steps

### 1. Create Database Tables
```
Go to Supabase Dashboard
→ SQL Editor
→ Create New Query
→ Copy `/scripts/001_create_tables.sql` 
→ Click Run
```

### 2. Verify Environment Variables
Your Supabase credentials should already be set:
- `NEXT_PUBLIC_SUPABASE_URL` ✓
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✓

### 3. Run the App
```bash
npm run dev
```

### 4. Sign In
- Click "Sign In"
- Enter your email
- Click the link in your email
- Boom! You're logged in

### 5. Try It Out
- Click "Submit Caption"
- Fill in: Name → Department → Caption
- Click ❤️ to vote on captions
- See particles fly! 🎉

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `/scripts/001_create_tables.sql` | Database setup (run this first!) |
| `/app/page.tsx` | Main feed page |
| `/components/caption-submit-form.tsx` | Caption submission dialog |
| `/components/like-button.tsx` | Like button with animation |
| `/lib/supabase/` | Supabase config |

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Table not found" | Run SQL migration script |
| Magic link not working | Check spam folder |
| Can't submit | Make sure you're logged in |
| Likes not saving | Refresh page, check RLS policies |

---

## 📚 Full Documentation

- **Detailed Setup**: See `/SETUP.md`
- **Full Guide**: See `/IMPLEMENTATION.md`  
- **Project Overview**: See `/README.md`

---

## 🎨 Departments

Choose one when submitting:
- IT
- CSE
- EC
- EEE
- ME
- EP
- PT

---

## 💡 Pro Tips

✅ **Tip 1**: Use a real email - you need the magic link!
✅ **Tip 2**: Check spam folder if email doesn't arrive in 2 mins
✅ **Tip 3**: Like button animation works best with mouse!
✅ **Tip 4**: Database changes are instant - refresh to see updates

---

## 🎯 Next Steps

After the app works:
1. Customize text and branding
2. Deploy to Vercel
3. Share link with students
4. Watch votes come in! 📊

---

**That's it! Happy voting!** 🎊
