-- Allow reviews without a vehicle (general/service reviews)
ALTER TABLE reviews ALTER COLUMN vehicle_id DROP NOT NULL;
