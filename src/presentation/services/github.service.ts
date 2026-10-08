import { GithubStarPayload } from "../../interfaces/github-start.interface";

export class GithubService {
  constructor() {}

  onStar(payload: GithubStarPayload) {
    const { action, repository, sender } = payload;

    return `User ${sender.login} ${action} star on ${repository.full_name}`;
  }
}
