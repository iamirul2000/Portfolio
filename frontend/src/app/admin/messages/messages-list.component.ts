import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ContactService } from '../../core/services/contact.service';
import { ContactMessage } from '../../core/models/contact-message.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule
  ],
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.scss']
})
export class MessagesListComponent implements OnInit {
  private contactService = inject(ContactService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  messages: ContactMessage[] = [];
  displayedColumns: string[] = ['status', 'name', 'subject', 'date', 'actions'];
  loading = true;
  totalItems = 0;
  pageSize = 15;
  currentPage = 1;
  statusFilter: 'all' | 'new' | 'read' = 'all';

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.loading = true;
    this.contactService.getMessages(this.statusFilter, this.currentPage).subscribe({
      next: (response) => {
        this.messages = response.data;
        this.totalItems = response.meta.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load messages', error);
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadMessages();
  }

  onStatusFilterChange(): void {
    this.currentPage = 1;
    this.loadMessages();
  }

  viewMessage(id: number): void {
    this.router.navigate([`/admin/messages/${id}`]);
  }

  deleteMessage(message: ContactMessage): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Message',
        message: `Are you sure you want to delete the message from "${message.name}"? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contactService.deleteMessage(message.id).subscribe({
          next: () => {
            this.loadMessages();
          },
          error: (error) => {
            console.error('Failed to delete message', error);
          }
        });
      }
    });
  }
}
