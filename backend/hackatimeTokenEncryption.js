import crypto from "crypto";
import "dotenv/config";
import { Buffer } from "node:buffer";
import fs from "fs";
const key = Buffer.from(process.env.TOKEN_ENCRYPTION_KEY, "base64");

export function encryptToken(data) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const encrypted = Buffer.concat([
    cipher.update(data, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    tag.toString("base64"),
    encrypted.toString("base64"),
  ].join(".");
}

export function decryptToken(data) {
  const [iv, tag, encrypted] = data.split(".");

  if (!iv || !tag || encrypted === undefined) {
    console.error("Invalid encrypted token");
    return null;
  } else {
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(iv, "base64"),
    );

    decipher.setAuthTag(Buffer.from(tag, "base64"));

    return Buffer.concat([
      decipher.update(Buffer.from(encrypted, "base64")),
      decipher.final(),
    ]).toString("utf8");
  }
}
