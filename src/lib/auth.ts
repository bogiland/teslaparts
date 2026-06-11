const currentUserKey = "tesla-current-user";

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
  return user?.role === "РђРґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂ" && Boolean(user.token);
}

export function isUserAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
