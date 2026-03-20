-- Promotions / coupons system
-- Run once against your PostgreSQL database.

CREATE TABLE IF NOT EXISTS promotions (
  promotion_id  SERIAL PRIMARY KEY,
  title         VARCHAR(200) NOT NULL,
  message       TEXT         NOT NULL,
  discount_code VARCHAR(50),
  expires_at    DATE,
  created_by    INT REFERENCES users(user_id) ON DELETE SET NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_promotions (
  id            SERIAL PRIMARY KEY,
  user_id       INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  promotion_id  INT NOT NULL REFERENCES promotions(promotion_id) ON DELETE CASCADE,
  is_read       BOOLEAN NOT NULL DEFAULT FALSE,
  received_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, promotion_id)
);
