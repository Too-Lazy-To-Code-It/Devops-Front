import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

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

  constructor(private http: HttpClient, private fb: FormBuilder) {
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
    // If you need to perform any additional initialization, you can do it here
  }

  addSkier() {
    this.http.post('/skier/add', this.skierForm.value).subscribe(
      response => {
        console.log('Skier added successfully', response);
        this.skierForm.reset();
      },
      error => console.error('Error adding skier', error)
    );
  }

  getAllSkiers() {
    this.http.get<any[]>('/skier/all').subscribe(
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
    this.http.get(`/skier/get/${skierId}`).subscribe(
      skier => this.skierById = skier,
      error => console.error('Error fetching skier', error)
    );
  }

  getSkiersBySubscription(type: string) {
    this.http.get<any[]>(`/skier/getSkiersBySubscription?typeSubscription=${type}`).subscribe(
      skiers => this.skiersBySubscription = skiers,
      error => console.error('Error fetching skiers by subscription', error)
    );
  }
}