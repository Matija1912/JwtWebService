import {Component, OnInit} from '@angular/core';
import {ProjectsService} from '../../../core/services/projects/projects.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  project: {id: number, project_key: string, name: string, description: string, user_schema: object} | null = null;
  projectKey: string = '';

  constructor(private projectService: ProjectsService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.projectKey = this.route.snapshot.params['project_key'];
    this.projectService.getProject(this.projectKey).subscribe({
      next: res => {
        this.project = {
          id: res.project.id,
          project_key: res.project.project_key,
          name: res.project.name,
          description: res.project.description,
          user_schema: res.project.user_schema
        }



      },
      error: error => {
        console.log(error);
      }
    })
  }

  copyProjectKey() {
    navigator.clipboard.writeText(this.projectKey).then(() => {
      alert('Project key copied to clipboard!');
    });
  }

  regenerateSecret(){
    console.log('Regenerate Secret');
  }

  deleteProject(project_key: string): void {
    console.log('Project deleted');
  }

}
