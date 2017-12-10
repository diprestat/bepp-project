import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-sprints-list',
  templateUrl: './sprints-list.component.html',
  styleUrls: ['./sprints-list.component.css']
})
export class SprintsListComponent implements OnInit {

   private showAddSprint: boolean;
   private showModifySprint: boolean;
   private addSprintForm: FormGroup;
   private addSprintSubmitted: boolean;

  constructor() {

      this.showAddSprint = false;
      this.showModifySprint = false;

      this.addSprintForm = new FormGroup ({
          sprint_start: new FormControl(''),
          sprint_end: new FormControl('')
      });
  }

  ngOnInit() {

  }

  private submitAddSprintForm() {
       this.toggleAddSprint();
  }

  private toggleAddSprint() {
        this.showAddSprint = !this.showAddSprint;
  }

  private toggleModifySprint() {
        this.showModifySprint = !this.showModifySprint;
  }

  private ModifySprint() {
       this.toggleModifySprint();
  }

  private cancelModifySprint() {
       this.toggleModifySprint();
  }
}
