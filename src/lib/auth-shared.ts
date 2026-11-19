import type { OAuthProvider } from "@/lib/oauth-shared";

export type AuthProvider = "password" | OAuthProvider;

export type SessionUser = {
  id: string;
  account: string;
  name: string;
  provider: AuthProvider;
  avatar?: string | null;
};
