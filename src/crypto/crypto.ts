import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Logger } from "../utils/log";

const log = new Logger();


export class Cryptography{
    private algorythm: string;
    private secret: string;
    private iv: Buffer;


    constructor(algorythm: string = process.env.CRYPTO_ALGORYTHM, secret: string = process.env.CRYPTO_SECRET){
        this.algorythm = algorythm;
        this.secret = secret;
        this.iv = Buffer.from(JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/crypto/config.json"), "utf-8")));
    }

    public encrypt(text: string): string{
        const cipher = crypto.createCipheriv(this.algorythm,this.secret, this.iv);
        
        return Buffer.concat([cipher.update(text), cipher.final()]).toString("hex");
    }

    public decrypt(hash: string): string{
        const decipher = crypto.createDecipheriv(this.algorythm, this.secret, Buffer.from(this.iv.toString("hex"), "hex"));
        
        return Buffer.concat([decipher.update(Buffer.from(hash, "hex")), decipher.final()]).toString();
    }
}
