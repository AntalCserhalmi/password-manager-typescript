import express from "express";
import passport from "passport";

import path from "path";

export const router = express.Router();

export function checkAuthenticated(req: express.Request, res:express.Response, next:any): any{
    if (req.isAuthenticated()){
        return next();
    }

    res.redirect("/auth/login");
}

export function checkNotAuthenticated (req:express.Request, res: express.Response, next: any): any{
    if (req.isAuthenticated()){
        res.redirect("/dash");
        return;
    }
    
    next();
} 

router.get("/login", checkNotAuthenticated, function(req: express.Request, res: express.Response){
    res.render(path.join(process.cwd(), "src/views/auth/auth.ejs"));
});


router.post("/login", passport.authenticate("local"), function(req: express.Request, res: express.Response): any{
    res.redirect("/dash");
})

router.get("/logout", checkAuthenticated, function(req: express.Request, res:express.Response){
    req.logOut();
    res.redirect("/auth/login");
});

router.post("/logout", checkAuthenticated, function(req: express.Request, res:express.Response){
    req.logOut();
    res.redirect("/auth/login");
});