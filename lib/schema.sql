-- lib/schema.sql
CREATE TABLE IF NOT EXISTS links (
    id SERIAL PRIMARY KEY,
    code VARCHAR(8) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    clicks INTEGER DEFAULT 0,
    last_clicked TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_code ON links(code);
CREATE INDEX IF NOT EXISTS idx_created_at ON links(created_at);