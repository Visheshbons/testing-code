// Imports required data as well as Chalk
import { app, users, getDateAndTime, DatabaseLoadCount } from './appConfig.js';
import chalk from 'chalk';

// Replaces constants with variables
let DBLC = DatabaseLoadCount;
let loadAuth = null;

// Redirect to "/database"
app.get("/database.ejs", (req, res) => {
    res.redirect("/database");
});

// Renders "/database"
app.get("/database", (req, res) => {
    loadAuth = null;
    console.time("Time loading");
    users.forEach((_user, index) => {
        if (req.cookies.username == _user.user) {
            res.render("database.ejs");

            console.log(`Database page loaded by the user: ${chalk.green(_user.user)}. (${DBLC})`);
            console.timeEnd("Time loading");
            loadAuth = true;
            DBLC++;
            return;
        } else if (req.cookies.username == `generic`) {
            res.render("Forbidden.ejs", {
                generic: `no`,
            });
            console.log(chalk.yellow(`User redirected to "403: Forbidden" page due to generic login.`));
            console.timeEnd("Time loading");
            console.log(``)
            loadAuth = true;
        };
    });

    // If the user is not authorised with cookies
    if (!loadAuth) {
        res.render("Forbidden.ejs");
        console.log(`${chalk.bgRed.yellowBright(`ALERT:`)}${chalk.yellowBright(`A user attempted to login, but neccesary cookies were not detected.`)}`);
        console.timeEnd("Time loading");
        console.log(``);
    };
});
