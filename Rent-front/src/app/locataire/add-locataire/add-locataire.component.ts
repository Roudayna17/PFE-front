import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,} from '@angular/forms';
import { Locataire } from '../locataire';
import { LocataireService } from '../locataire.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-locataire',
  templateUrl: './add-locataire.component.html',
  styleUrl: './add-locataire.component.css'
})
export class AddLocataireComponent {
  currentStep: number = 1;
    maxSteps: number = 3;
    isFinalStep: boolean = false;
  
    locataireForm: FormGroup;
    msg: string=""
    show: boolean=false;
    showError: boolean=false;
  
    constructor(private fb: FormBuilder,private locataireService:LocataireService , private router:Router) {
      this.locataireForm = this.fb.group({
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
      let locataire= new Locataire()
  console.log('hello',this.locataireForm.value)
      
          const formValues = this.locataireForm.value;
      
          // Extracting values from each form group
          const personalInfo = formValues.personalInfo;
          const emailcontact = formValues.emailcontact;
          const address = formValues.address;
      
          console.log("Personal Info:", personalInfo);
          console.log("Email Contact:", emailcontact);
          console.log("Address Info:", address);
      
          // Example: Extracting individual values
        locataire.firstName = this.locataireForm.get('personalInfo.firstname')?.value;
        locataire.lastName = this.locataireForm.get('personalInfo.lastName')?.value;
        locataire.email = this.locataireForm.get('emailcontact.email')?.value;
        locataire.password = this.locataireForm.get('emailcontact.password')?.value;
        locataire.city = this.locataireForm.get('address.ville')?.value;
        locataire.state = this.locataireForm.get('address.region')?.value;
        locataire.codePostal = this.locataireForm.get('address.codePostal')?.value;
        locataire.telephone = this.locataireForm.get('address.telephone')?.value;
      
      
  console.log("locataire",locataire)
      
      this.locataireService.create(locataire).subscribe(data=>{
        console.log("data",data)
        this.show=true
        this.msg="Locatire ajouté avec succès !"
       
    
        
      },error=>{
        this.showError=true
        this.msg="Veuillez remplir tous les champs correctement"
  
      }
    )
    
  }
  back(){
    this.router.navigate(["/locataire"])
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