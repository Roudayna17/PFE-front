import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user';
import { AbstractControl, ValidationErrors } from '@angular/forms';

import { Router } from '@angular/router';
@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css'
})

export class UserADDComponent implements OnInit {
  currentStep: number = 1;
  maxSteps: number = 3;
  isFinalStep: boolean = false;

  userForm: FormGroup;
  msg: string=""
  show: boolean=false;
  showError: boolean=false;

  constructor(private fb: FormBuilder,private userService:UserService , private router:Router) {
    this.userForm = this.fb.group({
      personalInfo: this.fb.group({
        firstname: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        role: ['', Validators.required]
    
      }),
      emailcontact:this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  }, { validator: passwordMatchValidator }), 
        address: this.fb.group({
        ville: ['', Validators.required],
        region: ['', Validators.required],
        codePostal: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]], // 5-digit postal code validation
        telephone: ['', [Validators.required, Validators.pattern('^(\\+216)?[2-57-9][0-9]{7}$')]]
      }),
   
    });
    
    
  }
 

  ngOnInit(): void {
    // Initialization logic if necessary
  }

  goToPreviousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToNextStep(): void {
    if (this.currentStep < this.maxSteps) {
      this.currentStep++;
    }
  }
  Onsubmit() {
    let user= new User()
console.log('hello',this.userForm.value)
    
        const formValues = this.userForm.value;
    
        // Extracting values from each form group
        const personalInfo = formValues.personalInfo;
        const emailcontact = formValues.emailcontact;
        const address = formValues.address;
    
        console.log("Personal Info:", personalInfo);
        console.log("Email Contact:", emailcontact);
        console.log("Address Info:", address);
    
        // Example: Extracting individual values
       user.firstName = this.userForm.get('personalInfo.firstname')?.value;
         user.lastName = this.userForm.get('personalInfo.lastName')?.value;
       user.role = this.userForm.get('personalInfo.role')?.value;
        user.email = this.userForm.get('emailcontact.email')?.value;
         user.password = this.userForm.get('emailcontact.password')?.value;
        user.city = this.userForm.get('address.ville')?.value;
        user.state = this.userForm.get('address.region')?.value;
        user.codePostal = this.userForm.get('address.codePostal')?.value;
        user.telephone = this.userForm.get('address.telephone')?.value;
    
    
console.log("user",user)
    
    this.userService.create(user).subscribe(data=>{
      console.log("data",data)
      this.show=true
      this.msg="Admin ajouté avec succès !"
     
  
      
    },error=>{
      this.showError=true
      this.msg="Veuillez remplir tous les champs correctement"

    }
  )
  
}
back(){
  this.router.navigate(["/user"])
}

  finishStepper(): void {
    this.isFinalStep = true;
  }

  isStepSuccess(step: number): boolean {
    // Add your logic to determine if a step is successful
    return false;
  }

  isStepCompleted(step: number): boolean {
    // Add your logic to determine if a step is completed
    return false;
  }





}
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
}