import User from "../models/User.js";
import realmSupabase, { realmAdmin } from "../utils/supabaseClient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Import JWT
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  // const { email, password, firstName, lastName, userName } = req.body;
  const { email, password, firstName, lastName = "", userName } = req.body;

  // Check if all required fields are provided
  if (!email || !password || !firstName || !userName) {
    // console.log("Missing fields:", req.body);
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // console.log("User already exists:", existingUser); // Debugging
      return res.status(400).json({ message: "User already exists" });
    }
    const existingUsername = await User.findOne({ userName });
    if (existingUsername) {
      // console.log("UserName already taken:", existingUsername); // Debugging
      return res.status(400).json({ message: "UserName already taken" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      userName,
    });

    await user.save();
    // 🚒🚒🚒
    if (!user || !user._id) {
      // console.log("Error: User ID is missing!", user); // Debugging
      return res.status(400).json({ error: "User ID missing" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User created successfully",
      token, // Return the token
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
      },
    });
  } catch (error) {
    // console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
// Update a user
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User Login Controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;



  // Check if both email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      token, // Send token
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
      },
    });
  } catch (error) {
    // console.error("Error during login:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
// Get the logged-in user's profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract userId from the JWT payload
    const user = await User.findById(userId).select("-password"); // Exclude the password field
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    // console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// logout user
export const logoutUser = async (req, res) => {
  try {
    // Invalidate the token or perform any other logout logic here
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Change password
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId; // Extract userId from the JWT payload

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if the old password matches
    // const isMatch = oldPassword === user.password;
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Update the password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// follower and following controllers
export const followUser = async (req, res) => {
  const { userId } = req.body;
  const followUserId = req.params.id;

  try {
    const user = await User.findById(userId);
    const followUser = await User.findById(followUserId);

    if (!user || !followUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.following.includes(followUserId)) {
      user.following.push(followUserId);
      followUser.followers.push(userId);
      await user.save();
      await followUser.save();
    }

    res.status(200).json({ message: "Followed successfully" });
  } catch (error) {
    // console.error("Error following user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
export const unfollowUser = async (req, res) => {
  const { userId } = req.body;
  const unfollowUserId = req.params.id;

  try {
    const user = await User.findById(userId);
    const unfollowUser = await User.findById(unfollowUserId);

    if (!user || !unfollowUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.following.includes(unfollowUserId)) {
      user.following.pull(unfollowUserId);
      unfollowUser.followers.pull(userId);
      await user.save();
      await unfollowUser.save();
    }

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    // console.error("Error unfollowing user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get followers and following
export const getFollowers = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("followers", "-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user.followers);
  } catch (error) {
    // console.error("Error fetching followers:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
export const getFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("following", "-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user.following);
  } catch (error) {
    // console.error("Error fetching following:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// getUserProfileByUsername
export const getUserProfileByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ userName: username }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    // console.error("Error fetching user profile by username:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
// getUserProfileByEmail
export const getUserProfileByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    // console.error("Error fetching user profile by email:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch users the logged-in user is following
export const getFollowingUsers = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate(
      "following",
      "firstName lastName userName image"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.following); // Return the list of followed users
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller
// controllers/userController.js

export const searchUsers = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query parameter is missing" });
  }

  try {
    // Perform a case-insensitive search on the `userName` field
    const users = await User.find({
      userName: { $regex: query, $options: "i" }, // Case-insensitive regex search
    }).select("userName _id"); // Only return `userName` and `_id`

    res.status(200).json(users);
  } catch (err) {
    // console.error("Error in searchUsers:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Google Login
// export const googleLogin = async (req, res) => {
//   const { googleId, email } = req.body;

//   try {
//     const user = await User.findOne({ googleId });

//     if (user) {
//       const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//         expiresIn: '1h',
//       });

//       return res.json({
//         message: 'Login successful',
//         token,
//         user: {
//           id: user._id,
//           email: user.email,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           userName: user.userName,
//         },
//       });
//     } else {
//       // Redirect to registration if not found
//       return res.status(302).json({
//         message: 'User not found, please register',
//         redirect: '/auth/google/signup',
//         email,
//         googleId,
//       });
//     }
//   } catch (error) {
//     console.error('Error in Google login:', error);
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the ID token sent by Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Ensure this matches your Google Client ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, given_name, family_name } = payload;

    // Check if the user already exists in the database by googleId
    let user = await User.findOne({ email });

    if (!user) {
      // If no user found, redirect to signup with the googleId and email as prefilled data
      return res.status(302).json({
        message: 'User not found, please register',
        redirect: '/auth/google/signup',
        email,
        googleId,
      });
    }

    // If user exists, we update the googleId field (if it's not already set)
    if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    // Generate a JWT token for the user
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Send response with the JWT token and user data
    res.status(200).json({
      message: 'Login successful',
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
      },
    });
  } catch (error) {
    // console.error('Google login error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};



// Google Signup
export const googleSignup = async (req, res) => {
  const { email, googleId, password, firstName, lastName = '', userName } = req.body;

  if (!email || !googleId || !password || !firstName || !userName) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const existingUsername = await User.findOne({ userName });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      googleId,
      password: hashedPassword,
      firstName,
      lastName,
      userName,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
      },
    });
  } catch (error) {
    // console.error('Error in Google signup:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Check Google User Existence
export const checkGoogleUser = async (req, res) => {
  const { googleId } = req.body;

  try {
    const user = await User.findOne({ googleId });
    if (user) {
      return res.json({ exists: true });
    }
    res.json({ exists: false });
  } catch (error) {
    // console.error('Error checking Google user:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Sync with Moscownpur (RealM)
export const syncMoscownpurProfile = async (req, res) => {
  const userId = req.user.userId || req.user.id;
  console.log(`\n--- 🔄 SYNC REQUEST START ---`);
  console.log(`👤 Maitrilok User ID: ${userId}`);

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error(`❌ Sync Failed: User not found in MongoDB for ID: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    const userEmail = user.email ? user.email.toLowerCase().trim() : "";
    console.log(`📧 Syncing with Email: "${userEmail}"`);

    // 1. Query Supabase profiles table by email
    console.log(`📡 Querying Supabase RealM...`);
    const { data: profile, error: supabaseError } = await realmSupabase
      .from('profiles')
      .select('id, email, username')
      .ilike('email', userEmail)
      .single();

    if (supabaseError) {
      console.error("❌ Supabase Profile Fetch Error:", supabaseError.message);
      if (supabaseError.code === 'PGRST116') {
        return res.status(404).json({
          message: `No Moscownpur account found for ${userEmail}. Ensure your emails match exactly.`,
          linked: false
        });
      }
      return res.status(500).json({ message: "Supabase connection error", error: supabaseError.message });
    }

    console.log(`✅ Supabase Profile Found: @${profile.username} (${profile.id})`);

    // 2. Map IDs in MongoDB (Atomic Update)
    console.log("💾 Updating MongoDB bridge fields...");
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          moscownpurId: profile.id,
          isRealmLinked: true
        }
      },
      { new: true }
    );

    if (!updatedUser || !updatedUser.isRealmLinked) {
      console.error("❌ MongoDB update failed to persist.");
      throw new Error("Local database update failed to persist.");
    }
    console.log(`✅ MongoDB Update Confirmed for ${updatedUser.userName}`);

    // 3. Attempt to back-map in Supabase (Moscownpur) using Admin Client
    let supabaseSyncSuccess = true;
    console.log("🔗 Back-linking Maitrilok ID to Supabase...");
    const { error: updateError } = await realmAdmin
      .from('profiles')
      .update({ maitrilok_id: userId.toString() })
      .eq('id', profile.id);

    if (updateError) {
      console.warn("⚠️ Supabase back-map failed (Permissions/RLS):", updateError.message);
      supabaseSyncSuccess = false;
    } else {
      console.log(`✅ Supabase ID Mapping Success.`);
    }

    // 4. Always fetch initial stats so the UI works regardless of total sync success
    console.log("📈 Fetching initial creative stats...");
    const [worldsRes, charsRes, finalProfile] = await Promise.all([
      realmSupabase.from('worlds').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
      realmSupabase.from('characters').select('id', { count: 'exact', head: true }).eq('author_id', profile.id),
      realmSupabase.from('profiles').select('xp_score, username').eq('id', profile.id).single()
    ]);

    console.log("✅ Stats compiled. Sending response.");
    console.log(`--- 🔄 SYNC REQUEST COMPLETE ---\n`);

    res.status(200).json({
      message: supabaseSyncSuccess ? "Profiles synced successfully!" : "Linked locally, but Supabase update failed (Permissions).",
      linked: true,
      moscownpurId: profile.id,
      stats: {
        worlds: worldsRes.count || 0,
        characters: charsRes.count || 0,
        xp: finalProfile.data?.xp_score || 0,
        username: finalProfile.data?.username || profile.username
      },
      supabaseLinked: supabaseSyncSuccess
    });
  } catch (error) {
    console.error("💥 Critical Failure in Sync Controller:", error);
    res.status(500).json({ message: "Sync failed", error: error.message });
  }
};

export const getMoscownpurStatus = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await User.findById(userId).select("isRealmLinked moscownpurId");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isRealmLinked && user.moscownpurId) {
      // Fetch stats from Supabase
      const [worldsRes, charsRes, profileRes] = await Promise.all([
        realmSupabase.from('worlds').select('id', { count: 'exact', head: true }).eq('user_id', user.moscownpurId),
        realmSupabase.from('characters').select('id', { count: 'exact', head: true }).eq('author_id', user.moscownpurId),
        realmSupabase.from('profiles').select('xp_score, username').eq('id', user.moscownpurId).single()
      ]);

      return res.status(200).json({
        isRealmLinked: user.isRealmLinked,
        moscownpurId: user.moscownpurId,
        stats: {
          worlds: worldsRes.count || 0,
          characters: charsRes.count || 0,
          xp: profileRes.data?.xp_score || 0,
          username: profileRes.data?.username
        }
      });
    }

    res.status(200).json({ isRealmLinked: false });
  } catch (error) {
    console.error("Status Fetch Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


