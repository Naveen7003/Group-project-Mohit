const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const userModel = new mongoose.Schema({

    username:{
        type:String,
        required:[true , "Username is required!"],
        unique:[true, "Username already Exist"],
        minLength : [3, "Username should atleast have 3 Characters"],
        maxLength : [15, "Username should atmost have 15 Characters"]
    },
    email: {
        type:String,
        required:[true , "Email is required!"],
        unique:[true, "Email already Exist"],
        match: [ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , "Email address is invalid!"],
    },
    password: {
        type:String,
        required:[true , "Password is required!"],
        maxLength: [15, "Password must be less than 15 Characters"],
        minLength: [6, "Password should have atleast 6 Characters"],
    },
    gender:{
        type:String,
        enum: ["Male", "Female", "Others"]
    },
    profileImage: {
        type: Object,
        default: {
            fileId: "",
            url:"https://images.unsplash.com/photo-1682905926517-6be3768e29f0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8",
        },
    },
    contact: {
        type: String,
        required: true,
        minLength: [10, "Contact should contain atleast 10 digits"],
        maxLength: [10, "Contact should contain atmost 10 digits"]
    },
    allorders: {
        type: [mongoose.Schema.Types.ObjectId],  // Array of ObjectIds
        ref: "Order",
        default: []
    },

}, { timestamps: true });

userModel.pre("save", function(){
    if(!this.isModified("password")){
    return;
 }   
    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt)
})

userModel.methods.comparepassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

userModel.methods.getjwttoken = function(){             //jb bhi ye call hoga to token generate hojayega iske liye alag se utils mai sendtoken file bayenge
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}


module.exports = mongoose.model("User", userModel);