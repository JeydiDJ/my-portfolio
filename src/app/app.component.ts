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
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateViewportVars();
  }

  private updateViewportVars(): void {
    document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
  }
}
