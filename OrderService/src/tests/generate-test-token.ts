import jwt from 'jsonwebtoken';

// Generate JWT token for tests
export const generateTestToken = (id: string, role: 'user' | 'admin' = 'user') => {
  return jwt.sign(
    { id, email: 'test@example.com', phone: 972521111111, role, name: 'test' },
    process.env.SESSION_SECRET || 'supersecret',
    { expiresIn: '1h' }
  );
};

// console.log('Admin Token:');
// console.log(generateTestToken('12345', 'admin'));
// console.log('\nUser Token:');
// console.log(generateTestToken('98765', 'user'));
