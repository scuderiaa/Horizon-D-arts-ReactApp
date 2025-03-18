import User from '../models/user.models.js';

export const authenticateUser = async (req, res) => {
    const { username, password } = req.query;

    try {
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication failed - User not found" 
            });
        }

        // For simplicity we're comparing plain text passwords
        // In production, you should use bcrypt or another hashing library
        if (user.password !== password) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication failed - Invalid password" 
            });
        }

        // In production, you should generate and return a JWT token here
        res.status(200).json({ 
            success: true, 
            message: "Authentication successful",
            token: "sample-token-" + user._id // Replace with actual JWT in production
        });

    } catch (error) {
        console.error("Error in authentication:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Server Error" 
        });
    }
};
