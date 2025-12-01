import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
    let token;

    // Verificar si el header Authorization empieza con "Bearer"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Obtener el token (quitar la palabra 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // Decodificar el token usando la clave secreta
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Buscar el usuario en la DB y adjuntarlo a la request (sin el password)
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Dejar pasar a la siguiente función (el controlador)
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'No autorizado, token fallido' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'No autorizado, no hay token' });
    }
};

export { protect };