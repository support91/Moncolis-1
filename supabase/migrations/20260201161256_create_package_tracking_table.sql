/*
  # Create Package Tracking History Table

  1. New Tables
    - `package_tracking`
      - `id` (uuid, primary key) - Tracking event unique identifier
      - `package_id` (uuid, foreign key) - Reference to package
      - `status` (text, not null) - Status at this point
      - `location` (text) - Location of the event
      - `description` (text) - Event description
      - `updated_by` (uuid, foreign key) - User who made the update
      - `created_at` (timestamptz) - Event timestamp

  2. Security
    - Enable RLS on `package_tracking` table
    - Anyone who can read the package can read its tracking history
    - Only authenticated users can add tracking events

  3. Indexes
    - Package ID for quick history lookups
    - Created at for chronological order
*/

CREATE TABLE IF NOT EXISTS package_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid REFERENCES packages(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL,
  location text,
  description text,
  updated_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_package_tracking_package ON package_tracking(package_id);
CREATE INDEX IF NOT EXISTS idx_package_tracking_created ON package_tracking(created_at DESC);

ALTER TABLE package_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read package tracking"
  ON package_tracking FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM packages
      WHERE packages.id = package_tracking.package_id
      AND (
        packages.sender_id = auth.uid() OR
        packages.partner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid()
          AND users.user_type = 'admin'
        )
      )
    )
  );

CREATE POLICY "Authenticated users can create tracking events"
  ON package_tracking FOR INSERT
  TO authenticated
  WITH CHECK (updated_by = auth.uid());