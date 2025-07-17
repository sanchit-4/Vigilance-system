/*
  # Allow Anonymous Access for Development

  This migration temporarily allows anonymous users to manage guards and clients
  for development purposes. In production, you should implement proper authentication.

  ## Changes Made:
  1. Add policies for anonymous users to manage guards
  2. Add policies for anonymous users to manage clients
  3. Add policies for anonymous users to manage other tables

  ## Security Note:
  This is for development only. Remove these policies in production!
*/

-- Allow anonymous users to manage guards (for development)
CREATE POLICY "Anonymous users can manage guards (development only)"
    ON public.guards
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Allow anonymous users to manage clients (for development)
CREATE POLICY "Anonymous users can manage clients (development only)"
    ON public.clients
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Allow anonymous users to manage locations (for development)
CREATE POLICY "Anonymous users can manage locations (development only)"
    ON public.locations
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Allow anonymous users to manage inventory_items (for development)
CREATE POLICY "Anonymous users can manage inventory_items (development only)"
    ON public.inventory_items
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Allow anonymous users to manage attendance (for development)
CREATE POLICY "Anonymous users can manage attendance (development only)"
    ON public.attendance
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Allow anonymous users to manage salary_advances (for development)
CREATE POLICY "Anonymous users can manage salary_advances (development only)"
    ON public.salary_advances
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Allow anonymous users to manage guard_assignments (for development)
CREATE POLICY "Anonymous users can manage guard_assignments (development only)"
    ON public.guard_assignments
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Allow anonymous users to manage assigned_inventory (for development)
CREATE POLICY "Anonymous users can manage assigned_inventory (development only)"
    ON public.assigned_inventory
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);