import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export interface AuthRequest extends Request {
    adminId?: string;
}

export const authenticateAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { adminId: string };
        req.adminId = decoded.adminId;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
};
