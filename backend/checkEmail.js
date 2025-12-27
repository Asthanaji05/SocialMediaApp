import dotenv from "dotenv";
import realmSupabase from "./utils/supabaseClient.js";

dotenv.config();

const checkSpecificEmail = async (email) => {
    console.log(`🕒 Checking Supabase for: ${email}`);

    try {
        const { data: profile, error } = await realmSupabase
            .from('profiles')
            .select('id, email, username')
            .ilike('email', email)
            .single();

        if (error) {
            console.error("❌ Error/Not Found:", error.message);
            if (error.code === 'PGRST116') {
                console.log("💡 Suggestion: The email doesn't exist in the 'profiles' table.");
            }
        } else {
            console.log("✅ Match Found!");
            console.log("👤 Result:", profile);
        }

        process.exit(0);
    } catch (err) {
        console.error("💥 Unexpected Error:", err.message);
        process.exit(1);
    }
};

const emailToTest = "shashank.asthana05@gmail.com";
checkSpecificEmail(emailToTest);
