import dotenv from "dotenv";
import { realmAdmin } from "./utils/supabaseClient.js";
import realmSupabase from "./utils/supabaseClient.js";

dotenv.config();

const testSupabaseConnection = async () => {
    console.log("🕒 Initiating Supabase Connection Test...");
    console.log(`📡 Target URL: ${process.env.REALM_SUPABASE_URL}`);

    try {
        // 1. Test Public Client (Anon Key)
        console.log("\n--- Testing Public Client (Anon Key) ---");
        const { data: publicData, error: publicError, count: publicCount } = await realmSupabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .limit(1);

        if (publicError) {
            console.error("❌ Public Client Failed:", publicError.message);
        } else {
            console.log("✅ Public Client Success!");
            console.log(`📊 Found ${publicCount} total profiles visible to public.`);
        }

        // 2. Test Admin Client (Service Role Key)
        console.log("\n--- Testing Admin Client (Service Token) ---");
        const { data: adminData, error: adminError } = await realmAdmin
            .from('profiles')
            .select('id, email, username')
            .limit(1);

        if (adminError) {
            console.error("❌ Admin Client Failed:", adminError.message);
        } else {
            console.log("✅ Admin Client Success!");
            console.log("👤 Sample Profile Data (Sanitized):", {
                id: adminData[0]?.id ? "ID Present" : "No Data",
                username: adminData[0]?.username || "N/A"
            });
        }

        console.log("\n🏁 Test Sequence Complete.");
        process.exit(0);
    } catch (error) {
        console.error("\n💥 Unexpected Protocol Failure:", error.message);
        process.exit(1);
    }
};

testSupabaseConnection();
