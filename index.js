const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");



main().catch((err) => console.log(err));

async function main() {
    const app = express();
    app.set("view engine", "ejs");
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static("public"));

    await mongoose.connect("mongodb://127.0.0.1:27017/id");

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "public/uploads"); // Directory where uploaded files will be stored
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname); // Generate a unique filename for the uploaded file
        },
    });
    const upload = multer({ storage: storage });

    const itemSchema = new mongoose.Schema({
        name: String,
        cname: String,
        loc: String,
        pic: String
    });
    const Item = mongoose.model("Item", itemSchema);

    const itemsCount = await Item.countDocuments();
    if (itemsCount === 0) {
        const item1 = new Item({ name: "Aanchal", cname: "LPU", loc: "Punjab", pic: "" });
        await item1.save();
    }

    app.get("/", function(req, res) {
        Item.find().then((data) => {
            const items = data.map(item => ({
                name: item.name,
                cname: item.cname,
                loc: item.loc,
                pic: item.pic
            }));
            res.render("index", { items: JSON.stringify(items) });
        });
    });

    app.post("/", upload.single("pic"), function(req, res) {

        const itemname = req.body.name;
        const itemcname = req.body.cname;
        const itemloc = req.body.loc;
        const itempic = req.file ? req.file.filename : ""; // Get the filename of the uploaded image

        const item4 = new Item({ name: itemname, cname: itemcname, loc: itemloc, pic: itempic });
        item4.save();
        res.redirect("/");
    });

    app.listen(3000, function() {
        console.log("success");
    });
}
