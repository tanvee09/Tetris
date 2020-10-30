CREATE TABLE scores_test(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    score INTEGER NOT NULL CHECK(score >= 0),
    time_taken DOUBLE PRECISION NOT NULL CHECK (time_taken >= 0)
);

