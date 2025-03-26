const {Schema,model,models} = require("mongoose");

const {createHmac, randomBytes} = require("crypto");
const { createToken } = require("../services/authentication");

const userSchema = new Schema({
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    salt:{
        type: String,
    },
    password:{
        type: String,
        required: true
    },
    profileImage:{
        type: String,
        default: "/images/default.png",
    },
    role:{
        type: String,
        enum:["ADMIN", "USER"],
        default: "USER"
    }
},{timestamps:true});


userSchema.pre("save", function (next){
    const user = this;
    if(!user.isModified("password")) return ;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");
    user.salt = salt;
    user.password = hashedPassword;
    next();
});

userSchema.static("matchPasswordAndGenerateToken",async function(email, password){
    const user =await this.findOne({email});
    if(!user) throw new Error("User not found");

    const hashedPassword = user.password;

    const salt = user.salt;
    const passwordMatch = createHmac("sha256", salt).update(password).digest("hex");

    if(hashedPassword !== passwordMatch) throw new Error("Invalid password");

    const token = createToken(user);
    return token;
})

const User = models.user || model("user",userSchema);

module.exports = User;