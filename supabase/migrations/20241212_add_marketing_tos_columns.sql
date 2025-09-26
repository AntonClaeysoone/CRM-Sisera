-- Add marketing opt-in and terms of service agreement columns to customers table
-- Created on: 2024-12-12
-- Description: Adds marketing consent and ToS agreement tracking

-- Add marketing opt-in column
ALTER TABLE customers 
ADD COLUMN marketing_opt_in BOOLEAN DEFAULT FALSE;

-- Add terms of service agreement column  
ALTER TABLE customers 
ADD COLUMN tos_accepted BOOLEAN DEFAULT FALSE;

-- Add created_at timestamp for marketing consent (optional - for audit trail)
ALTER TABLE customers 
ADD COLUMN marketing_consent_date TIMESTAMPTZ;

-- Add comments for documentation
COMMENT ON COLUMN customers.marketing_opt_in IS 'Customer opt-in for marketing emails and promotions';
COMMENT ON COLUMN customers.tos_accepted IS 'User acceptance of terms of service and privacy policy';
COMMENT ON COLUMN customers.marketing_consent_date IS 'Timestamp when marketing consent was given';

-- Update existing records to have default values
UPDATE customers 
SET 
  marketing_opt_in = FALSE,
  tos_accepted = TRUE, -- Assume existing customers accepted ToS
  marketing_consent_date = created_at
WHERE marketing_opt_in IS NULL OR tos_accepted IS NULL;

-- Add NOT NULL constraints after populating existing data
ALTER TABLE customers 
ALTER COLUMN marketing_opt_in SET NOT NULL,
ALTER COLUMN tos_accepted SET NOT NULL;

-- Add indexes for better query performance on these columns
CREATE INDEX idx_customers_marketing_opt_in ON customers (marketing_opt_in);
CREATE INDEX idx_customers_tos_accepted ON customers (tos_accepted);

-- Update the trigger to handle these new columns
CREATE OR REPLACE FUNCTION update_customers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists and recreate
DROP TRIGGER IF EXISTS update_customers_updated_at_trigger ON customers;
CREATE TRIGGER update_customers_updated_at_trigger
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_customers_updated_at();

-- Optional: Add check constraint to ensure valid boolean values
ALTER TABLE customers 
ADD CONSTRAINT chk_marketing_opt_in_boolean 
CHECK (marketing_opt_in IN (TRUE, FALSE));

ALTER TABLE customers 
ADD CONSTRAINT chk_tos_accepted_boolean 
CHECK (tos_accepted IN (TRUE, FALSE));

-- Migration completed successfully
-- Tables affected: customers
-- New columns: marketing_opt_in, tos_accepted, marketing_consent_date
-- Indexes added for performance
-- Constraints added for data integrity
