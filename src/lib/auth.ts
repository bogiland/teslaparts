const currentUserKey = "tesla-current-user";
const ADMIN_TOKEN = "tesla-admin-access-token-v1";

export type CurrentUser = {
  username: string;
  role: string;
  token: string;
};

export function getCurrentUser(): CurrentUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedValue = localStorage.getItem(currentUserKey);
  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as CurrentUser;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: CurrentUser): void {
  localStorage.setItem(currentUserKey, JSON.stringify(user));
}

export function clearCurrentUser(): void {
  localStorage.removeItem(currentUserKey);
}

export function isAdminAuthenticated(): boolean {
  const user = getCurrentUser();
  return user?.role === "Администратор" && user.token === ADMIN_TOKEN;
}

export function isUserAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
