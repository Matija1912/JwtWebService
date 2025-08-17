import {Component, OnInit} from '@angular/core';
import {ProjectsService} from '../../core/services/projects/projects.service';
import {Project} from './project.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {

  projects: Project[] = [];

  constructor(private projectsService: ProjectsService) {}

  ngOnInit() {
    this.projectsService.getUsersProjects().subscribe({
      next: response => {
        this.projects = response.projects;
      },
      error: error => {
        console.log(error);
      }
    });
  }

}
