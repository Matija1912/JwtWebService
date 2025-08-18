import { Component } from '@angular/core';
import {ProjectsService} from '../../../core/services/projects/projects.service';
import {ProjectResponse} from './projectResponse.model';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.css'
})
export class NewProjectComponent {

  goToDashboardLink: boolean = false;

  projectCreated: boolean = false;

  projectResponse: ProjectResponse | null = null;

  projectData: {name: string; description: string, customFields: {name: string, type: string, required: boolean}[]} = {name:'', description:'', customFields: []};

  newField: {name: string, type: string, required: boolean} = {name: '', type: '', required: false};

  constructor(private projectsService: ProjectsService) {}

  addField = () => {
    if(this.newField.name !== '' && this.newField.type !== ''){
      this.projectData.customFields.push({...this.newField});
      this.newField = {name: '', type: '', required: false};
    }
  }

  removeField = (index: number) => {
    this.projectData.customFields.splice(index, 1);
  }

  finish = () => {
    this.projectsService.createNewProject(this.projectData).subscribe({
      next: (res) => {
        this.projectData = {name:'', description:'', customFields: []};
        this.newField = {name: '', type: '', required: false};

        this.projectCreated = true;

        this.projectResponse = new ProjectResponse(res.secret, res.project.name, res.project.description, res.project.project_key, res.project.user_schema);

      },error: err => {
        console.log(err);
      }
    });
    this.projectData = {name:'', description:'', customFields: []};
    this.newField = {name: '', type: '', required: false};
  }

  copySecret(secret: string) {
    navigator.clipboard.writeText(secret).then(() => {
      alert('Secret copied to clipboard!');
    });
    this.goToDashboardLink = true;
  }

}
