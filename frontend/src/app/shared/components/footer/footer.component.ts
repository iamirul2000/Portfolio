import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/iamirul2000',
      icon: 'code'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/mirul-',
      icon: 'work'
    },
    {
      name: 'Email',
      url: 'mailto:amirul.iman698@gmail.com',
      icon: 'email'
    }
  ];
}
