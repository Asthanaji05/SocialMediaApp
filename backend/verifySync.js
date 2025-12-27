import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import realmSupabase, { realmAdmin } from "./utils/supabaseClient.js";

dotenv.config();

const verifySyncStepByStep = async (userId) => {
    try {
        await connectDB();
        console.log(`\n--- 🔍 Starting Step-by-Step Sync Verification for User: ${userId} ---`);

        // Step 1: Find User in Mongo
        const user = await User.findById(userId);
        if (!user) {
            console.error("❌ Step 1: User not found in MongoDB.");
            process.exit(1);
        }
        console.log(`✅ Step 1: User found. Email: ${user.email}`);

        // Step 2: Query Supabase
        const userEmail = user.email.toLowerCase();
        console.log(`📡 Step 2: Querying Supabase for email: ${userEmail}`);

        const { data: profile, error: supabaseError } = await realmSupabase
            .from('profiles')
            .select('id, email, username')
            .ilike('email', userEmail)
            .single();

        if (supabaseError) {
            console.error("❌ Step 2: Supabase Fetch Error:", supabaseError.message);
            process.exit(1);
        }
        console.log(`✅ Step 2: Supabase Profile found. Realm ID: ${profile.id}, Username: ${profile.username}`);

        // Step 3: Update Mongo
        console.log("💾 Step 3: Attempting MongoDB update...");
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

        if (updatedUser && updatedUser.isRealmLinked && updatedUser.moscownpurId === profile.id) {
            console.log(`✅ Step 3: MongoDB update SUCCESS. current status:`, {
                isRealmLinked: updatedUser.isRealmLinked,
                moscownpurId: updatedUser.moscownpurId
            });
        } else {
            console.error("❌ Step 3: MongoDB update failed to reflect changes in returned object.");
        }

        // Step 4: Back-map to Supabase
        console.log("🔗 Step 4: Attempting Supabase back-map...");
        const { error: updateError } = await realmAdmin
            .from('profiles')
            .update({ maitrilok_id: userId })
            .eq('id', profile.id);

        if (updateError) {
            console.warn("⚠️ Step 4: Supabase update failed:", updateError.message);
        } else {
            console.log("✅ Step 4: Supabase update SUCCESS.");
        }

        // Double Check Step 5: Fetch from Mongo again
        const finalCheck = await User.findById(userId);
        console.log("\n--- 🏁 Final Database Verification ---");
        console.log("Final User Object in DB:", {
            email: finalCheck.email,
            isRealmLinked: finalCheck.isRealmLinked,
            moscownpurId: finalCheck.moscownpurId,
            v: finalCheck.__v
        });

        process.exit(0);
    } catch (err) {
        console.error("💥 Critical Failure:", err);
        process.exit(1);
    }
};

verifySyncStepByStep("67eea92312fafa665640bff1");
