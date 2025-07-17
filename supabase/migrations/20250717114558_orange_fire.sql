/*
  # Implement Role-Based Authentication System

  This migration removes anonymous access and implements proper authentication
  with role-based access control.

  ## Changes Made:
  1. Remove all anonymous policies
  2. Add role-based authentication policies
  3. Add user roles and permissions
  4. Create proper RLS policies for each role

  ## Roles:
  - admin: Full access to all features
  - supervisor: Can manage guards, attendance, locations, clients
  - guard: Can only check in/out and view own records
*/

-- Remove all anonymous policies
DROP POLICY IF EXISTS "Anonymous users can manage guards (development only)" ON public.guards;
DROP POLICY IF EXISTS "Anonymous users can manage clients (development only)" ON public.clients;
DROP POLICY IF EXISTS "Anonymous users can manage locations (development only)" ON public.locations;
DROP POLICY IF EXISTS "Anonymous users can manage inventory_items (development only)" ON public.inventory_items;
DROP POLICY IF EXISTS "Anonymous users can manage attendance (development only)" ON public.attendance;
DROP POLICY IF EXISTS "Anonymous users can manage salary_advances (development only)" ON public.salary_advances;
DROP POLICY IF EXISTS "Anonymous users can manage guard_assignments (development only)" ON public.guard_assignments;
DROP POLICY IF EXISTS "Anonymous users can manage assigned_inventory (development only)" ON public.assigned_inventory;

-- Add user_id column to guards table to link with auth.users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'guards' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.guards ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Add role column to guards table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'guards' AND column_name = 'role'
  ) THEN
    ALTER TABLE public.guards ADD COLUMN role TEXT NOT NULL DEFAULT 'guard' CHECK (role IN ('admin', 'supervisor', 'guard'));
  END IF;
END $$;

-- Drop existing authenticated policies
DROP POLICY IF EXISTS "Authenticated users can manage guards" ON public.guards;
DROP POLICY IF EXISTS "Authenticated users can manage clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can manage locations" ON public.locations;
DROP POLICY IF EXISTS "Authenticated users can manage inventory_items" ON public.inventory_items;
DROP POLICY IF EXISTS "Authenticated users can manage attendance" ON public.attendance;
DROP POLICY IF EXISTS "Authenticated users can manage salary_advances" ON public.salary_advances;
DROP POLICY IF EXISTS "Authenticated users can manage guard_assignments" ON public.guard_assignments;
DROP POLICY IF EXISTS "Authenticated users can manage assigned_inventory" ON public.assigned_inventory;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM public.guards 
    WHERE user_id = user_uuid 
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Guards table policies
CREATE POLICY "Admins and supervisors can manage all guards"
    ON public.guards
    FOR ALL
    TO authenticated
    USING (get_user_role(auth.uid()) IN ('admin', 'supervisor'))
    WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'supervisor'));

CREATE POLICY "Guards can view their own record"
    ON public.guards
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR get_user_role(auth.uid()) IN ('admin', 'supervisor'));

-- Clients table policies
CREATE POLICY "Admins and supervisors can manage clients"
    ON public.clients
    FOR ALL
    TO authenticated
    USING (get_user_role(auth.uid()) IN ('admin', 'supervisor'))
    WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'supervisor'));

CREATE POLICY "Guards can view clients"
    ON public.clients
    FOR SELECT
    TO authenticated
    USING (true);

-- Locations table policies
CREATE POLICY "Admins and supervisors can manage locations"
    ON public.locations
    FOR ALL
    TO authenticated
    USING (get_user_role(auth.uid()) IN ('admin', 'supervisor'))
    WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'supervisor'));

CREATE POLICY "Guards can view locations"
    ON public.locations
    FOR SELECT
    TO authenticated
    USING (true);

-- Inventory items policies
CREATE POLICY "Admins and supervisors can manage inventory"
    ON public.inventory_items
    FOR ALL
    TO authenticated
    USING (get_user_role(auth.uid()) IN ('admin', 'supervisor'))
    WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'supervisor'));

CREATE POLICY "Guards can view inventory"
    ON public.inventory_items
    FOR SELECT
    TO authenticated
    USING (true);

-- Attendance table policies
CREATE POLICY "Guards can create their own attendance"
    ON public.attendance
    FOR INSERT
    TO authenticated
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.guards 
        WHERE id = guard_id AND user_id = auth.uid()
      )
    );

CREATE POLICY "Guards can view their own attendance"
    ON public.attendance
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.guards 
        WHERE id = guard_id AND user_id = auth.uid()
      ) OR get_user_role(auth.uid()) IN ('admin', 'supervisor')
    );

CREATE POLICY "Supervisors can approve attendance"
    ON public.attendance
    FOR UPDATE
    TO authenticated
    USING (get_user_role(auth.uid()) IN ('admin', 'supervisor'))
    WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'supervisor'));

-- Salary advances policies
CREATE POLICY "Admins and supervisors can manage salary advances"
    ON public.salary_advances
    FOR ALL
    TO authenticated
    USING (get_user_role(auth.uid()) IN ('admin', 'supervisor'))
    WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'supervisor'));

CREATE POLICY "Guards can view their own salary advances"
    ON public.salary_advances
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.guards 
        WHERE id = guard_id AND user_id = auth.uid()
      ) OR get_user_role(auth.uid()) IN ('admin', 'supervisor')
    );

-- Guard assignments policies
CREATE POLICY "Admins and supervisors can manage assignments"
    ON public.guard_assignments
    FOR ALL
    TO authenticated
    USING (get_user_role(auth.uid()) IN ('admin', 'supervisor'))
    WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'supervisor'));

CREATE POLICY "Guards can view their own assignments"
    ON public.guard_assignments
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.guards 
        WHERE id = guard_id AND user_id = auth.uid()
      ) OR get_user_role(auth.uid()) IN ('admin', 'supervisor')
    );

-- Assigned inventory policies
CREATE POLICY "Admins and supervisors can manage assigned inventory"
    ON public.assigned_inventory
    FOR ALL
    TO authenticated
    USING (get_user_role(auth.uid()) IN ('admin', 'supervisor'))
    WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'supervisor'));

CREATE POLICY "Guards can view their own assigned inventory"
    ON public.assigned_inventory
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.guards 
        WHERE id = guard_id AND user_id = auth.uid()
      ) OR get_user_role(auth.uid()) IN ('admin', 'supervisor')
    );

-- Insert a default admin user (you can change this later)
INSERT INTO public.guards (name, role, contact_info, base_salary, category, date_of_joining, is_active) 
VALUES ('System Admin', 'admin', 'admin@vigilance.com', 5000, 'Supervisor', CURRENT_DATE, true)
ON CONFLICT DO NOTHING;