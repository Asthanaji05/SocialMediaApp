import passport from "passport";
import bcrypt from "bcrypt";
import User from "../models/User.js"; // Import User model

export const googleCallback = (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "http://localhost:5173/login" },
    async (err, userProfile) => {
      if (err || !userProfile) {
        console.error("Google authentication failed:", err || "No user found");
        return res.redirect("http://localhost:5173/login"); // Redirect to login page on failure
      }

      try {
        const { id: googleId, name, emails, photos } = userProfile;
        const firstName = name?.givenName || "Unknown";
        const lastName = name?.familyName || "Unknown";
        const email = emails?.[0]?.value; // Get the first email
        const image = photos?.[0]?.value; // Get the first profile photo

        // Check if email is available
        if (!email) {
          console.error("Google authentication failed: Email is required");
          return res.redirect(
            "http://localhost:5173/login?error=email_required"
          );
        }

        // Check if a user exists with the Google ID
        let user = await User.findOne({ googleId });

        if (!user) {
          // If no user exists with the Google ID, check by email
          user = await User.findOne({ email });

          if (user) {
            if (!user.googleId) {
              // If the user exists but doesn't have a Google ID, redirect to password verification
              return res.redirect(
                `http://localhost:5173/google-password-verification?email=${email}&googleId=${googleId}`
              );
            }
          } else {
            // If no user exists with the email, create a new user
            user = await User.create({
              googleId,
              firstName,
              lastName,
              email,
              image,
            });
          }
        }

        // Log the user in
        req.logIn(user, (error) => {
          if (error) {
            console.error("Error logging in user:", error);
            return next(error);
          }

          console.log("User logged in:", user);
          return res.redirect("http://localhost:5173/dashboard");
        });
      } catch (error) {
        console.error("Error during Google authentication:", error);
        return res.redirect("http://localhost:5173/login");
      }
    }
  )(req, res, next);
};

export const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};

export const verifyPassword = async (req, res) => {
  const { email, password, googleId } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Save Google ID for future logins
    user.googleId = googleId;
    await user.save();

    res.status(200).json({ message: "Google ID linked successfully" });
  } catch (error) {
    console.error("Error during password verification:", error);
    res.status(500).json({ message: "Server error" });
  }
};
