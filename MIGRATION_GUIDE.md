# 🚀 BLUEBIRDX MASTER PLAN - PHASE 1 MIGRATION GUIDE

## ✅ What We've Done

### 1. Database Migration Complete ✅
- Migrated from local PostgreSQL to **Planet Endor (Supabase)**
- Project: `bluebirdx-prod` (ref: `pgrbbtwcgcfywyqoqzag`)
- Added 4 new tables:
  - `users` - Authentication
  - `chat_messages` - Princess Leia conversations
  - `swipe_preferences` - Tinder-style AI learning
  - `notifications` - Obi-Wan message queue

### 2. Schema Updated ✅
- Created `drizzle/schema.planet-endor.ts` with UUID support
- Changed from MySQL/INTEGER to PostgreSQL/UUID
- Matches existing Planet Endor structure

### 3. Configuration Files Created ✅
- `.env.planet-endor` - New environment variables
- `server/db.planet-endor.ts` - PostgreSQL connection

---

## 📋 NEXT STEPS (You Need To Do)

### Step 1: Install postgres-js Driver

```bash
cd /path/to/limo_reservation_app
pnpm add postgres
# or
npm install postgres
```

### Step 2: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project: **bluebirdx-prod**
3. Go to **Settings** → **Database**
4. Copy your database password
5. Go to **Settings** → **API**
6. Copy `anon key` and `service_role key`

### Step 3: Update Environment Variables

1. **Copy the new template:**
   ```bash
   cp .env.planet-endor .env
   ```

2. **Fill in the placeholders:**
   - Replace `[YOUR_SUPABASE_PASSWORD]` with your database password
   - Replace `[YOUR_SUPABASE_ANON_KEY]` with your anon key
   - Replace `[YOUR_SUPABASE_SERVICE_ROLE_KEY]` with service role key
   - Add your other API keys (OpenAI, Google Maps, Stripe, Brevo)

### Step 4: Update Code References

**A. Replace schema import:**
```typescript
// OLD (in all server files):
import { ... } from "../drizzle/schema";

// NEW:
import { ... } from "../drizzle/schema.planet-endor";
```

**B. Replace database connection:**
```typescript
// OLD:
import { drizzle } from "drizzle-orm/mysql2";

// NEW:
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
```

**C. Update drizzle.config.ts:**
```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./drizzle/schema.planet-endor.ts",
  out: "./drizzle/migrations",
  driver: "pg", // Changed from "mysql2"
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### Step 5: Update Package.json

Make sure you have PostgreSQL driver:
```json
{
  "dependencies": {
    "drizzle-orm": "^0.44.5",
    "postgres": "^3.4.3"  // Add this
  }
}
```

Remove MySQL if no longer needed:
```bash
pnpm remove mysql2
```

### Step 6: Test Connection

```bash
# Run development server
pnpm dev

# Check logs for:
# ✅ Connected to Planet Endor (Supabase)
```

---

## 🔄 Schema Mapping Reference

### Table Name Changes:
- `bookings` → `reservations` ✅ (already existed on Planet Endor)
- `users` → `customers` ✅ (for customer data)
- Added `users` table for auth
- All other tables kept same names

### ID Type Changes:
```typescript
// OLD (MySQL):
id: int("id").autoincrement().primaryKey()

// NEW (PostgreSQL UUID):
id: uuid("id").defaultRandom().primaryKey()
```

### Foreign Key Changes:
```typescript
// OLD:
userId: int("userId").references(() => users.id)

// NEW:
userId: uuid("userId").references(() => customers.id)
```

---

## 🧪 Testing Checklist

After migration, test these features:

- [ ] User login/signup
- [ ] Fetch drivers
- [ ] Create booking (reservation)
- [ ] View booking history
- [ ] Chat with AI (should save to chat_messages table)
- [ ] Swipe drivers (should save to swipe_preferences table)
- [ ] Payments (Stripe integration)

---

## 🆘 Troubleshooting

### Error: "Cannot find module 'postgres'"
```bash
pnpm add postgres
```

### Error: "Invalid connection string"
- Check `.env` file has correct `DATABASE_URL`
- Password should NOT contain @ symbol (URL encode if needed)
- Use direct connection (port 5432) for development
- Use pooler (port 6543) for production

### Error: "relation does not exist"
- Make sure you're using `schema.planet-endor.ts`
- Table names are case-sensitive
- Check table exists: `SELECT * FROM information_schema.tables WHERE table_schema = 'public';`

### Error: "column does not exist"
- Check column name casing (camelCase vs snake_case)
- Planet Endor uses snake_case: `pickup_location` not `pickupLocation`

---

## 🎯 Next Phase: Yoda Edge Functions

Once your frontend connects successfully to Planet Endor:

1. Deploy Yoda Edge Functions on Supabase
2. Integrate Princess Leia (OpenAI Assistant)
3. Deploy frontend to Vercel/Netlify
4. Configure Obi-Wan notifications (Brevo)

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Drizzle PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)
- [BluebirdX Master Plan](recipe_id: rcp_ns12f43k5MsT)

🚀 Ready to launch BluebirdX on Planet Endor!
