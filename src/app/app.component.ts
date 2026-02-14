import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// 1. NOUS IMPORTONS LES DEUX SERVICES
import { FlashcardService } from './flashcard.service';
import { ClassService } from './services/class-service'; // <--- Le nouveau service

// Importer les composants enfants
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClassManagerComponent } from './components/class-manager/class-manager.component';
import { ContentEditorComponent } from './components/content-editor/content-editor.component';
import { StudyZoneComponent } from './components/study-zone/study-zone.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SidebarComponent, DashboardComponent, ClassManagerComponent, ContentEditorComponent, StudyZoneComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  currentView: string = 'dashboard';
  userRole: 'student' | 'teacher' = 'student';

  // 2. NOUS INJECTONS LES DEUX SERVICES ICI
  constructor(
    public flashcardService: FlashcardService,
    public classService: ClassService // Injection du nouveau service
  ) {}

  switchRole(role: 'student' | 'teacher') {
    this.userRole = role;
    this.currentView = 'dashboard';
  }

  navigate(view: string) {
    this.currentView = view;
  }
}