// lib/auth/twoFactor.ts
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export class TwoFactorAuth {
  static async setupTwoFactor(userId: string) {
    // Get user's email for the authenticator label
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        email: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const secret = speakeasy.generateSecret({
      name: encodeURIComponent(`YourApp:${user.email}`), // Replace YourApp with your app name
      length: 20
    });

    // Store the secret in the database
    await db.update(users)
      .set({ 
        twoFactorSecret: secret.base32,
        twoFactorEnabled: false // Will be enabled after verification
      })
      .where(eq(users.id, userId));

    return {
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url
    };
  }

  static async verifyAndEnable(userId: string, token: string) {
    console.log('came here ')
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        twoFactorSecret: true
      }
    });

    console.log('user is  in 2fa ',user)

    if (!user?.twoFactorSecret) {
      throw new Error('2FA not set up');
    }



    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 1 // Allow 30 seconds clock skew
    });

    if (verified) {
      await db.update(users)
        .set({ twoFactorEnabled: true })
        .where(eq(users.id, userId));
    }
    console.log('verified and updated ')

    return verified;
  }

  static async verify(userId: string, token: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        twoFactorSecret: true,
        twoFactorEnabled: true
      }
    });

    if (!user?.twoFactorSecret || !user.twoFactorEnabled) {
      return true; // Skip 2FA if not enabled
    }

    return speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 1 // Allow 30 seconds clock skew
    });
  }

  static async disable(userId: string) {
    await db.update(users)
      .set({ 
        twoFactorEnabled: false,
        twoFactorSecret: null
      })
      .where(eq(users.id, userId));
  }
}