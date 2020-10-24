const { Pool } = require("pg");

const connectionString = "postgres://pimintvo:unIeSmfNrXPnVXAsJlzfShqSRkJg2epi@john.db.elephantsql.com:5432/pimintvo";

const pool = new Pool({
    connectionString: connectionString
});

module.exports = pool;