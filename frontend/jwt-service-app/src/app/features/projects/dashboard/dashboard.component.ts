import {Component, OnInit} from '@angular/core';
import {ProjectsService} from '../../../core/services/projects/projects.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../core/services/auth/auth.service';
import {InfoType} from '../../../shared/components/info-block/infoData.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  deletionResultData: {
    infoType: InfoType | null,
    message: string | null
  } = {
    infoType: null,
    message: null,
  }


  deleteProjectConfirmation: boolean = false;
  deleteConfirmationData: {password: string, secretKey: string} = {password: '', secretKey: ''};

  regeneratedSecret: string | null = null;

  registerUserRequest: {
    projectKey: string;
    secretKey: string;
    userData: { [key: string]: any };
  } = {
    projectKey: '',
    secretKey: 'YOUR_SECRET_KEY',
    userData: {}
  }

  registerUserResponse : {
    status: string,
    message: string,
    user: { [key: string]: any, custom_fields: {[key: string]: any} }
  } = {
    status: "OK",
    message: "User created",
    user: {
      id: 1,
      email: 'random@email.com',
      custom_fields: {}
    }
  }

  loginUserRequest: {
    projectKey: string;
    secretKey: string;
    loginData: { [key: string]: any };
  } = {
    projectKey: '',
    secretKey: 'YOUR_SECRET_KEY',
    loginData: {
      email: 'random@email.com',
      password: 'randompassword'
    }
  }

  loginUserResponse : {
    status: string,
    message: string,
    user: { [key: string]: any, custom_fields: {[key: string]: any} },
    token: string
  } = {
    status: "OK",
    message: "Login successful",
    user: {
      id: 1,
      email: 'random@email.com',
      custom_fields: {}
    },
    token: 'your.jwt.token'
  }

  verifyUserRequest: {
    projectKey: string;
    secretKey: string;
    token: string
  } = {
    projectKey: '',
    secretKey: 'YOUR_SECRET_KEY',
    token: 'your.jwt.token'
  }


  verifyUserResponse: {
    status: string,
    user: { [key: string]: any, custom_fields: {[key: string]: any} },
    iat: number,
    exp: number
  } = {
    status: "OK",
    user: {
      id: 1,
      email: 'random@email.com',
      custom_fields: {}
    },
    iat: 1755619863,
    exp:1755627063
  }

  project: {id: number, project_key: string, name: string, description: string, user_schema: object} | null = null;
  projectKey: string = '';

  constructor(private projectService: ProjectsService, private route: ActivatedRoute, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.projectKey = this.route.snapshot.params['project_key'];
    this.registerUserRequest.projectKey = this.projectKey;
    this.loginUserRequest.projectKey = this.projectKey;
    this.verifyUserRequest.projectKey = this.projectKey;
    this.projectService.getProject(this.projectKey).subscribe({
      next: res => {
        this.project = {
          id: res.project.id,
          project_key: res.project.project_key,
          name: res.project.name,
          description: res.project.description,
          user_schema: res.project.user_schema
        }
        const schema: { [key: string]: any } = res.project.user_schema;
        for (let key in schema) {
          const type = schema[key].type;
          this.registerUserRequest.userData[key] = type + ', required: ' + schema[key].required;

          if(key !== 'email' && key !== 'password'){
            if(type === 'string'){
              this.registerUserResponse.user.custom_fields[key] = 'string';
              this.loginUserResponse.user.custom_fields[key] = 'string';
              this.verifyUserResponse.user.custom_fields[key] = 'string';
            }
            if(type === 'number'){
              this.registerUserResponse.user.custom_fields[key] = 2;
              this.loginUserResponse.user.custom_fields[key] = 2;
              this.verifyUserResponse.user.custom_fields[key] = 2;
            }
            if(type === 'date'){
              this.registerUserResponse.user.custom_fields[key] = '01.01.1999.';
              this.loginUserResponse.user.custom_fields[key] = '01.01.1999.';
              this.verifyUserResponse.user.custom_fields[key] = '01.01.1999.';
            }
            if(type === 'boolean'){
              this.registerUserResponse.user.custom_fields[key] = true;
              this.loginUserResponse.user.custom_fields[key] = true;
              this.verifyUserResponse.user.custom_fields[key] = true;
            }
          }

        }
      },
      error: error => {
        console.log(error);
      }
    })
  }

  copyNewSecret(secret: string) {
    navigator.clipboard.writeText(secret).then(() => {
      alert('Secret copied to clipboard!');
    });
  }

  copyProjectKey() {
    navigator.clipboard.writeText(this.projectKey).then(() => {
      alert('Project key copied to clipboard!');
    });
  }

  regenerateSecret(projectKey: string){
    this.projectService.regenerateSecret(projectKey).subscribe({
      next: res => {
        this.regeneratedSecret = res.secret
      }, error: error => {
        console.log(error);
      }
    })
  }

  cancelDelete() {
    this.deleteProjectConfirmation = false;
    this.deleteConfirmationData = {password: '', secretKey: ''};
  }

  deleteProject(): void {
    this.deleteProjectConfirmation = true;
  }

  deleteProjectConfirm(deleteConfirmationData: {password: string, secretKey: string}): void {

    const user = this.authService.getCurrentUser();
    if (user){
      this.projectService.deleteProject(this.projectKey, deleteConfirmationData.password, deleteConfirmationData.secretKey, {userId: user.id, email: user.email}).subscribe({
        next: res => {
          alert(res.message);
          this.router.navigate(['/projects']);
        }, error: error => {
          this.deletionResultData = {
            infoType: 'danger',
            message: error.error.message
          }
        }
      })
    } else {
      console.log('no user found in session.');
    }
  }

}
