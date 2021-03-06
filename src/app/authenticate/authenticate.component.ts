import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthService, authResponseData } from './auth.service';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit {

  // There is a bug here: if you go to register then click on login, it doesnt change back to login. Possibly pass the mode as a parameter with the route
  // Note Code in the component should be primarily focused on updating the UI, therefore error handling has been done in the auth.service.ts

  userForm: FormGroup;
  loginMode: boolean;
  errorResponse: boolean;
  errorResponseMessage: string;
  isLoading: boolean;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

  // private closeSub: Subscription;


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.loginMode = true;
    this.errorResponse = false;
    
    this.userForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  onRegister(){
    this.loginMode = false;
    this.errorResponse = false;
    this.errorResponseMessage = null;
  }

  onSubmit(){
    console.log(this.userForm);
    console.log(this.userForm.value);

    let authObs: Observable<authResponseData> ;

    this.isLoading = true;
    if(this.loginMode){
      authObs = this.authService.signIn(this.userForm.value);
    }else{
      authObs = this.authService.signUp(this.userForm.value);
    }

    authObs.subscribe({
      next: (responseData) => {
        this.isLoading = false;
        console.log(responseData);
        this.router.navigate(['/recipes']);
      },
      error: (errorMessage) => {
        console.log("In observer error authenticate.component.ts")
        this.isLoading = false;
        this.errorResponse = true;
        this.errorResponseMessage = errorMessage;
        // this.showErrorAlert(errorMessage);
      }
    });

    this.userForm.reset();
  }

  // onHandleError(){
  //   this.errorResponse = false;
  //   this.errorResponseMessage = null;
  // }

  // private showErrorAlert(message: string){
  //   const hostVCF = this.alertHost.viewContainerRef;
  //   hostVCF.clear();
  //   const componentRef = hostVCF.createComponent(AlertComponent);

  //   componentRef.instance.message = message;
  //   this.closeSub = componentRef.instance.event.subscribe(() => {
  //     this.closeSub.unsubscribe();
  //     hostVCF.clear();
  //   })
  // }

  // ngOnDestroy(): void {
  //     if(this.closeSub){
  //       this.closeSub.unsubscribe();
  //     }
  // }

}
