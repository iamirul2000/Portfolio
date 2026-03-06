import { Component, OnInit } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
  type: 'star' | 'bubble' | 'line';
}

@Component({
  selector: 'app-particles-background',
  standalone: false,
  templateUrl: './particles-background.component.html',
  styleUrl: './particles-background.component.scss'
})
export class ParticlesBackgroundComponent implements OnInit {
  particles: Particle[] = [];

  ngOnInit(): void {
    this.generateParticles();
  }

  generateParticles(): void {
    const particleCount = 30;
    const types: Array<'star' | 'bubble' | 'line'> = ['star', 'bubble', 'line'];

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 20 + 15,
        delay: Math.random() * 10,
        type: types[Math.floor(Math.random() * types.length)]
      });
    }
  }
}
