import { Component } from '@angular/core';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  isLoading = false;
  isSent = false;
  hasError = false;

  sendEmail(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    this.isSent = false;
    this.hasError = false;

    const form = event.target as HTMLFormElement;
    if (!form.reportValidity()) { this.isLoading = false; return; }

    emailjs.sendForm(
      environment.emailjsServiceID,
      environment.emailjsTemplateID,
      form,
      environment.emailjsPublicKey
    ).then(
      () => {
        this.isLoading = false;
        this.isSent = true;
        form.reset();
      },
      (error) => {
        this.isLoading = false;
        this.hasError = true;
        console.error('FAILED...', error);
      }
    );
  }
}
