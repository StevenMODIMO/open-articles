import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
//import TwitterStrategy from "passport-twitter";
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
  done(null, user._id);
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
      clientID: process.env.GOOGLE_CLIENT,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `https://open-articles.onrender.com/auth/google/redirect`,
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        googleId: profile.id,
        username: profile.displayName,
        imageURL: profile._json.picture,
        email: profile._json.email,
      };

      dq.collection("users")
        .findOne({ googleId: profile.id })
        .then((currentUser) => {
          if (currentUser) {
            done(null, currentUser);
          } else {
            dq.collection("users")
              .insertOne(user)
              .then((result) => {
                done(null, user);
              })
              .catch((error) => {
                console.error("Failed to insert user:", error);
                done(error, null);
              });
          }
        })
        .catch((error) => {
          console.error("Database query error:", error);
          done(error, null);
        });
    }
  )
);

// passport.use(
//   new TwitterStrategy(
//     {
//       consumerKey: process.env.TWITTER_CONSUMER_KEY,
//       consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
//       callbackURL: "/auth/twitter/redirect",
//     },
//     (token, tokenSecret, profile, done) => {
//       const user = {
//         username: profile.username,
//         twitterId: profile.id,
//         imageURL: profile._json.profile_image_url,
//       };
//       dq.collection("users")
//         .findOne({ twitterId: profile.id })
//         .then((currentUser) => {
//           if (currentUser) {
//             done(null, currentUser);
//           } else {
//             dq.collection("users")
//               .insertOne(user)
//               .then((result) => {
//                 done(null, user);
//               })
//               .catch((error) => {
//                 console.error("Failed to insert user:", error);
//                 done(error, null);
//               });
//           }
//         })
//         .catch((error) => {
//           console.error("Database query error:", error);
//           done(error, null);
//         });
//     }
//   )
// );

export default passport;
