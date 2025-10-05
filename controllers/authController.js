import { supabase } from "../config/supabaseClient.js";

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        // Use Supabase's built-in signInWithPassword method
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        // If there's an error from Supabase (e.g., invalid credentials)
        if (error) {
            return res.status(401).json({ message: error.message });
        }

        // On success, Supabase returns a session object with a user and JWT
        res.status(200).json({ 
            message: "Login successful", 
            session: data.session 
        });

    } catch (err) {
        console.error("Server error during login:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};