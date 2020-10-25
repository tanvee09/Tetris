const express = require("express");
const app = express();
const pool = require("./db");

app.set("view engine", "ejs");
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.static("static"));



app.get("/", async(req, res) => {
    res.render("index");
});


// Add scores
app.post("/", async(req, res) => {
    const { nameInp, scoreInp, timeInp } = req.body;
    let errors = [];
    console.log(nameInp + ',' + scoreInp + ',' + timeInp);
    if (!nameInp) {
        errors.push({ message: "Please enter name."});
    }

    if (errors.length > 0) {
        return res.render("index", { errors, nameInp, scoreInp, timeInp });
    }

    pool.query(
        `INSERT INTO scores_test (name, score, time_taken)
         VALUES ($1, $2, $3) RETURNING id, name;`,
        [nameInp, scoreInp, timeInp],
        (err, results) => {
            if (err) {
                console.log(err);
            } else {
                pool.query(
                    `UPDATE scores_test
                     SET name=$1
                     WHERE id=$2;`,
                    [results.rows[0].name + '#' + results.rows[0].id, results.rows[0].id],
                    (err, results) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(results.rows);
                            res.redirect("/scoreboard");
                        }
                    }
                );  
            }
        }
    );
});


app.get("/scoreboard", async(req, res) => {
    pool.query(
        `SELECT ROW_NUMBER() OVER (ORDER BY score DESC, time_taken ASC)
         AS rank, name, score, time_taken FROM scores_test;`,
        [],
        (err, results) => {
            if (err) {
                console.log(err);
            } else {
                console.log(results.rows);
                res.render("scoreboard", { entries: results.rows });
            }
        }
    );
});



app.listen(3000, () => {
    console.log('Server started on port 3000');
});