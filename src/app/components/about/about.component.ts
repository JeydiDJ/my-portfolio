// about.component.ts
import { Component, AfterViewInit } from '@angular/core';
import BlobShape from 'blobshape';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const blobElement = document.querySelector('.blob-image') as HTMLElement;

    if (blobElement) {
      const blob = new BlobShape({
        element: blobElement,
        numPoints: 8,      // controls smoothness
        randomness: 8,     // controls how far the edges move
        speed: 0.4         // animation speed
      });
      blob.animate();
    }
  }
}