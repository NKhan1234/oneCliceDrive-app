export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin";
}

export const mockUser: User = {
  id: "1",
  email: "admin@example.com",
  name: "Admin User",
  role: "admin",
};

let currentSession: User | null = null;

export function login(email: string, password: string): User | null {
  if (email === "admin@example.com" && password === "admin123") {
    currentSession = mockUser;
    return mockUser;
  }
  return null;
}

export function logout(): void {
  currentSession = null;
}

export function getCurrentUser(): User | null {
  return currentSession;
}

export function isAuthenticated(): boolean {
  return currentSession !== null;
}

export async function getServerSession(): Promise<User | null> {
  return currentSession;
}

export function generateToken(user: User): string {
  return `mock-token-for-${user.email}`;
}
