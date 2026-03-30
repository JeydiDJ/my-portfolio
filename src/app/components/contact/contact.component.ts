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

  sendEmail(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    this.isSent = false;

    const form = event.target as HTMLFormElement;

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
        console.error('FAILED...', error);
      }
    );
  }
}
