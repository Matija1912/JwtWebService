const jwt = require("../../jwt-native-implementation/dist/index.js");

const secret = 'test-secret';

describe('JWT Custom Implementation', () => {
  it('should sign and verify a valid token', () => {
    const payload = { userId: 123, role: 'admin' };
    const token = jwt.sign(payload, secret);
    const decoded = jwt.verify(token, secret);

    expect(decoded).toHaveProperty('userId', 123);
    expect(decoded).toHaveProperty('role', 'admin');
  });

  it('should reject token with an invalid signature', () => {
    const payload = { userId: 456 };
    const token = jwt.sign(payload, secret);
    
    const tamperedToken = token.replace(/.$/, 'x');

    expect(() => jwt.verify(tamperedToken, secret)).toThrow('Token has been tampered with.');
  });

  it('should reject a token with an expired `exp` claim', () => {
    const expiredPayload = { exp: Math.floor(Date.now() / 1000) - 10 };
    const token = jwt.sign(expiredPayload, secret);

    expect(() => jwt.verify(token, secret)).toThrow('Token has expired.');
  });

  it('should reject a malformed token', () => {
    const malformedToken = 'not.a.valid.token';

    expect(() => jwt.verify(malformedToken, secret)).toThrow('Invalid token format.');
  });

  it('should verify a token with additional claims', () => {
    const payload = { userId: 123, role: 'admin', iat: Math.floor(Date.now() / 1000) };
    const token = jwt.sign(payload, secret);
    const decoded = jwt.verify(token, secret);

    expect(decoded).toHaveProperty('iat');
  });

  it('should handle large payloads efficiently', () => {
    const largePayload = { data: 'x'.repeat(10000) };
    const token = jwt.sign(largePayload, secret);
    const decoded = jwt.verify(token, secret);

    expect(decoded).toHaveProperty('data');
  });
});