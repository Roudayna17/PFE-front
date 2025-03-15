import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})

export class ListUserComponent implements OnInit {
  users: any[] = []; // Array to store locataires
  selectAll: boolean = false; // Flag to track "select all" checkbox state
  isButtonDisabled: boolean = true; // Disable buttons initially
  count: number=0;
  close: boolean=false;

  constructor(private userService: UserService , private router:Router) { }

  ngOnInit(): void {
    this.getListUser();
  }


  getListUser() {
    this.userService.listUser().subscribe(data => {
      this.users = data[0];  // Assuming the users are in the first array
      console.log("this.users.",this.users)
      this.count=data[1]
    });
  }

  // Method to handle checkbox changes and update button status
  onCheckboxChange() {
    this.isButtonDisabled = this.selectedUsers.length !== 1; // Button enabled only when one user is selected
    console.log(this.isButtonDisabled)
    console.log(this.selectedUsers)
    console.log('selectedUsers[0].id',this.selectedUsers[0].id)
  }

  // Helper method to get the number of selected users
  get selectedUsers() {
    return this.users.filter(user=> user.selected); // Filters users that are selected
  }

  // Method to toggle the selection of all users
  toggleSelectAll() {
    this.users.forEach(user => user.selected = this.selectAll);
    this.onCheckboxChange();  // Update button state after toggling "select all"
  }

  // Method to check if all users are selected, used to update "select all" checkbox
  checkIfAllSelected() {
    this.selectAll = this.users.every(user => user.selected);
  }

  // Method to update "select all" checkbox when a single user is selected or deselected
  updateSelectAll() {
    this.checkIfAllSelected();
  }
  actionClose(){
    this.close=false
  }
  actionSave(){
    this.close=false
    this.getListUser()
  }
  actionOpen(){
    this.close=true
    console.log("close", this.close)
   
  }
  editRouter(){
    let id=this.selectedUsers[0].id
    this.router.navigateByUrl("/user/update-user/"+String(id))
  }

  
}
