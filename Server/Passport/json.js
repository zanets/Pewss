import { Strategy as LocalStrategy } from 'passport-local';

const JSON_Strategy = (passport, users) => {

    passport.serializeUser((user, done) => {
        done(null, user.name);
    });

    passport.deserializeUser((name, done) => {
        const user = users.find(u => (u.name === name));
        done(null, (user === undefined) ? false : user);
    });

    passport.use('json', new LocalStrategy({
        usernameField: 'name',
        passwordField: 'passwd',
        session: true,
    }, (name, passwd, done) => {

        const user = users.find(u =>
            u.name === name && u.passwd === passwd
        );

        done(null, (user === undefined) ? false : user);
    }));
};


module.exports = JSON_Strategy;
