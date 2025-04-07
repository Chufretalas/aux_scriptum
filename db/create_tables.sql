CREATE TABLE IF NOT EXISTS diary_entries (
    id INTEGER PRIMARY KEY NOT NULL,
    day INTEGER NOT NULL,
    title TEXT,
    content TEXT
);