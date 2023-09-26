import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
    getDatabase,
    ref,
    push,
    onValue,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

const appsetting={
    databaseURL:
        "https://idcard-65ede-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app=initializeApp(appsetting);
const database=getDatabase(app);
const data=ref(database, "Card");

document.getElementById("add-button").addEventListener("click", handle);

function handle(event) {
    event.preventDefault();
    var name=document.getElementById("_name").value;
    var cname=document.getElementById("_cname").value;
    var loc=document.getElementById("_loc").value;
    var pic=document.getElementById("choose").files[0];

    if (!name||!cname||!loc||!pic) {
        alert("Please fill in all fields and select a picture.");
        return;
    }

    // Convert the picture to a data URL
    var reader=new FileReader();
    reader.onloadend=function () {
        var picDataUrl=reader.result;
        push(data, { name, cname, loc, pic: picDataUrl });
        document.getElementById("_name").value="";
        document.getElementById("_cname").value="";
        document.getElementById("_loc").value="";
        document.getElementById("choose").value="";
        document.querySelector('img[height="120"]').src="";

        // Set the src attribute of the displayed-image element
        document.getElementById("cardid").src=picDataUrl;
    };

    reader.readAsDataURL(pic);
    document.querySelector(".box2").style.visibility="visible";
    document.getElementById("name").innerHTML=name;
    document.getElementById("cname").innerHTML=cname;
    document.getElementById("loc").innerHTML=loc;
}


document.getElementById("choose").addEventListener("change", previewFile);

function previewFile() {
    var preview=document.querySelector('img[height="120"]');
    var file=document.getElementById("choose").files[0];
    var reader=new FileReader();

    reader.onloadend=function () {
        preview.src=reader.result;
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src="";
    }
}
