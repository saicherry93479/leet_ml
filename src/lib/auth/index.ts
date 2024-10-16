import { eq } from "drizzle-orm";
import { db } from "../db";
import * as google from "./google";
import { sessions, type Session, type User } from "../db/schema";

export async function getSession(sessionId: string) {
   const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
    with: {
      user: true,
    },
  });


  if (!session || !session.user) return null;
  const provider = google;

  // if (session.expiresAt < new Date()) {
  //   await provider.revokeAccessToken(session.accessToken);
  //   await deleteSession(sessionId);
  //   return null;
  // }

  let updatedSession: (Session & { user: User }) | undefined;

  if (
    session.accessTokenExpiresAt &&
    session.accessTokenExpiresAt < new Date()
  ) {
    if (
      !session.refreshToken ||
      (session.refreshTokenExpiresAt &&
        session.refreshTokenExpiresAt < new Date())
    ) {
      await deleteSession(sessionId);
      return null;
    }

    const tokens: any = await provider.refreshAccessToken(session.refreshToken);
    updatedSession = {
      id: sessionId,
      userId: session.userId,
      deviceLabel: session.deviceLabel || "Unknown Device",
      user: session.user as User,
      accessToken: tokens.accessToken!,
      accessTokenExpiresAt: tokens.accessTokenExpiresAt!,
      refreshToken: tokens.refreshToken ?? null,
      refreshTokenExpiresAt: tokens.refreshTokenExpiresAt ?? null,
      expiresAt: session.expiresAt,
    };
  }

  // increment the session expiry by 7 days upto a maximum of 30 days
  const expiresAt = new Date(
    Math.min(
      session.expiresAt.getTime() + 1000 * 60 * 60 * 24 * 7, // 7 days
      Date.now() + 1000 * 60 * 60 * 24 * 30 // 30 days
    )
  );
  if (updatedSession) {
    await db
      .update(sessions)
      .set(updatedSession)
      .where(eq(sessions.id, sessionId));
    return updatedSession;
  }

  await db
    .update(sessions)
    .set({ expiresAt })
    .where(eq(sessions.id, sessionId));
  session.expiresAt = expiresAt;
  return session;
}

export async function deleteSession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}
