import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SkierServiceService } from '../skier-service.service';

@Component({
  selector: 'app-skier',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="skier-management">
      <header class="header">
        <h1 class="title">Skier Management System</h1>
        <nav class="tab-navigation">
          <button [class.active]="activeTab === 'add'" (click)="setActiveTab('add')" aria-label="Add Skier">
            <i class="fas fa-user-plus"></i>
            <span>Add</span>
          </button>
          <button [class.active]="activeTab === 'list'" (click)="setActiveTab('list')" aria-label="List Skiers">
            <i class="fas fa-list"></i>
            <span>List</span>
          </button>
          <button [class.active]="activeTab === 'search'" (click)="setActiveTab('search')" aria-label="Search Skiers">
            <i class="fas fa-search"></i>
            <span>Search</span>
          </button>
        </nav>
      </header>

      <main class="content">
        <ng-container [ngSwitch]="activeTab">
          <section *ngSwitchCase="'add'" class="add-skier">
            <form [formGroup]="skierForm" (ngSubmit)="addSkier()" class="skier-form">
              <h2>Add New Skier</h2>
              <div class="form-grid">
                <div class="form-group">
                  <label for="numSkier">Skier Number</label>
                  <input id="numSkier" type="number" formControlName="numSkier">
                </div>
                <div class="form-group">
                  <label for="firstName">First Name</label>
                  <input id="firstName" type="text" formControlName="firstName">
                </div>
                <div class="form-group">
                  <label for="lastName">Last Name</label>
                  <input id="lastName" type="text" formControlName="lastName">
                </div>
                <div class="form-group">
                  <label for="dateOfBirth">Date of Birth</label>
                  <input id="dateOfBirth" type="date" formControlName="dateOfBirth">
                </div>
                <div class="form-group">
                  <label for="city">City</label>
                  <input id="city" type="text" formControlName="city">
                </div>
              </div>

              <div formGroupName="subscription" class="subscription-form">
                <h3>Subscription Details</h3>
                <div class="form-grid">
                  <div class="form-group">
                    <label for="numSub">Subscription Number</label>
                    <input id="numSub" type="number" formControlName="numSub">
                  </div>
                  <div class="form-group">
                    <label for="startDate">Start Date</label>
                    <input id="startDate" type="date" formControlName="startDate">
                  </div>
                  <div class="form-group">
                    <label for="endDate">End Date</label>
                    <input id="endDate" type="date" formControlName="endDate">
                  </div>
                  <div class="form-group">
                    <label for="price">Price</label>
                    <input id="price" type="number" formControlName="price">
                  </div>
                  <div class="form-group">
                    <label for="typeSub">Subscription Type</label>
                    <select id="typeSub" formControlName="typeSub">
                      <option value="">Select type</option>
                      <option *ngFor="let type of subscriptionTypes" [value]="type">{{type}}</option>
                    </select>
                  </div>
                </div>
              </div>

              <button type="submit" [disabled]="!skierForm.valid || loading" class="submit-btn">
                <i class="fas fa-save"></i> Add Skier
              </button>
            </form>
          </section>

          <section *ngSwitchCase="'list'" class="skiers-list">
            <h2>All Skiers</h2>
            <div class="card-grid">
              <div *ngFor="let skier of skiers" class="skier-card">
                <h3>{{skier.firstName}} {{skier.lastName}}</h3>
                <p><i class="fas fa-map-marker-alt"></i> {{skier.city}}</p>
                <p><i class="fas fa-calendar-alt"></i> {{skier.dateOfBirth | date}}</p>
                <p><i class="fas fa-skiing"></i> {{skier.subscription.typeSub}}</p>
              </div>
            </div>
          </section>

          <section *ngSwitchCase="'search'" class="search-section">
            <div class="search-by-id">
              <h2>Get Skier by ID</h2>
              <div class="search-form">
                <input #skierId type="number" placeholder="Enter Skier ID">
                <button (click)="getSkierById(skierId.value)" [disabled]="loading" class="search-btn">
                  <i class="fas fa-search"></i> Search
                </button>
              </div>
              <div *ngIf="skierById" class="search-result">
                <h3>{{skierById.firstName}} {{skierById.lastName}}</h3>
                <p><i class="fas fa-map-marker-alt"></i> {{skierById.city}}</p>
                <p><i class="fas fa-calendar-alt"></i> {{skierById.dateOfBirth | date}}</p>
                <p><i class="fas fa-skiing"></i> {{skierById.subscription.typeSub}}</p>
              </div>
            </div>

            <div class="search-by-subscription">
              <h2>Get Skiers by Subscription Type</h2>
              <div class="search-form">
                <select #subType>
                  <option value="">Select type</option>
                  <option *ngFor="let type of subscriptionTypes" [value]="type">{{type}}</option>
                </select>
                <button (click)="getSkiersBySubscription(subType.value)" [disabled]="loading" class="search-btn">
                  <i class="fas fa-search"></i> Search
                </button>
              </div>
              <div class="card-grid">
                <div *ngFor="let skier of skiersBySubscription" class="skier-card">
                  <h3>{{skier.firstName}} {{skier.lastName}}</h3>
                  <p><i class="fas fa-map-marker-alt"></i> {{skier.city}}</p>
                  <p><i class="fas fa-calendar-alt"></i> {{skier.dateOfBirth | date}}</p>
                  <p><i class="fas fa-skiing"></i> {{skier.subscription.typeSub}}</p>
                </div>
              </div>
            </div>
          </section>
        </ng-container>
      </main>

      <div *ngIf="loading" class="loading-overlay">
        <div class="loader"></div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

    :host {
      font-family: 'Poppins', sans-serif;
      display: block;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .title {
      font-size: 2.5rem;
      font-weight: 600;
      color: #3498db;
    }

    .tab-navigation {
      display: flex;
      gap: 10px;
    }

    .tab-navigation button {
      background-color: #ffffff;
      color: #2c3e50;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .tab-navigation button:hover,
    .tab-navigation button.active {
      background-color: #3498db;
      color: white;
    }

    .content {
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 30px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 5px;
      font-weight: 600;
    }

    .form-group input,
    .form-group select {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }

    .submit-btn,
    .search-btn {
      background-color: #2ecc71;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .submit-btn:hover,
    .search-btn:hover {
      background-color: #27ae60;
    }

    .submit-btn:disabled,
    .search-btn:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .skier-card {
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 20px;
      transition: all 0.3s ease;
    }

    .skier-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .skier-card h3 {
      margin-top: 0;
      color: #3498db;
    }

    .search-form {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .search-form input,
    .search-form select {
      flex-grow: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .loader {
      border: 5px solid #f3f3f3;
      border-top: 5px solid #3498db;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
      }

      .tab-navigation {
        margin-top: 20px;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SkierComponent {
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

      this.skierService.addSkier(skierData).subscribe({
        next: (response) => {
          console.log('Skier added successfully', response);
          this.skierForm.reset();
          this.getAllSkiers();
          this.activeTab = 'list';
          this.loading = false;
        },
        error: (error) => {
          console.error('Error adding skier', error);
          this.loading = false;
        }
      });
    }
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  getAllSkiers() {
    this.loading = true;
    this.skierService.getAllSkiers().subscribe({
      next: (skiers) => {
        this.skiers = skiers;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching skiers', error);
        this.loading = false;
      }
    });
  }

  getSkierById(id: string) {
    const skierId = parseInt(id, 10);
    if (isNaN(skierId)) {
      console.error('Invalid skier ID');
      return;
    }
    this.loading = true;
    this.skierService.getSkierById(skierId).subscribe({
      next: (skier) => {
        this.skierById = skier;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching skier', error);
        this.loading = false;
      }
    });
  }

  getSkiersBySubscription(type: string) {
    this.loading = true;
    this.skierService.getSkiersBySubscription(type).subscribe({
      next: (skiers) => {
        this.skiersBySubscription = skiers;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching skiers by subscription', error);
        this.loading = false;
      }
    });
  }

  setActiveTab(tab: 'add' | 'list' | 'search') {
    this.activeTab = tab;
    if (tab === 'list') {
      this.getAllSkiers();
    }
  }
}