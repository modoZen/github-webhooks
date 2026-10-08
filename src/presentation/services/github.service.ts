import { GithubIssuePayload } from "../../interfaces/github-issue.interface";
import { GithubStarPayload } from "../../interfaces/github-start.interface";

export class GithubService {
  constructor() {}

  onStar(payload: GithubStarPayload) {
    const { action, repository, sender } = payload;

    return `User ${sender.login} ${action} star on ${repository.full_name}`;
  }

  onIssue(payload: GithubIssuePayload) {
    const { action, issue, sender } = payload;

    if (action === "opened") {
      return `An issue was opened with this title: ${issue.title}`;
    }

    if (action === "closed") {
      return `An issue was closed by ${sender.login}`;
    }

    if (action === "reopened") {
      return `An issue was reopened by ${sender.login}`;
    }

    return `Unhandled action for the issue event: ${action}`;
  }
}
