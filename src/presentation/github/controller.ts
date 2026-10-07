import type { Request, Response } from "express";

export class GithubController {
  constructor() {}

  webhookHandler = (req: Request, res: Response) => {
    console.log("Endpoint llamado");
    res.json("Hecho");
  };
}
