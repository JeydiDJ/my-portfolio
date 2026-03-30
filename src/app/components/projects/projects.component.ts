import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';

// ------------------- Particle Class -------------------
class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;

  constructor(private canvasWidth: number, private canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
  }

  update(): void {
    this.x += this.speedX;
    this.y += this.speedY;

    // Wrap around edges
    if (this.x > this.canvasWidth) this.x = 0;
    if (this.x < 0) this.x = this.canvasWidth;
    if (this.y > this.canvasHeight) this.y = 0;
    if (this.y < 0) this.y = this.canvasHeight;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ------------------- Component -------------------
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements AfterViewInit {

  @ViewChild('particleCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private particlesArray: Particle[] = [];

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    this.initParticles();
    this.animateParticles();
  }

  @HostListener('window:resize')
  resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement;
    canvas.width = parent?.clientWidth || window.innerWidth;
    canvas.height = parent?.clientHeight || window.innerHeight;
  }

  private initParticles(): void {
    const canvas = this.canvasRef.nativeElement;
    const numberOfParticles = Math.max(Math.floor((canvas.width * canvas.height) / 18000), 30);
    this.particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
      this.particlesArray.push(new Particle(canvas.width, canvas.height));
    }
  }

  private animateParticles(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.particlesArray.forEach(p => {
      p.update();
      p.draw(ctx);
    });
    requestAnimationFrame(() => this.animateParticles());
  }
}
