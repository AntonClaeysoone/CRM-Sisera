-- Fix RLS policies for development - allows anonymous access
-- WARNING: Only use for development! In production you need proper authentication.

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous users to see customers" ON customers;
DROP POLICY IF EXISTS "Allow anonymous users to insert customers" ON customers;
DROP POLICY IF EXISTS "Allow anonymous users to update customers" ON customers;
DROP POLICY IF EXISTS "Allow anonymous users to delete customers" ON customers;

-- Create policies for anonymous access (development only)
CREATE POLICY "Allow anonymous users to see customers" ON customers
    FOR SELECT TO anon
    USING (true);

CREATE POLICY "Allow anonymous users to insert customers" ON customers
    FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anonymous users to update customers" ON customers
    FOR UPDATE TO anon
    USING (true);

CREATE POLICY "Allow anonymous users to delete customers" ON customers
    FOR DELETE TO anon
    USING (true);

-- Also allow unauthenticated access
CREATE POLICY "Allow unauthenticated users to see customers" ON customers
    FOR ALL TO public
    USING (true);

