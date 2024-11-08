import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SkierServiceService } from '../skier-service.service';

@Component({
  selector: 'app-skier',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './skier.component.html',
  styleUrls: ['./skier.component.css']
})
export class SkierComponent implements OnInit {
  skierForm: FormGroup;
  skiers: any[] = [];
  skierById: any;
  skiersBySubscription: any[] = [];
  subscriptionTypes = ['ANNUAL', 'SEMI_ANNUAL', 'MONTHLY'];

  constructor(
    private fb: FormBuilder,
    private skierService: SkierServiceService
  ) {
    this.skierForm = this.fb.group({
      numSkier: [1, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      subscription: this.fb.group({
        numSub: [1, Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        price: [0, Validators.required],
        typeSub: ['', Validators.required]
      })
    });
  }

  ngOnInit() {}

  addSkier() {
    const skierData = { ...this.skierForm.value };
  
    // Format dates
    skierData.dateOfBirth = this.formatDate(skierData.dateOfBirth);
    skierData.subscription.startDate = this.formatDate(skierData.subscription.startDate);
    skierData.subscription.endDate = this.formatDate(skierData.subscription.endDate);
  
    this.skierService.addSkier(skierData).subscribe(
      response => {
        console.log('Skier added successfully', response);
        this.skierForm.reset();
      },
      error => console.error('Error adding skier', error)
    );
  }
  
  formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Converts to YYYY-MM-DD
  }
  

  getAllSkiers() {
    this.skierService.getAllSkiers().subscribe(
      skiers => this.skiers = skiers,
      error => console.error('Error fetching skiers', error)
    );
  }

  getSkierById(id: string) {
    const skierId = parseInt(id, 10);
    if (isNaN(skierId)) {
      console.error('Invalid skier ID');
      return;
    }
    this.skierService.getSkierById(skierId).subscribe(
      skier => this.skierById = skier,
      error => console.error('Error fetching skier', error)
    );
  }

  getSkiersBySubscription(type: string) {
    this.skierService.getSkiersBySubscription(type).subscribe(
      skiers => this.skiersBySubscription = skiers,
      error => console.error('Error fetching skiers by subscription', error)
    );
  }
}
