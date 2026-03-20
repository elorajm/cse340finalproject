-- Add notes and updated_at columns to service_requests.
-- Run once against your PostgreSQL database.

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS notes      TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;
