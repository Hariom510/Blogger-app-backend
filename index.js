const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoriesRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");

dotenv.config(); 
app.use(express.json());
// app.use("/images", express.static(path.join(__dirname, "/images")));
 
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    autoIndex: true, //make this also true

}).then(()=>{
    console.log("Successfully connected to mongodb");
}).catch((err)=>{
    console.log(err);
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage: storage }); 
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded");
})

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoriesRoute);
app.use("/images", express.static(path.join(__dirname, "/images")));

 
// console.log("juiu");


app.listen("5000", ()=>{
    console.log("Backend is running.");
})

//multer library helps us to upload files.
// instead of multer we can use firebase or AWS