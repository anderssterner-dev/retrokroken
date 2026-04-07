# Retrokroken Site Launch & Operations Guide

## Project Overview
**Retrokroken** is a vintage/retro collector's shop website built with React, deployed on Vercel, with a Supabase backend for data management. The site features a product gallery, bidding system, multi-language support (Swedish, Norwegian, English), and an admin panel for managing items.

**Live Domain:** www.retrokroken.com (redirects from retrokroken.com)  
**Admin Panel:** www.retrokroken.com/admin  
**Local Dev:** http://localhost:5174

---

## Services & Access

### 1. **Vercel (Hosting & Deployment)**
**Purpose:** Hosts the live React app  
**URL:** https://vercel.com/dashboard  
**Project:** https://vercel.com/anderssterner-devs-projects/retrokroken

**Key Info:**
- Production URL: retrokroken-git-main-anderssterner-devs-projects.vercel.app
- Custom domains: www.retrokroken.com, retrokroken.com
- Auto-deploys on every push to GitHub main branch
- Deployments page shows build status

**To Deploy:**
- Push changes to GitHub main branch
- Vercel auto-rebuilds (watch Deployments → Current)
- Takes 1-2 minutes typically

### 2. **Supabase (Database & Backend)**
**Purpose:** Stores all product data, bid requests, contact submissions  
**URL:** https://supabase.com  
**Project Name:** retrokroken (or search for it)

**Key Tables:**
- `items` - Product listings (title, description, category, era, condition, image_url, etc.)
- `bid_requests` - Customer bid submissions
- `bid_request_items` - Individual items in bid requests
- `contact_submissions` - Contact form submissions (if table exists)

**To Manage Data:**
1. Log in to Supabase dashboard
2. Select "retrokroken" project
3. Go to "Table Editor" (left sidebar)
4. Browse/edit tables directly
5. Or use SQL Editor for complex queries

**API Keys Location:**
- Settings → API → anon key (public, safe to share)
- Settings → API → service_role key (secret, NEVER commit to Git)

### 3. **GoDaddy (Domain & DNS)**
**Purpose:** Domain registration and DNS management  
**URL:** https://www.godaddy.com/domains  
**Domain:** retrokroken.com

**Current DNS Configuration:**
- Nameservers: ns13.domaincontrol.com, ns14.domaincontrol.com (GoDaddy's standard)
- CNAME record for `www`: 9i47b8f7f5fa702f.vercel-dns-017.com.
- A record for base domain: 216.198.79.1 (Vercel)

**To Access DNS Settings:**
1. Go to GoDaddy.com → My Products → Domains
2. Click on retrokroken.com → "Administrer" (Administer)
3. Go to "DNS" tab → "Registreringsinnstillinger" (Registration Settings)
4. Click "Navneservere" (Nameservers) to see current settings

**DNS Propagation:** Changes can take 15 minutes to 24 hours to propagate globally. If domain doesn't resolve, wait and refresh.

### 4. **GitHub (Version Control)**
**Purpose:** Source code repository  
**URL:** https://github.com/anderssterner-dev/retrokroken

**Deploy Process:**
- Push to `main` branch → Vercel auto-builds
- Branch: `main`
- Auto-deploy on push enabled

### 5. **Resend (Email Service)**
**Purpose:** Sends contact form & bid submission emails  
**Configuration:** In Supabase Edge Functions environment variables
- RESEND_API_KEY - API key for sending emails
- RESEND_FROM_EMAIL - Sender email address
- RETROKROKEN_NOTIFY_EMAIL - Where to send notifications (default: retrokroken@gmail.com)

---

## Project Structure

```
c:\Hemsida\
├── src/
│   ├── pages/
│   │   ├── Landing.jsx - Home page (hero, featured items)
│   │   ├── Objects.jsx - Product catalog page
│   │   ├── ObjectDetail.jsx - Single product detail view
│   │   ├── ContactPage.jsx - Contact form page
│   │   └── Admin.jsx - Admin panel for adding/managing items
│   ├── components/
│   │   ├── Gallery.jsx - Product grid with filtering
│   │   ├── BidModal.jsx - Bid submission modal
│   │   ├── BidDrawer.jsx - Bid basket sidebar
│   │   ├── Contact.jsx - Contact form component
│   │   ├── Navbar.jsx - Navigation bar
│   │   ├── Hero.jsx - Hero section
│   │   ├── Footer.jsx - Footer
│   │   └── VhsOverlay.jsx - VHS effect overlay
│   ├── lib/
│   │   ├── supabase.js - Supabase client initialization
│   │   ├── BidContext.jsx - Bid basket state management
│   │   └── categories.js - Category data & translations
│   ├── i18n.jsx - Multi-language support (SV, NO, EN)
│   ├── App.jsx - Main app router
│   └── main.jsx - Entry point
├── supabase/
│   └── functions/
│       └── submit-bid-request/ - Edge function for handling bids & contacts
├── public/ - Static assets
├── vercel.json - Vercel SPA routing config
├── vite.config.js - Vite build configuration
└── package.json - Dependencies
```

---

## Common Tasks

### Add a New Product
1. **Local:** Go to http://localhost:5174/admin
2. **Live:** Go to www.retrokroken.com/admin
3. Fill form:
   - Title (required)
   - Object Code (auto-generated if left blank)
   - Descriptions in Swedish, Norwegian, English
   - Category (Main & Sub)
   - Era (e.g., "80s")
   - Condition (e.g., "Excellent")
   - Image (upload or paste URL)
4. Click "Save"
5. Product appears on gallery immediately (if using same Supabase instance)

### Edit/Delete Products
**Option 1: Admin Panel**
- Log in at www.retrokroken.com/admin
- (If edit/delete features aren't visible, use Supabase directly)

**Option 2: Supabase Studio (Recommended)**
1. Go to Supabase → retrokroken project
2. Table Editor → items
3. Click row to edit or use delete icon
4. Changes appear on site immediately

### Fix a Broken Domain Link
**If www.retrokroken.com doesn't work:**
1. Check DNS: Run `nslookup www.retrokroken.com` in terminal
2. If returns NXDOMAIN:
   - Go to GoDaddy DNS settings
   - Verify CNAME for `www` is: 9i47b8f7f5fa702f.vercel-dns-017.com.
   - Wait 15-30 minutes for propagation
3. Test live deployment: retrokroken-git-main-anderssterner-devs-projects.vercel.app

### Deploy Code Changes
1. Edit files locally
2. Test with `npm run dev`
3. Commit: `git add .` → `git commit -m "description"`
4. Push: `git push origin main`
5. Watch Vercel deployments (1-2 min build time)
6. Check www.retrokroken.com after "Ready" status

### Change Email Notification Address
1. Go to Vercel → retrokroken project → Settings
2. Environment Variables
3. Find `RETROKROKEN_NOTIFY_EMAIL`
4. Update value to new email
5. Redeploy

### Fix Contact/Bid Email Not Sending
1. Check Supabase Edge Function logs:
   - Supabase → Functions → submit-bid-request
   - View logs for errors
2. Verify environment variables in Vercel are set:
   - RESEND_API_KEY
   - RESEND_FROM_EMAIL
   - RETROKROKEN_NOTIFY_EMAIL
3. Test with contact form at www.retrokroken.com/kontakt

---

## Troubleshooting

### Site shows 404 at www.retrokroken.com
**Cause:** DNS still propagating or domain not configured  
**Solution:**
- Wait 15-30 minutes
- Test with Vercel URL: retrokroken-git-main-anderssterner-devs-projects.vercel.app
- Check GoDaddy DNS settings match Vercel requirements

### /admin page returns 404
**Cause:** Routing not configured (already fixed with vercel.json)  
**Solution:**
- Verify vercel.json exists in project root
- If not, create it (see Deployment section)
- Push to GitHub and wait for Vercel rebuild

### Products not showing on site
**Cause:** Database connection issue or no items in `items` table  
**Solution:**
1. Check Supabase: Table Editor → items (should show rows)
2. Check browser console (F12) for errors
3. Verify VITE_SUPABASE_URL and VITE_SUPABASE_KEY in .env are correct
4. Check Gallery.jsx is fetching from correct table

### Admin can't add items
**Cause:** Supabase connection or permissions issue  
**Solution:**
1. Check browser console (F12) for errors
2. Verify Supabase API key has write permissions
3. Check `items` table exists in Supabase
4. Manually add item via Supabase Studio as workaround

### Custom domain shows old deployment
**Cause:** DNS caching or Vercel domain not updated  
**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Try incognito window
3. Verify domain in Vercel Settings → Domains shows "Valid Configuration"
4. If invalid, check GoDaddy CNAME matches exactly

---

## Environment Variables

**Local (.env.local):**
```
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[public-anon-key]
```

**Vercel (Settings → Environment Variables):**
```
RESEND_API_KEY=[your-resend-api-key]
RESEND_FROM_EMAIL=noreply@retrokroken.com (or configured email)
RETROKROKEN_NOTIFY_EMAIL=retrokroken@gmail.com
```

---

## Deployment Checklist

**Before deploying code:**
- [ ] Test locally with `npm run dev`
- [ ] No console errors
- [ ] Check all pages work
- [ ] Admin panel loads
- [ ] Forms submit without errors

**After pushing to GitHub:**
- [ ] Watch Vercel Deployments page
- [ ] Wait for "Ready" status (green checkmark)
- [ ] Test live at www.retrokroken.com or Vercel URL
- [ ] Check admin panel at /admin
- [ ] Verify products load

---

## Key Contact Info
- **Admin Email:** retrokroken@gmail.com
- **Support:** GitHub Issues or local troubleshooting
- **Domain Registrar:** GoDaddy (login at godaddy.com)
- **Hosting Provider:** Vercel (login at vercel.com)
- **Database:** Supabase (login at supabase.com)

---

## Notes for Fresh Agent

If you're brought in to help:
1. **First:** Ask if it's a deployment issue, data issue, or feature request
2. **Verify access:** Check agent has GitHub, Vercel, Supabase, GoDaddy access
3. **Check status:** 
   - Is site loading? (test Vercel URL and custom domain)
   - Are products showing? (check Supabase items table)
   - Is admin working? (test www.retrokroken.com/admin)
4. **Common quick fixes:**
   - Clear cache/try incognito for DNS issues
   - Check Vercel deployment is "Ready"
   - Check Supabase connection in browser console
   - Wait 15-30 min for DNS changes to propagate
5. **When in doubt:** Check browser console (F12) for errors and Vercel/Supabase logs

---

**Last Updated:** 2026-04-07  
**Site Status:** ✅ Live (DNS propagating)
