import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  projectsApiUrl: string = environment.API_URL + '/projects';

  constructor(private http: HttpClient) {}

  getUsersProjects = () => {
    return this.http.get<{status: string, projects: [{id: number, name: string, description: string, account_id: number, project_key: string, created_at: string}]}>(this.projectsApiUrl + '/getUsersProjects');
  }

  createNewProject = (projectData: {name: string; description: string, customFields: {name: string, type: string, required: boolean}[]}) => {
    return this.http.post(this.projectsApiUrl + '/createNewProject', projectData);
  }

}
