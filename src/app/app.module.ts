import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeroComponent } from './components/hero/hero.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ContactComponent } from './components/contact/contact.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { AboutComponent } from './components/about/about.component';
import { ScrollAnimateDirective } from './scroll-animate.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeroComponent,
    ProjectsComponent,
    SkillsComponent,
    ContactComponent,
    ProjectCardComponent,
    AboutComponent,
    ScrollAnimateDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
