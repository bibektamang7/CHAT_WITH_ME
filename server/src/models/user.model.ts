import mongoose,{Schema,Document} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends Document{
  username: string;
  email: string;
  password: string;
  refreshToken: string;
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    index : true,
    
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken : {
    type: String,
  }
},{timestamps: true});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(this.password, password);
}
userSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign({
      _id: this._id,
  },
      process.env.REFRESH_TOKEN_SECRET!,
      {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY!,
      }
  );
};

userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
      {
          _id: this._id,
          email: this.email,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY!,
      }
  );
};


export const User = mongoose.model("User",userSchema);
