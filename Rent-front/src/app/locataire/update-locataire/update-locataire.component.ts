import { Component ,OnInit} from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Locataire } from '../locataire';
import { LocataireService } from '../locataire.service';

@Component({
  selector: 'app-update-locataire',
  templateUrl: './update-locataire.component.html',
  styleUrl: './update-locataire.component.css'
})
export class UpdateLocataireComponent {
  currentStep: number = 1;
  maxSteps: number = 3;
  isFinalStep: boolean = false;

  locataireForm: FormGroup;
  msg: string=""
  show: boolean=false;
  showError: boolean=false;
  id!: number;

  constructor(private fb: FormBuilder,private locataireService:LocataireService , private router:Router,private activeRouter:ActivatedRoute) {
    this.locataireForm = this.fb.group({
      personalInfo: this.fb.group({
        firstname: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        telephone: ['', Validators.pattern('^\\+?[0-9]{8,11}$')]

    
      }),
      emailcontact:this.fb.group({
        email: ['', [Validators.required, Validators.email]],
 
      })   ,
        address: this.fb.group({
        ville: ['', ],
        region: ['', ],
        codePostal: ['',  Validators.pattern('^[0-9]{4}$')], // 5-digit postal code validation
      }),
   
    });
    
    
  }
 

   ngOnInit(): void {
     this.activeRouter.params.subscribe(async (params: Params) => {
       this.id = +params['id'];
        await this.getLocataireById(this.id)
 
     });
   }
  getLocataireById(id:number){
   this.locataireService.getClientById(id).subscribe(data=>{
     console.log("user",data)

   this.locataireForm.patchValue({
     personalInfo: {
       firstname: data.firstName,
       lastName: data.lastName,
       telephone: data.telephone
     },
     emailcontact: {
       email: data.email,
     },
     address: {
       ville: data.city,
       region: data.state,
       codePostal: data.codePostal,
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
      locataire.city = this.locataireForm.get('address.ville')?.value;
      locataire.state = this.locataireForm.get('address.region')?.value;
      locataire.codePostal = this.locataireForm.get('address.codePostal')?.value;
      locataire.telephone = this.locataireForm.get('personalInfo.telephone')?.value;
    
    
console.log("locataire",locataire)
    
    this.locataireService.updateClient(this.id,locataire).subscribe(data=>{
      console.log("data",data)
      this.show=true
      this.msg="locataire  modifiée avec succès !"
     
  
      
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
