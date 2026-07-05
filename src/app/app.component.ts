import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'my-portfolio';

  ngOnInit(): void {
    this.updateViewportVars();
    this.updateMouseGlow(window.innerWidth / 2, window.innerHeight / 2);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateViewportVars();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.updateMouseGlow(event.clientX, event.clientY);
  }

  private updateViewportVars(): void {
    document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
  }

  private updateMouseGlow(x: number, y: number): void {
    document.documentElement.style.setProperty('--mouse-x', `${x}px`);
    document.documentElement.style.setProperty('--mouse-y', `${y}px`);
  }
}
