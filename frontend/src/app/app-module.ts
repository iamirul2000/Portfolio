import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { HomeComponent } from './home/home.component';
import { authInterceptor, errorInterceptor } from './core';
import { About } from './about/about';
import { Experience } from './experience/experience';
import { Projects } from './projects/projects';
import { ProjectDetail } from './project-detail/project-detail';
import { Skills } from './skills/skills';
import { Contact } from './contact/contact';
import { MaterialModule } from './shared/material.module';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ProjectCardComponent } from './shared/components/project-card/project-card.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    App,
    HomeComponent,
    About,
    Experience,
    Projects,
    ProjectDetail,
    Skills,
    Contact
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    HeaderComponent,
    FooterComponent,
    ProjectCardComponent,
    LoadingSpinnerComponent
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN'
      }),
      withInterceptors([authInterceptor, errorInterceptor])
    )
  ],
  bootstrap: [App]
})
export class AppModule { }

