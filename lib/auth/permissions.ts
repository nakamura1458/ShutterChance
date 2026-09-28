export function isDeveloperUser(userId: string | null | undefined) {
  if (!userId) {
    return false;
  }

  return userId === process.env.SHUTTERCHANCE_ADMIN_USER_ID;
}