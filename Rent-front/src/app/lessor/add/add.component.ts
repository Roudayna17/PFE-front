import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,} from '@angular/forms';
import { Router } from '@angular/router';
import { Lessor } from '../lessor';
import { LessorService } from '../lessor.service';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {
  currentStep: number = 1;
    maxSteps: number = 3;
    isFinalStep: boolean = false;
  
    lessorForms: FormGroup;
    msg: string=""
    show: boolean=false;
    showError: boolean=false;
  
    constructor(private fb: FormBuilder,private lessorService:LessorService , private router:Router) {
      this.lessorForms = this.fb.group({
        personalInfo: this.fb.group({
          firstname: ['', [Validators.required, Validators.minLength(2)]],
          lastName: ['', [Validators.required, Validators.minLength(2)]],
          telephone: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{8,11}$')]]

      
        }),
        emailcontact:this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
        })   ,
          address: this.fb.group({
          ville: ['', Validators.required],
          region: ['', Validators.required],
          codePostal: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]], // 5-digit postal code validation
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
      let lessor= new Lessor()
  console.log('hello',this.lessorForms.value)
      
          const formValues = this.lessorForms.value;
      
          // Extracting values from each form group
          const personalInfo = formValues.personalInfo;
          const emailcontact = formValues.emailcontact;
          const address = formValues.address;
      
          console.log("Personal Info:", personalInfo);
          console.log("Email Contact:", emailcontact);
          console.log("Address Info:", address);
      
          // Example: Extracting individual values
        lessor.firstName = this.lessorForms.get('personalInfo.firstname')?.value;
        lessor.lastName = this.lessorForms.get('personalInfo.lastName')?.value;
        lessor.email = this.lessorForms.get('emailcontact.email')?.value;
        lessor.password = this.lessorForms.get('emailcontact.password')?.value;
        lessor.city = this.lessorForms.get('address.ville')?.value;
        lessor.state = this.lessorForms.get('address.region')?.value;
        lessor.codePostal = this.lessorForms.get('address.codePostal')?.value;
        lessor.telephone = this.lessorForms.get('address.telephone')?.value;
      
      
  console.log("lessor",lessor)
      
      this.lessorService.createLessor(lessor).subscribe(data=>{
        console.log("data",data)
        this.show=true
        this.msg="bailleur ajouté avec succès !"
       
    
        
      },error=>{
        this.showError=true
        this.msg="Veuillez remplir tous les champs correctement"
  
      }
    )
    
  }
  back(){
    this.router.navigate(["/lessor"])
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
