import { NextFunction, Request, Response } from "express";
import { envs } from "../../config/envs";

export class GithubSha256Middleware {
  private static encoder = new TextEncoder();

  static async verifyGithubSignature(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const signature = req.header("x-hub-signature-256");
    const payload = req.rawBody?.toString("utf8");

    if (!signature || !payload) {
      res.status(401).json({ error: "Invalid signature" });
      return;
    }

    const isValid = await GithubSha256Middleware.verifySignature(
      envs.SECRET_TOKEN,
      signature,
      payload,
    );

    if (!isValid) {
      res.status(401).json({ error: "Invalid signature" });
      return;
    }

    next();
  }

  private static async verifySignature(
    secret: string,
    header: string,
    payload: string,
  ) {
    try {
      const [, sigHex = ""] = header.split("=");
      const algorithm = { name: "HMAC", hash: { name: "SHA-256" } };

      const keyBytes = GithubSha256Middleware.encoder.encode(secret);
      const key = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        algorithm,
        false,
        ["sign", "verify"],
      );

      const sigBytes = GithubSha256Middleware.hexToBytes(sigHex);
      const dataBytes = GithubSha256Middleware.encoder.encode(payload);

      return await crypto.subtle.verify(
        algorithm.name,
        key,
        sigBytes,
        dataBytes,
      );
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  private static hexToBytes(hex: string) {
    const bytes = new Uint8Array(hex.length / 2);

    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }

    return bytes;
  }
}
