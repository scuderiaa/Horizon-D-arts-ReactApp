import User from '../models/user.models.js';

export const createDefaultAdmin = async () => {
    try {
        // Check if admin already exists
        const adminExists = await User.findOne({ username: 'admin' });
        
        if (!adminExists) {
            const defaultAdmin = new User({
                username: 'admin',
                password: 'admin123', // In production, this should be hashed
                role: 'admin'
            });
            
            await defaultAdmin.save();
            console.log('Default admin account created successfully');
        }
    } catch (error) {
        console.error('Error creating default admin:', error.message);
    }
};