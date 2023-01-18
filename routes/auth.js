const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async(req, res)=>{
    try{
        //salting of password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            username: req.body.username,
            authorname: req.body.authorname,
            email: req.body.email,
            password: hashedPassword,
        })
        const user = await newUser.save();
        user.validate()
        res.status(200).json(user);
    } catch(err){ 
        res.status(500).json(err);
    }
});

//LOGIN
router.post("/login", async(req, res)=>{
    try{
        const user = await User.findOne({username: req.body.username});
        if(!user){
            res.status(400).json("Wrong Credentials!");
            return;
        }

        const validated = await bcrypt.compare(req.body.password, user.password);
        // console.log("val is " + validated);
        if(!validated){
            res.status(400).json("Wrong Credentials!");
            return;
        }
        
        if(user && validated){
            //it will show everything except password
            const { password, ...others } = user._doc;
            res.status(200).json(others);
        }
        else{
            res.status(400).json("Wrong Credentials!..")
        }
    } 
    catch (err) {
        res.status(500).json(err);
    } 
})

module.exports = router;