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
    this.updateScrollVars();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateViewportVars();
    this.updateScrollVars();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.updateScrollVars();
  }

  private updateViewportVars(): void {
    document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
  }

  private updateScrollVars(): void {
    const scrollTop = window.scrollY || window.pageYOffset;
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(scrollTop / scrollable, 1);

    document.documentElement.style.setProperty('--scroll-y', `${scrollTop}px`);
    document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4));
  }
}
