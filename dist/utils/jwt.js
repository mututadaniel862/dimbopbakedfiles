"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15d';
const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role || 'user',
        // exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 1 day expiration
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 15)
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET);
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
// FzaYveYQlxmiCEtU
// mongodb+srv://mututadaniel54:FzaYveYQlxmiCEtU@cluster0.j1hrmmg.mongodb.net/
// mongodb+srv://mututadaniel54:<db_password>@cluster0.j1hrmmg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//# sourceMappingURL=jwt.js.map