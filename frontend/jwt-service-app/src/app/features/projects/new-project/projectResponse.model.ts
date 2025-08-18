export class ProjectResponse {
  secret: string;
  projectName: string;
  description: string;
  projectKey: string;
  user_schema: object;

  constructor(secret: string, projectName: string, description: string, projectKey: string, user_schema: object) {
    this.secret = secret;
    this.projectName = projectName;
    this.description = description;
    this.projectKey = projectKey;
    this.user_schema = user_schema;
  }

}
