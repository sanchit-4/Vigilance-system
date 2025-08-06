/*
  # Fix RLS Policies for User Access

  1. Policy Updates
    - Update guards table policies to allow users to manage their own records
    - Add proper policies for user_id-based access
    - Add function to get user role from guards table
  
  2. Security
    - Maintain RLS on all tables
    - Allow users to SELECT, INSERT, UPDATE their own guard records
    - Allow role-based access for admins and supervisors
*/

-- Create function to get user role from guards table
CREATE OR REPLACE FUNCTION get_user_role(user_uuid uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM guards WHERE user_id = user_uuid LIMIT 1;
$$;

-- Add user_id column to guards table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'guards' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE guards ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Add role column to guards table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'guards' AND column_name = 'role'
  ) THEN
    ALTER TABLE guards ADD COLUMN role text DEFAULT 'guard' CHECK (role IN ('admin', 'supervisor', 'guard'));
  END IF;
END $$;

-- Add users table for auth integration if needed
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Authenticated users can manage guards" ON guards;
DROP POLICY IF EXISTS "Authenticated users can manage clients" ON clients;
DROP POLICY IF EXISTS "Authenticated users can manage locations" ON locations;
DROP POLICY IF EXISTS "Authenticated users can manage inventory_items" ON inventory_items;
DROP POLICY IF EXISTS "Authenticated users can manage attendance" ON attendance;
DROP POLICY IF EXISTS "Authenticated users can manage salary_advances" ON salary_advances;
DROP POLICY IF EXISTS "Authenticated users can manage guard_assignments" ON guard_assignments;
DROP POLICY IF EXISTS "Authenticated users can manage assigned_inventory" ON assigned_inventory;

-- Guards table policies
CREATE POLICY "Admins and supervisors can manage all guards"
  ON guards
  FOR ALL
  TO authenticated
  USING (get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor']))
  WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor']));

CREATE POLICY "Guards can view their own record"
  ON guards
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor']));

CREATE POLICY "Users can create their own guard record"
  ON guards
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own guard record"
  ON guards
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor']))
  WITH CHECK (user_id = auth.uid() OR get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor']));

-- Clients table policies
CREATE POLICY "Admins and supervisors can manage clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor']))
  WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor']));

CREATE POLICY "Guards can view clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (true);

-- Locations table policies
CREATE POLICY "Admins and supervisors can manage locations"
  ON locations
  FOR ALL
  TO authenticated
  USING (get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor']))
  WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor']));

CREATE POLICY "Guards can view locations"
  ON locations
  FOR SELECT
  TO authenticated
  USING (true);

-- Inventory items table policies
CREATE POLICY "Admins and supervisors can manage inventory"
  ON inventory_items
  FOR ALL
  TO authenticated
  USING (get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor']))
  WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor']));

CREATE POLICY "Guards can view inventory"
  ON inventory_items
  FOR SELECT
  TO authenticated
  USING (true);

-- Attendance table policies
CREATE POLICY "Guards can create their own attendance"
  ON attendance
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM guards 
    WHERE guards.id = attendance.guard_id 
    AND guards.user_id = auth.uid()
  ));

CREATE POLICY "Guards can view their own attendance"
  ON attendance
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM guards 
      WHERE guards.id = attendance.guard_id 
      AND guards.user_id = auth.uid()
    ) OR 
    get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor'])
  );

CREATE POLICY "Supervisors can approve attendance"
  ON attendance
  FOR UPDATE
  TO authenticated
  USING (get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor']))
  WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor']));

-- Salary advances table policies
CREATE POLICY "Admins and supervisors can manage salary advances"
  ON salary_advances
  FOR ALL
  TO authenticated
  USING (get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor']))
  WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor']));

CREATE POLICY "Guards can view their own salary advances"
  ON salary_advances
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM guards 
      WHERE guards.id = salary_advances.guard_id 
      AND guards.user_id = auth.uid()
    ) OR 
    get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor'])
  );

-- Guard assignments table policies
CREATE POLICY "Admins and supervisors can manage assignments"
  ON guard_assignments
  FOR ALL
  TO authenticated
  USING (get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor']))
  WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor']));

CREATE POLICY "Guards can view their own assignments"
  ON guard_assignments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM guards 
      WHERE guards.id = guard_assignments.guard_id 
      AND guards.user_id = auth.uid()
    ) OR 
    get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor'])
  );

-- Assigned inventory table policies
CREATE POLICY "Admins and supervisors can manage assigned inventory"
  ON assigned_inventory
  FOR ALL
  TO authenticated
  USING (get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor']))
  WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor']));

CREATE POLICY "Guards can view their own assigned inventory"
  ON assigned_inventory
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM guards 
      WHERE guards.id = assigned_inventory.guard_id 
      AND guards.user_id = auth.uid()
    ) OR 
    get_user_role(auth.uid()) = ANY (ARRAY['admin', 'supervisor'])
  );

-- Users table policies
CREATE POLICY "Users can view and update their own record"
  ON users
  FOR ALL
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());