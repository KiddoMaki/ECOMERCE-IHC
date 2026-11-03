BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
  END IF;
END;
$$;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS auth_user_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS uq_users_auth_user_id
  ON users (auth_user_id);

CREATE UNIQUE INDEX IF NOT EXISTS uq_product_images_product_url
  ON product_images (product_id, image_url);

COMMIT;
