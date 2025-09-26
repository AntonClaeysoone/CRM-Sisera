-- Create customers table
CREATE TABLE customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    birth_date DATE,
    store VARCHAR(10) NOT NULL CHECK (store IN ('sisera', 'boss')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on store for faster queries
CREATE INDEX idx_customers_store ON customers(store);

-- Create index on email for faster lookups
CREATE INDEX idx_customers_email ON customers(email);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies if needed
-- COMMENTED OUT for development - uncomment for production
-- ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Development-friendly policies (uncomment when RLS is enabled)
/*
-- Allow anyone to perform all operations (development only)
CREATE POLICY "Public access for development" ON customers
    FOR ALL TO public
    USING (true);

-- For production with authentication, use these instead:
-- CREATE POLICY "Allow authenticated users to see customers" ON customers
--     FOR SELECT TO authenticated
--     USING (true);
-- CREATE POLICY "Allow authenticated users to insert customers" ON customers
--     FOR INSERT TO authenticated
--     WITH CHECK (true);
-- CREATE POLICY "Allow authenticated users to update customers" ON customers
--     FOR UPDATE TO authenticated
--     USING (true);
-- CREATE POLICY "Allow authenticated users to delete customers" ON customers
--     FOR DELETE TO authenticated
--     USING (true);
*/
