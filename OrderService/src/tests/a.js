import jwt from 'jsonwebtoken'
export const generateTestToken = (id, role = 'user') => {
  return jwt.sign(
    { id, email: 'test@example.com', phone: '1234567890', role },
    process.env.SESSION_SECRET || 'supersecret',
    { expiresIn: '1h' }
  );
};


console.log(generateTestToken('12344', 'admin'))

console.log(generateTestToken('12344', 'user'))