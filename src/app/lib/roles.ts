import { UserRole } from "../models/User";

export function isSuperAdmin(role: string) {
  return role === UserRole.SUPER_ADMIN;
}

export function isOrgAdmin(role: string) {
  return role === UserRole.ORG_ADMIN;
}

export function isNormalUser(role: string) {
  return role === UserRole.USER;
}
