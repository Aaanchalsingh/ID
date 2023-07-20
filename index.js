// index.js

const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const multer=require("multer");
const dotenv=require("dotenv");
const path=require("path");

const app=express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
const staticPath=path.join(__dirname, "public");
app.use(express.static(staticPath));
dotenv.config();

const itemSchema=new mongoose.Schema({
    name: String,
    cname: String,
    loc: String,
    pic: String,
});
const Item=mongoose.model("Item", itemSchema);

main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGO_URI);

    const storage=multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "public/uploads");
        },
        filename: function (req, file, cb) {
            cb(null, Date.now()+"-"+file.originalname);
        },
    });
    const upload=multer({ storage: storage });



    const itemsCount=await Item.countDocuments();
    if (itemsCount===0) {
        const item1=new Item({
            name: "Aanchal",
            cname: "LPU",
            loc: "Punjab",
            pic: "",
        });
        await item1.save();
    }

    app.get("/", function (req, res) {
        Item.find().then((data) => {
            const items=data.map((item) => ({
                name: item.name,
                cname: item.cname,
                loc: item.loc,
                pic: item.pic,
            }));
            res.render("index", { items: JSON.stringify(items) });
        });
    });

    app.post("/", upload.single("pic"), function (req, res) {
        const itemname=req.body.name;
        const itemcname=req.body.cname;
        const itemloc=req.body.loc;
        const itempic=req.file? req.file.filename:"";

        const item4=new Item({ name: itemname, cname: itemcname, loc: itemloc, pic: itempic });
        item4.save();
        res.redirect("/");
    });

    return app;
}

const server=main();

module.exports=server;
