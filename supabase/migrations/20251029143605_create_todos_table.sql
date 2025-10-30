/*
  # Create todos table

  ## Description
  This migration creates a todos table to store todo items with real-time synchronization support.

  ## New Tables
  - `todos`
    - `id` (uuid, primary key) - Unique identifier for each todo
    - `todo` (text) - The todo item text content
    - `is_completed` (boolean) - Completion status of the todo
    - `created_at` (timestamptz) - Timestamp when the todo was created

  ## Security
  - Enable Row Level Security (RLS) on todos table
  - Add policy to allow all operations for anonymous users (no authentication required per requirements)

  ## Important Notes
  - This table supports multi-user editing without authentication
  - Real-time synchronization will be enabled through Supabase subscriptions
  - Default values ensure data consistency
*/

CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  todo text NOT NULL DEFAULT '',
  is_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for everyone"
  ON todos
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);