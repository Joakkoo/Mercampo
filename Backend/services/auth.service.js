const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jwtSecret = process.env.JWT_SECRET
const jwtExpiration = '2h';

// Función para registrar un nuevo usuario
exports.registerUser = async ({ email, password, role }) => {
    const existingUser = await prisma.user.findUnique({where: { email }});
    if (existingUser) throw new Error('El correo electrónico ya está en uso');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash: hashedPassword,
            role: role || 'usuario', // Default rol
        },
    });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: jwtExpiration });

    return { user: { id: user.id, email: user.email, role: user.role }, token };
}

// Función para iniciar sesión
exports.loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Credenciales inválidas');

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) throw new Error('Credenciales inválidas');

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: jwtExpiration });

    return { user: { id: user.id, email: user.email, role: user.role }, token };
}

// Función para cerrar sesión
exports.logoutUser = async (userId) => {
    await prisma.jwtToken.deleteMany({
        where: { userId }
    });
    return { message: "Sesión cerrada correctamente "};
};
