/*
  # Create Packages Table

  1. New Tables
    - `packages`
      - `id` (uuid, primary key) - Package unique identifier
      - `tracking_number` (text, unique, not null) - Tracking number for customers
      - `sender_id` (uuid, foreign key) - Reference to sender user
      - `recipient_name` (text, not null) - Recipient full name
      - `recipient_phone` (text, not null) - Recipient phone number
      - `recipient_address` (text, not null) - Delivery address
      - `origin` (text, not null) - Origin city/location
      - `destination` (text, not null) - Destination city/location
      - `weight` (decimal) - Package weight in kg
      - `dimensions` (text) - Package dimensions (e.g., "30x20x15 cm")
      - `description` (text) - Package description
      - `status` (text, not null) - Status: 'pending', 'in_transit', 'delivered', 'cancelled'
      - `current_location` (text) - Current package location
      - `partner_id` (uuid, foreign key) - Assigned delivery partner
      - `price` (decimal, default 0) - Delivery price in XOF
      - `created_at` (timestamptz) - Package creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `delivered_at` (timestamptz) - Delivery completion timestamp

  2. Security
    - Enable RLS on `packages` table
    - Users can read their own packages (as sender)
    - Partners can read assigned packages
    - Admins can read all packages
    - Users can create packages

  3. Indexes
    - Tracking number for quick lookups
    - Sender ID for user packages
    - Partner ID for delivery management
    - Status for filtering
*/

CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number text UNIQUE NOT NULL,
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  recipient_name text NOT NULL,
  recipient_phone text NOT NULL,
  recipient_address text NOT NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  weight decimal(10,2),
  dimensions text,
  description text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'delivered', 'cancelled')),
  current_location text,
  partner_id uuid REFERENCES users(id) ON DELETE SET NULL,
  price decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  delivered_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_packages_tracking ON packages(tracking_number);
CREATE INDEX IF NOT EXISTS idx_packages_sender ON packages(sender_id);
CREATE INDEX IF NOT EXISTS idx_packages_partner ON packages(partner_id);
CREATE INDEX IF NOT EXISTS idx_packages_status ON packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_created ON packages(created_at DESC);

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own packages"
  ON packages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid());

CREATE POLICY "Partners can read assigned packages"
  ON packages FOR SELECT
  TO authenticated
  USING (
    partner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_type = 'partner'
    )
  );

CREATE POLICY "Admins can read all packages"
  ON packages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_type = 'admin'
    )
  );

CREATE POLICY "Users can create packages"
  ON packages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update own packages"
  ON packages FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Partners can update assigned packages"
  ON packages FOR UPDATE
  TO authenticated
  USING (
    partner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_type = 'partner'
    )
  )
  WITH CHECK (true);

CREATE POLICY "Admins can update all packages"
  ON packages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_type = 'admin'
    )
  )
  WITH CHECK (true);

CREATE TRIGGER packages_updated_at
  BEFORE UPDATE ON packages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION generate_tracking_number()
RETURNS text AS $$
BEGIN
  RETURN 'MC' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 999999)::text, 6, '0');
END;
$$ LANGUAGE plpgsql;