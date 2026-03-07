import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService, ProfileService } from '../core/services';
import { Profile } from '../core/models';
import { trigger, transition, style, animate } from '@angular/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class Contact implements OnInit {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);
  private profileService = inject(ProfileService);

  contactForm: FormGroup;
  profile: Profile | null = null;
  loading = false;
  profileLoading = true;
  error: string | null = null;
  successMessage: string | null = null;
  contactInfo: any[] = [];
  particles = Array.from({ length: 20 }, (_, i) => ({
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 10
  }));

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileLoading = true;
    this.profileService.getProfile().subscribe({
      next: (response) => {
        this.profile = response.data;
        this.setupContactInfo();
        this.profileLoading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.profileLoading = false;
      }
    });
  }

  setupContactInfo(): void {
    if (!this.profile) return;
    
    this.contactInfo = [
      { icon: 'email', label: 'Email', value: this.profile.email, href: `mailto:${this.profile.email}`, external: false },
      { icon: 'phone', label: 'Phone', value: this.profile.phone, href: `tel:${this.profile.phone}`, external: false },
      { icon: 'code', label: 'GitHub', value: 'View Profile', href: this.profile.github, external: true },
      { icon: 'business', label: 'LinkedIn', value: 'Connect', href: this.profile.linkedin, external: true }
    ];
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    this.successMessage = null;

    this.contactService.submitContactForm(this.contactForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        this.contactForm.reset();
        
        // Show success popup with SweetAlert2
        Swal.fire({
          icon: 'success',
          title: 'Message Sent!',
          text: response.data.message || 'Thank you for reaching out! I will get back to you soon.',
          confirmButtonText: 'Great!',
          confirmButtonColor: '#3b82f6',
          background: '#1a1a2e',
          color: '#ffffff',
          customClass: {
            popup: 'swal-gradient-popup',
            confirmButton: 'swal-gradient-button'
          }
        });
      },
      error: (err) => {
        this.loading = false;
        let errorMessage = 'Failed to send message. Please try again later.';
        
        if (err.status === 429) {
          errorMessage = 'Too many requests. Please try again later.';
        } else if (err.status === 422) {
          errorMessage = 'Please check your input and try again.';
        }
        
        // Show error popup with SweetAlert2
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
          confirmButtonText: 'Try Again',
          confirmButtonColor: '#ef4444',
          background: '#1a1a2e',
          color: '#ffffff',
          customClass: {
            popup: 'swal-gradient-popup',
            confirmButton: 'swal-gradient-button'
          }
        });
        
        console.error('Error submitting contact form:', err);
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (!field || !field.touched) return '';

    if (field.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field.hasError('minlength')) {
      const minLength = field.getError('minlength').requiredLength;
      return `Minimum ${minLength} characters required`;
    }
    return '';
  }
}

