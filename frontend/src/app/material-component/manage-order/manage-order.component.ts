import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {

displayedColumns:string[] =['name', 'category','price', 'quantity', 'total','edit'];
dataSource:any =[];
manageorderForm:any = FormGroup;
categorys:any =[];
products:any=[];
price:any;
totalAmount:number =0;
responseMessage:any;


constructor(private categoryService:CategoryService,
  private ngxService:NgxUiLoaderService,
  private snackbarService:SnackbarService,
  private dialogRef:MatDialog, public router:Router,
  private formBuilder:FormBuilder,
  private productService:ProductService,
  private billService:BillService
) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategoryes();
    this.manageorderForm = this.formBuilder.group({
      name:[null,[Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email:[null,[Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber:[null,[Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      paymentMethod:[null,[Validators.required]],
      product:[null,[Validators.required]],
      category:[null,[Validators.required]],
      quantity:[null,[Validators.required]],
      price:[null,[Validators.required]],
      total:[0,[Validators.required]],

})
  }

  getCategoryes(){
    this.categoryService.getCategories().subscribe((response:any)=>{
      this.ngxService.stop();
      this.categorys = response;
    },(error:any)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage =error.error?.message;

      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error)

    })

  }

  getproductsbycategory(value:any){
    this.productService.getProductsByCategort(value.id).subscribe((response:any)=>{
      this.products = response;
      this.manageorderForm.controls['price'].setValue(''),
      this.manageorderForm.controls['quantity'].setValue(''),
      this.manageorderForm.controls['total'].setValue(0)


    },(error:any)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage =error.error?.message;

      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error)

    })

  }



  getProductDetails(value:any){
    this.productService.getById(value.id).subscribe((response:any)=>{
      this.price = response.price;
      this.manageorderForm.controls['price'].setValue(response.price),
      this.manageorderForm.controls['quantity'].setValue('1'),
      this.manageorderForm.controls['total'].setValue(this.price*1);

    },(error:any)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage =error.error?.message;

      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error)

    })
  }

  setQuantity(value:any){
    var temp = this.manageorderForm.controls['quantity'].value;
    if(temp >0){
      // total = quantity*price
      this.manageorderForm.controls['total'].setValue(this.manageorderForm.controls['quantity'].value *this.manageorderForm.controls['price'].value );
    }

    else if(temp !=''){
      this.manageorderForm.controls['quantity'].setValue('1');
      this.manageorderForm.controls['total'].setValue(this.manageorderForm.controls['quantity'].value *this.manageorderForm.controls['price'].value );

    }
  }

  validateProductAdd(){
    if(this.manageorderForm.controls['total'].value === 0 || this.manageorderForm.controls['total'].value ===null || this.manageorderForm.controls['quantity'].value <=0){
      return true
    }else{
      return false
    }
  }


  validateSubmit(){
    if(this.totalAmount ===0 || this.manageorderForm.controls['name'].value ===null || 
      this.manageorderForm.controls['email'].value ===null ||
      this.manageorderForm.controls['contactNumber'].value ===null,
      this.manageorderForm.controls['paymentMethod'].value ===null ||
      !(this.manageorderForm.controls['contactNumber'].valid ) ||
      !(this.manageorderForm.controls['email'].valid ))
      {
        return true

    }else{
      return false
    }
  }


   add(){
    var formData = this.manageorderForm.value;
    var productName = this.dataSource.find((e:{id:number})=>
      e.id == formData.product.id
    )
    // console.log("formData::",formData)
    if(productName ===undefined){
      this.totalAmount = this.totalAmount+ formData.total;
      this.dataSource.push({
        id:formData.product.id,
        name:formData.product.name,
        category:formData.category.name,
        quantity:formData.quantity,
        price:formData.price,
        total:formData.total
      });

      this.dataSource =[...this.dataSource];
      this.snackbarService.openSnackBar(GlobalConstants.productAdded , 'success');


    }
    else{
      this.snackbarService.openSnackBar(GlobalConstants.productExistError, GlobalConstants.error);
    }
   }

   handleDeleteAction(value:any, element:any){
    this.totalAmount = this.totalAmount -element.total;
    this.dataSource.splice(value,1);
    this.dataSource =[...this.dataSource];


   }


   submitAction(){
    this.ngxService.start();
    var formData = this.manageorderForm.value;
    // console.log("this.dataSource::",this.dataSource)
    var data ={
      name:formData.name,
      email:formData.email,
      contactNumber:formData.contactNumber,
      paymentMethod:formData.paymentMethod,
      totalAmount:this.totalAmount,
    
      productDetails:JSON.stringify(this.dataSource)
    }
    this.billService.generateReport(data).subscribe((response:any)=>{
      this.downloadFile(response?.uuid);
      this.manageorderForm.reset();
      this.dataSource =[];
      this.totalAmount =0;
    },(error:any)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage =error.error?.message;

      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error)

    })
   }



   downloadFile(fileName:any){
    var data ={
      uuid:fileName
    }
    this.billService.getPdf(data).subscribe((response:any)=>{
      saveAs(response, fileName+'.pdf');
      this.ngxService.stop();
    })
    

   }


}
