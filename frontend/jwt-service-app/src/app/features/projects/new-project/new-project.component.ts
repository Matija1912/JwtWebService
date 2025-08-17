import { Component } from '@angular/core';
import {ProjectsService} from '../../../core/services/projects/projects.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.css'
})
export class NewProjectComponent {

  projectData: {name: string; description: string, customFields: {name: string, type: string, required: boolean}[]} = {name:'', description:'', customFields: []};
  showProjectDataForm: boolean = true;

  newField: {name: string, type: string, required: boolean} = {name: '', type: '', required: false};

  constructor(private projectsService: ProjectsService) {}

  next = () => {
    this.showProjectDataForm = false;
  }

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
        console.log(res);
      },error: err => {
        console.log(err);
      }
    });
    this.projectData = {name:'', description:'', customFields: []};
    this.newField = {name: '', type: '', required: false};
  }

}
