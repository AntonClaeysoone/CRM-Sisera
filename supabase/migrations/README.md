# Database Migrations Guide

## Migration Files Overview

### 1. `20241212_create_customers_table.sql`
Creates the initial `customers` table with basic customer information.

**Columns:**
- `id`, `first_name`, `last_name`, `email`, `phone`, `address`, `birth_date`
- `store` (sisera/boss), `notes`
- `created_at`, `updated_at`

### 2. `20241212_fix_customers_rls.sql` 
Fixes Row Level Security policies for development and production.

### 3. `20241212_add_marketing_tos_columns.sql` (NEW)
Adds marketing consent and terms of service tracking.

**New Columns:**
- `marketing_opt_in` (BOOLEAN) - Customer consent for marketing
- `tos_accepted` (BOOLEAN) - Acceptance of terms & conditions  
- `marketing_consent_date` (TIMESTAMPTZ) - When consent was given

## Running Migrations

Apply migrations in order:
```sql
-- 1. Create base table
\i 20241212_create_customers_table.sql

-- 2. Fix RLS policies  
\i 20241212_fix_customers_rls.sql

-- 3. Add marketing/ToS columns
\i 20241212_add_marketing_tos_columns.sql
```

## Verifying Migration Success

Check new columns exist:
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'customers' 
AND column_name IN ('marketing_opt_in', 'tos_accepted', 'marketing_consent_date');
```

Expected result:
```
     column_name      | data_type | is_nullable
---------------------+-----------+-------------
 marketing_opt_in     | boolean  | no
 tos_accepted        | boolean   | no  
 marketing_consent_date | timestamp with time zone | yes
```

## Production Notes

- All existing customers default to `tos_accepted = true`
- Check constraints ensure valid boolean values
- Indexes added for performance on marketing queries
- No breaking changes to existing data
