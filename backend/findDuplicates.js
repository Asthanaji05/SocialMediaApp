import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const findDuplicates = async (email) => {
    try {
        await connectDB();
        const users = await User.find({ email: { $regex: new RegExp(email, "i") } });
        console.log(`📡 Found ${users.length} users with email matching ${email}`);
        users.forEach(u => {
            console.log(`👤 ID: ${u._id}, Username: ${u.userName}, Linked: ${u.isRealmLinked}, RealmId: ${u.moscownpurId}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

findDuplicates("shashank.asthana05@gmail.com");
