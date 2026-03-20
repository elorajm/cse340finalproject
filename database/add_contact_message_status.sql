-- Add status tracking and internal notes to contact_messages.
-- Run once against your PostgreSQL database.

ALTER TABLE contact_messages
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'received',
  ADD COLUMN IF NOT EXISTS notes  TEXT;
