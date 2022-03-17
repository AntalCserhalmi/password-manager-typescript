import passportLocal from "passport-local";
import passport from "passport";
import { User } from "../database/schemas/User";
import { Logger } from "../utils/log";
import bcrypt from "bcrypt";

const log = new Logger();
const LocalStrategy = passportLocal.Strategy;

passport.serializeUser(function(user: any, done){
    done(null, user.userId)
});

passport.deserializeUser(async function(id, done){
    try{
        let user = await User.findOne({userId: id});
        if (user)
            done(null, user);
            
    }catch(err){
        log.error(err);
        done(err, null);
    }
});

const strategy = new LocalStrategy(
    async function verify(username, password, done){
        try{
            const result = await User.findOne({username: username});
        
            if (result === null)
                return done(null, false, {message: "User does not exist"});
            
            if (bcrypt.compare(password, result.password))
                return done(null, result);
    
            return done(null, null);

        }catch(err){
            log.error(err);
            return done(err, null);
        }
    }
)

export const Strategy = strategy;