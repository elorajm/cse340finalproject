-- Replace inventory vehicle_id reference with free-text car info.
-- Run once against your PostgreSQL database.

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS car_year  VARCHAR(10),
  ADD COLUMN IF NOT EXISTS car_make  VARCHAR(100),
  ADD COLUMN IF NOT EXISTS car_model VARCHAR(100);
