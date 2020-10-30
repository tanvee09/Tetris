const express = require("express");
const app = express();
const pool = require("./db");

app.set("view engine", "ejs");
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/../client/static`));
app.set('views', `${__dirname}/../client/views`);


app.get("/", async(req, res) => {
    res.render("index");
});


// Add scores
app.post("/", async(req, res) => {
    const { nameInp, scoreInp, timeInp } = req.body;
    let errors = [];
    console.log(nameInp + ',' + scoreInp + ',' + timeInp);
    if (!nameInp) {
        errors.push({ message: "Please enter name." });
    }

    if (errors.length > 0) {
        return res.render("index", { errors, nameInp, scoreInp, timeInp });
    }

    pool.query(
        `INSERT INTO scores_test (name, score, time_taken)
         VALUES ($1, $2, $3) RETURNING id, name;`, [nameInp, scoreInp, timeInp],
        (err, results) => {
            if (err) {
                console.log(err);
            } else {

                user_id = results.rows[0].id;
                pool.query(
                    `UPDATE scores_test
                     SET name=$1
                     WHERE id=$2;`, [results.rows[0].name + '#' + results.rows[0].id, results.rows[0].id],
                    (err, results) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(results.rows);
                            res.redirect(`/scoreboard${user_id}`);
                        }
                    }
                );
            }
        }
    );
});


// Show scoreboard with rank +- 5 of given row id
app.get("/scoreboard:id", async(req, res) => {
    const id = req.params.id;
    console.log(id);
    pool.query(
        `DROP VIEW IF EXISTS scoreboard;`,[],
        (err, results) => {
            if (err) {
                console.log(err);
            } else {
                pool.query(
                    `CREATE VIEW scoreboard as (SELECT ROW_NUMBER() OVER (ORDER BY score DESC, time_taken ASC)
                     AS rank, id, name, score, time_taken FROM scores_test);`, [],
                    (err, results) => {
                        if (err) {
                            console.log(err);
                        } else {
                            pool.query(
                                `SELECT rank, name, score, time_taken FROM scoreboard
                                 WHERE rank >= ((SELECT rank FROM scoreboard WHERE id = $1) - 5) AND rank <= ((SELECT rank FROM scoreboard WHERE id = $1) + 5)
                                 ORDER BY rank;`, [id],
                                (err, results) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log(results.rows);
                                        res.render("scoreboard", { entries: results.rows, USER_ID: id });
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );   
});


// Show entire scoreboard
app.get("/scoreboard", async(req, res) => {
    pool.query(
        `SELECT ROW_NUMBER() OVER (ORDER BY score DESC, time_taken ASC)
         AS rank, name, score, time_taken FROM scores_test;`, [],
        (err, results) => {
            if (err) {
                console.log(err);
            } else {
                console.log(results.rows);
                res.render("scoreboard", { entries: results.rows, USER_ID: 0 });
            }
        }
    );
});



app.listen(3000, () => {
    console.log('Server started on port 3000');
});