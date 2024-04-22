import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import db from "../db/db.js";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

dotenv.config();

let dq;

db.connectToDb((error) => {
  if (!error) {
    dq = db.getDb();
  }
});

// Serialize User
passport.serializeUser((user, done) => {
  done(null, { id: user._id, name: user.name, email: user.email });
});

// Deserialize User
passport.deserializeUser((_id, done) => {
  dq.collection("users")
    .findOne({ _id: new ObjectId(_id) })
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error);
    });
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/auth/google/redirect",
      clientID: process.env.GOOGLE_CLIENT,
      clientSecret: process.env.GOOGLE_SECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        googleId: profile.id,
        name: profile.displayName,
        picture: profile._json.picture,
        email: profile._json.email,
      };

      dq.collection("users").insertOne(user, (err, result) => {
        if (err) {
          console.log("Error inserting user:", err);
          done(err);
        }
        console.log("User inserted successfully:", result.ops[0]);
        done(null, result.ops[0]);
      });
    }
  )
);

export default passport;
