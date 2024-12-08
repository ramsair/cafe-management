import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm:any = FormGroup;
  responseMessage:any;


  constructor(private formBuilder:FormBuilder, private router:Router, 
    private userService:UserService, private snackbarService:SnackbarService,
  private dialogRef:MatDialogRef<ChangePasswordComponent>, 
private ngxService:NgxUiLoaderService) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword:[null,[Validators.required]],
      newPassword:[null,[Validators.required]],
      confirmdPassword:[null,[Validators.required]],


    })


  }


  validateSubmit(){
    if(this.changePasswordForm.controls['newPassword'].value != this.changePasswordForm.controls['confirmdPassword'].value){
      return true;
    }else{
      return false;
    }
  }


  handleChangePasswordSubmit(){
    this.ngxService.start();
    var formData = this.changePasswordForm.value;
    var data = {
      oldPassword:formData.oldPassword,
      newPassword:formData.newPassword,
      confirmdPassword:formData.confirmdPassword
    }

    this.userService.changePassword(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.dialogRef.close();
      this.snackbarService.openSnackBar(this.responseMessage,"success")

    },(error)=>{
      console.log(error);
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage= GlobalConstants.genericError
      }

      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

}
