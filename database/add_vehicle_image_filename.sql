-- Run this once to add the optional image_filename column to vehicles.
-- When NULL, the app auto-generates the filename from year/make/model.
-- When set, the app uses this filename directly (no path prefix needed,
-- just the filename, e.g. "2020chevroletcorvette.jpg").

ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS image_filename VARCHAR;
