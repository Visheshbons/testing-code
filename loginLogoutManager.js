// Imports required data
import { app, user, users, getDateAndTime, login, LoginLoadCount, prankUserName, SHA1 } from './appConfig.js';
import chalk from 'chalk';

// Replaces constants with variables
let LLC = LoginLoadCount;
let logon = login;
let prankUser_username = prankUserName;

// Renders "/login.js"
app.get("/login.ejs", (req, res) => {
    res.render("login.ejs");
    console.log(`Login page loaded. (${LLC})`);
    LLC++;
});

// Handles the "/login" request
app.post("/login", (req, res) => {
    console.time("Loading time");
    logon = false;
    users.forEach((_user, index) => {
        if (!logon) {
            console.log(`Checking username and password... ` + chalk.dim(`(${_user.user})`));
            if (SHA1(req.body.username) == _user.user && SHA1(req.body.password) == _user.pass) {
                console.log(`User: ${chalk.green(_user.user)} successfully logged in!`);
                res.cookie(`username`, SHA1(req.body.username));
                console.log(`Cookie set!`);
                console.timeEnd("Loading time");
                console.log(``);
                res.redirect("/database");
                logon = true;
            }
        }
    });
    if (!logon){
        res.redirect("/");
        console.log(chalk.bgRed.yellowBright("ALERT:") + chalk.yellow(` Attempted login with username "${req.body.username}" and password "${req.body.password}".`));
        console.timeEnd("Loading time");
    }
    console.log(`Encryped Username: ${SHA1(req.body.username)}`)
    console.log(`Encrypted Password: ${SHA1(req.body.password)}`)
});

// Handles the "/LogoutFunc" request
app.post("/LogoutFunc", (req, res) => {
    console.log(`User ${chalk.green(req.cookies.username)} logging out. Clearing cookies...`)
    res.clearCookie('username');
    console.log(`Cookies cleared.`)
    console.log(chalk.italic(getDateAndTime()));
    res.redirect("/")
    console.log(``)
});

// Handles "Create Account" request
app.get("/signup", (req, res) => {
    res.render("signup.ejs");
    console.log(`Create account page loaded.`);
    console.log(chalk.italic(getDateAndTime()));
    console.log(``);
});

// Handles "Create Account" submission
app.post("/signup", (req, res) => {
    console.time("Loading time");
    const newUser = new user(SHA1(req.body.username), SHA1(req.body.password));
    users.push(newUser); // Add the new user to the users array
    console.log(`User added: ${chalk.green(newUser.user)}`);
    console.log(chalk.italic(getDateAndTime()));
    console.log(``);
    res.redirect("/login.ejs");
    console.timeEnd("Loading time");
});

// Handles "Delete Account" request
app.get("/delete", (req, res) => {
    res.render("delete.ejs");
    console.log(`Delete account page loaded.`);
    console.log(chalk.italic(getDateAndTime()));
    console.log(``);
});

// Handles "Delete Account" submission
app.post("/delete", (req, res) => {
    console.time("Loading time");
    const userIndex = users.findIndex(user => user.user === SHA1(req.body.username) && user.pass === SHA1(req.body.password));
    if (userIndex !== -1) {
        users.splice(userIndex, 1); // Remove the user from the array
        console.log(`User deleted: ${chalk.red(SHA1(req.body.username))}`);
        console.log(chalk.italic(getDateAndTime()));
        console.log(``);
        res.redirect("/login.ejs");
    } else {
        console.log(`User not found: ${chalk.red(SHA1(req.body.username))}`);
        console.log(chalk.italic(getDateAndTime()));
        console.log(``);
        res.redirect("/delete.ejs");
    }
    console.timeEnd("Loading time");
});