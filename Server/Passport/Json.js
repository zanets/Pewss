import { Strategy as LocalStrategy } from 'passport-local';

const JSON_Strategy = (passport, users) => {

    passport.serializeUser((user, done) => {
        done(null, user.name);
    });

    passport.deserializeUser((name, done) => {
        const user = users[name];
        done(null, (user === undefined) ? false : user);
    });

    passport.use('json', new LocalStrategy({
        usernameField: 'name',
        passwordField: 'passwd',
        session: true,
    }, (name, passwd, done) => {
        let user = users[name];
        
        if(user === undefined || user.passwd !== passwd)
            done(null, false);
        else
            done(null, user);
    }));
};

module.exports = JSON_Strategy;
