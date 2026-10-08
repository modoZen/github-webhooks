import type { Request, Response } from "express";
import { GithubService } from "../services/github.service";

export class GithubController {
  constructor(private readonly githubService = new GithubService()) {}

  webhookHandler = (req: Request, res: Response) => {
    const githubEvent = req.header("x-github-event") ?? "unknown";
    const payload = req.body;
    let message: string = "";

    switch (githubEvent) {
      case "star":
        message = this.githubService.onStar(payload);
        break;

      case "issues":
        message = this.githubService.onIssue(payload);
        break;

      default:
        message = `Unknown event: ${githubEvent}`;
    }

    console.log({ message });

    res.status(202).send("Accepted");
  };
}
