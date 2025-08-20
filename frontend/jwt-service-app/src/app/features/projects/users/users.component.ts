import {Component, OnInit} from '@angular/core';
import {ProjectsService} from '../../../core/services/projects/projects.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  searchEmail: string  = '';

  selectedUser: any = null;

  projectKey: string = '';
  users: {id: string, email: string, created_at: string, custom_fields: {}}[] = [];

  page: number = 1;
  pageSize: number = 50;
  totalCount: number = 0;

  constructor(private projectService: ProjectsService, private route: ActivatedRoute) {}

  toggleUserDetails(user: any){
    if (this.selectedUser && this.selectedUser.id === user.id) {
      this.selectedUser = null;
    } else {
      this.selectedUser = user;
    }

  }

  clear(){
    this.projectKey = this.route.snapshot.params['project_key'];
    this.loadUsers(this.page);
  }

  ngOnInit() {
    this.projectKey = this.route.snapshot.params['project_key'];
    this.loadUsers(this.page);
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadUsers(newPage);
  }

  loadUsers(page: number) {
    this.projectService.getProjectUsers(this.projectKey, page, this.pageSize).subscribe({
      next: res => {
        this.users = res.users;
        this.totalCount = res.totalCount;
        this.page = res.page;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  searchUser() {
    if (!this.searchEmail) return;
    this.projectService.getProjectUserByEmail(this.projectKey, this.searchEmail).subscribe({
      next: res => {
        if(res.users){
          this.users = [res.users];
          this.totalCount = 1;
          this.page = 1;
        }else{
          this.users = [];
          this.totalCount = 0;
        }
      },
      error: err => {
        this.users = [];
        this.totalCount = 0;
      }
    });
  }

}
