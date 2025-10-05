// middleware/authMiddleware.js
import { supabase } from '../config/supabaseClient.js';

export const verifyRole = (requiredRole) => {
    return async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);

        if (userError || !user) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
        }

        // Query the user_roles table to get the user's role
        // Check for system-wide super_admin first
        const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('roles(name)')
            .eq('user_id', user.id)
            .is('masjid_id', null) // Check for super_admin with NULL masjid_id
            .single();

        let userRole = roleData?.roles?.name;

        // If not a super_admin, we would check their role for a specific masjid
        // (This logic can be expanded as needed for masjid-specific roles)

        if (userRole !== requiredRole) {
            return res.status(403).json({ message: `Forbidden: Requires ${requiredRole} role.` });
        }

        req.user = user;
        next();
    };
};