import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SkierServiceService } from '../skier-service.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-skier',
  standalone: true,
  imports: [BrowserAnimationsModule,CommonModule, ReactiveFormsModule],
  templateUrl: './skier.component.html',
  styleUrls: ['./skier.component.css'],
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0, transform: 'translateY(10px)' })),
      ]),
    ]),
  ],
})
export class SkierComponent implements OnInit {
  skierForm: FormGroup;
  skiers: any[] = [];
  skierById: any;
  skiersBySubscription: any[] = [];
  subscriptionTypes = ['ANNUAL', 'SEMI_ANNUAL', 'MONTHLY'];
  activeTab: 'add' | 'list' | 'search' = 'add';
  loading = false;

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

  ngOnInit() {
    this.getAllSkiers();
  }

  addSkier() {
    if (this.skierForm.valid) {
      this.loading = true;
      const skierData = { ...this.skierForm.value };
      skierData.dateOfBirth = this.formatDate(skierData.dateOfBirth);
      skierData.subscription.startDate = this.formatDate(skierData.subscription.startDate);
      skierData.subscription.endDate = this.formatDate(skierData.subscription.endDate);

      this.skierService.addSkier(skierData).subscribe(
        response => {
          console.log('Skier added successfully', response);
          this.skierForm.reset();
          this.getAllSkiers();
          this.activeTab = 'list';
          this.loading = false;
        },
        error => {
          console.error('Error adding skier', error);
          this.loading = false;
        }
      );
    }
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  getAllSkiers() {
    this.loading = true;
    this.skierService.getAllSkiers().subscribe(
      skiers => {
        this.skiers = skiers;
        this.loading = false;
      },
      error => {
        console.error('Error fetching skiers', error);
        this.loading = false;
      }
    );
  }

  getSkierById(id: string) {
    const skierId = parseInt(id, 10);
    if (isNaN(skierId)) {
      console.error('Invalid skier ID');
      return;
    }
    this.loading = true;
    this.skierService.getSkierById(skierId).subscribe(
      skier => {
        this.skierById = skier;
        this.loading = false;
      },
      error => {
        console.error('Error fetching skier', error);
        this.loading = false;
      }
    );
  }

  getSkiersBySubscription(type: string) {
    this.loading = true;
    this.skierService.getSkiersBySubscription(type).subscribe(
      skiers => {
        this.skiersBySubscription = skiers;
        this.loading = false;
      },
      error => {
        console.error('Error fetching skiers by subscription', error);
        this.loading = false;
      }
    );
  }

  setActiveTab(tab: 'add' | 'list' | 'search') {
    this.activeTab = tab;
    if (tab === 'list') {
      this.getAllSkiers();
    }
  }
}