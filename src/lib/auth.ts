import { jwtVerify, SignJWT } from 'jose';

interface SessionPayload {
  userId: string;
  role: string;
  email: string;
  name: string;
  avatar: string;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'learnnov-super-secret-key-1234567890'
);

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}
