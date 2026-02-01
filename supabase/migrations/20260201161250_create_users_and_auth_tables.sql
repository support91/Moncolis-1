/*
  # Create MonColis.express User Management System

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - User unique identifier
      - `email` (text, unique, not null) - User email address
      - `full_name` (text, not null) - User's full name
      - `phone` (text) - Phone number (optional for email users)
      - `user_type` (text, not null) - Type: 'client', 'partner', or 'admin'
      - `auth_provider` (text, default 'email') - Authentication method: 'email', 'google', 'whatsapp'
      - `company_name` (text) - Partner company name (partners only)
      - `company_address` (text) - Partner company address (partners only)
      - `partner_status` (text) - Partner approval status: 'pending', 'approved', 'rejected'
      - `admin_level` (text) - Admin level: 'standard', 'super' (admins only)
      - `invitation_code` (text) - Admin invitation code used for registration
      - `avatar_url` (text) - User profile picture URL
      - `created_at` (timestamptz) - Account creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `users` table
    - Users can read their own data
    - Users can update their own profile
    - Admins can read all users
    - Public insert for registration

  3. Indexes
    - Email index for fast lookups
    - Phone index for WhatsApp auth
    - User type index for filtering
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  user_type text NOT NULL CHECK (user_type IN ('client', 'partner', 'admin')),
  auth_provider text DEFAULT 'email' CHECK (auth_provider IN ('email', 'google', 'whatsapp')),
  company_name text,
  company_address text,
  partner_status text CHECK (partner_status IN ('pending', 'approved', 'rejected')),
  admin_level text CHECK (admin_level IN ('standard', 'super')),
  invitation_code text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_partner_status ON users(partner_status) WHERE user_type = 'partner';

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_type = 'admin'
    )
  );

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can register"
  ON users FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();