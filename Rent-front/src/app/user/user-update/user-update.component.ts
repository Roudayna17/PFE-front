import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css'
})
export class UserUpdateComponent implements OnInit {
currentStep: number = 1;
  maxSteps: number = 3;
  isFinalStep: boolean = false;

  userForm: FormGroup;
  msg: string=""
  show: boolean=false;
  showError: boolean=false;
  id!: number;

  constructor(private fb: FormBuilder,private userService:UserService , private router:Router, private activeRouter:ActivatedRoute) {
    this.userForm = this.fb.group({
      personalInfo: this.fb.group({
        firstname: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        role: ['', Validators.required]
    
      }),
      emailcontact:this.fb.group({
        email: ['', [Validators.required, Validators.email]],
     
      })   ,
        address: this.fb.group({
          ville: ['', Validators.required],
        region: ['', Validators.required],
        codePostal: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]], // 5-digit postal code validation
        telephone: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{8,11}$')]]
      }),
   
    });
    
    
  }
  ngOnInit(): void {
    this.activeRouter.params.subscribe(async (params: Params) => {
      this.id = +params['id'];
       await this.getUserById(this.id)

    });
  }
 getUserById(id:number){
  this.userService.getUserById(id).subscribe(data=>{
    console.log("user",data)

  this.userForm.patchValue({
    personalInfo: {
      firstname: data.firstName,
      lastName: data.lastName,
      role: data.role
    },
    emailcontact: {
      email: data.email,
    },
    address: {
      ville: data.city,
      region: data.state,
      codePostal: data.codePostal,
      telephone: data.telephone
    }
  });
  })
 
  
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
    
        const personalInfo = formValues.personalInfo;
        const emailcontact = formValues.emailcontact;
        const address = formValues.address;
    
        console.log("Personal Info:", personalInfo);
        console.log("Email Contact:", emailcontact);
        console.log("Address Info:", address);
    
       user.firstName = this.userForm.get('personalInfo.firstname')?.value;
         user.lastName = this.userForm.get('personalInfo.lastName')?.value;
       user.role = this.userForm.get('personalInfo.role')?.value;
        user.email = this.userForm.get('emailcontact.email')?.value;
        user.city = this.userForm.get('address.ville')?.value;
        user.state = this.userForm.get('address.region')?.value;
        user.codePostal = this.userForm.get('address.codePostal')?.value;
        user.telephone = this.userForm.get('address.telephone')?.value;
    
    
console.log("user",user)
    
    this.userService.updateUser(this.id,user).subscribe(data=>{
      console.log("data",data)
      this.show=true
      this.msg="Utilisateur modifiée avec succès !"
     
  
      
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
  