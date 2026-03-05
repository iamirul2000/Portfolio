import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ContactService } from '../../core/services/contact.service';
import { ContactMessage } from '../../core/models/contact-message.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-message-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule
  ],
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.scss']
})
export class MessageDetailComponent implements OnInit {
  private contactService = inject(ContactService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  message: ContactMessage | null = null;
  loading = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMessage(+id);
    }
  }

  loadMessage(id: number): void {
    this.loading = true;
    this.contactService.getMessage(id).subscribe({
      next: (response) => {
        this.message = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load message', error);
        this.loading = false;
        this.router.navigate(['/admin/messages']);
      }
    });
  }

  toggleStatus(): void {
    if (!this.message) return;

    const newStatus = this.message.status === 'new' ? 'read' : 'new';
    this.contactService.updateMessageStatus(this.message.id, newStatus).subscribe({
      next: (response) => {
        this.message = response.data;
      },
      error: (error) => {
        console.error('Failed to update status', error);
      }
    });
  }

  deleteMessage(): void {
    if (!this.message) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Message',
        message: `Are you sure you want to delete this message from "${this.message.name}"? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.message) {
        this.contactService.deleteMessage(this.message.id).subscribe({
          next: () => {
            this.router.navigate(['/admin/messages']);
          },
          error: (error) => {
            console.error('Failed to delete message', error);
          }
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/messages']);
  }
}
