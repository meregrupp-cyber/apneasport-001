-- Applications wait here between the form and the applicant confirming their
-- own email address. `payload` holds the personal data and is cleared as soon
-- as the application has been forwarded to the League; the whole row is
-- deleted once `purge_at` has passed.
CREATE TABLE IF NOT EXISTS athlete_applications (
  id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sending', 'confirmed')),
  locale TEXT NOT NULL CHECK (locale IN ('et', 'en')),
  payload TEXT,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  purge_at TEXT NOT NULL,
  verified_at TEXT,
  resend_count INTEGER NOT NULL DEFAULT 0,
  last_sent_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS athlete_applications_purge_at ON athlete_applications (purge_at);
