import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const checkMongoUser = async (email) => {
    try {
        await connectDB();
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found in MongoDB.");
        } else {
            console.log("✅ User found in MongoDB!");
            console.log("👤 Profile:", {
                _id: user._id,
                email: user.email,
                isRealmLinked: user.isRealmLinked,
                moscownpurId: user.moscownpurId
            });
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkMongoUser("shashank.asthana05@gmail.com");
