import express, { Request } from "express";
import { checkAuthenticated, checkNotAuthenticated } from "./auth";
import path from "path";
import { User } from "../database/schemas/User";
import { Logger } from "../utils/log";
import { Cryptography } from "../crypto/crypto";
import { v4 } from "uuid";

const log = new Logger();
const crypto = new Cryptography();

export const router = express.Router();

router.get("/", checkAuthenticated, async function(req: any, res: express.Response){
    try{
        let users = await User.findOne({userId: req.session.passport.user}).select("accounts");
        res.render(path.join(process.cwd(), "src/views/dash/dash.ejs"), {data: {users: users.accounts, page: "dash"}});
    }catch(err){
        log.error(err);
        res.sendStatus(500);
    }
});

router.post("/decrypt", checkAuthenticated, function(req: any, res:express.Response){
    try{
        if (req.body && req.body.text){
            res.send({text: crypto.decrypt(req.body.text)});
        }else{
            res.send({text: "error"});
        }
    }catch(err){
        log.error(err);
        res.send({text: req.body.text});
    }
})


router.get("/add", checkAuthenticated, function(req: any, res:express.Response){
    res.render(path.join(process.cwd(), "src/views/dash/form.ejs"), {data: {page: "add", title: "Add Password", account: false}});
});

router.post("/add", async function(req: any, res:express.Response){
    try{
        if (req.session.passport.user &&req.body && req.body.site && req.body.username && req.body.password){
            let user = await User.findOne({userId: req.session.passport.user});
            user.accounts.push({
                siteId: v4(),
                site: req.body.site,
                username: req.body.username,
                password: crypto.encrypt(req.body.password),
                date: Date.now()
            });
            user.save();

            res.redirect("/dash");
        }else{
            res.redirect("/dash/add");
        }
    }catch(err){
        log.error(err);
        res.redirect("/dash/add");
    }
});

router.get("/edit/:id", checkAuthenticated, async function(req: any, res: express.Response){
    try{
        if (req.session.passport.user && req.params.id){
            let user = await User.findOne({userId: req.session.passport.user,accounts: {$all: [{"$elemMatch": {siteId: req.params.id}}]}}).select("accounts -_id");
            
            res.render(path.join(process.cwd(), "src/views/dash/form.ejs"), {data: {page: "edit", title: "Edit Password", account: user.accounts.find(account => {if (account.siteId === req.params.id) return account;})}});
        }
    }catch(err){
        log.error(err);
        res.render(path.join(process.cwd(), "src/views/error.ejs"), {data: {page: "error"}});
    }
});

router.put("/edit/:id", checkAuthenticated, async function (req: any, res: express.Response) {
    try{
        if (req.session.passport.user && req.params.id){
            let user = await User.findOne({userId: req.session.passport.user,accounts: {$all: [{"$elemMatch": {siteId: req.params.id}}]}}).select("accounts");
            for(var i=0; i < user.accounts.length; i++){
                let v = user.accounts[i];
                if (v.siteId === req.params.id){
                    v.site = req.body.site;
                    v.username = req.body.username;
                    v.password = crypto.encrypt(req.body.password);
                    break;
                }
            }

            user.markModified("accounts");
            user.save();
        }
        res.redirect("/dash");
    }catch(err){
        log.error(err);
        res.render(path.join(process.cwd(), "src/views/error.ejs"), {data: {page: "error"}});
    }
});

router.delete("/delete/:id", checkAuthenticated, async function(req: any, res:express.Response){
    try{
        if (req.session.passport.user && req.params.id){
            let user = await User.findOne({userId: req.session.passport.user,accounts: {$all: [{"$elemMatch": {siteId: req.params.id}}]}}).select("accounts");
            for(var i=0; i < user.accounts.length; i++){
                let v = user.accounts[i];
                if (v.siteId === req.params.id){
                    user.accounts.splice(i, 1);
                    break;
                }
            }

            user.markModified("accounts");
            user.save();
        }
        
        res.redirect("/dash");
    }catch(err){
        log.error(err);
        res.render(path.join(process.cwd(), "src/views/error.ejs"), {data: {page: "error"}});
    }
});