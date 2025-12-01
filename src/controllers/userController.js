import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Función auxiliar para generar JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // El usuario tendrá sesión iniciada por 30 días
    });
};

// @desc    Autenticar usuario y obtener token
// @route   POST /api/users/login
// @access  Public
export const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Verificar si el usuario existe y si la contraseña coincide
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id), // Devolvemos el token al frontend
        });
    } else {
        res.status(401).json({ message: 'Email o contraseña inválidos' });
    }
};

// @desc    Registrar un nuevo usuario (Usar solo una vez para crear al dueño)
// @route   POST /api/users
// @access  Public (Debería cerrarse después de crear el primer admin)
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const user = await User.create({
        name,
        email,
        password,
        isAdmin: true
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
};