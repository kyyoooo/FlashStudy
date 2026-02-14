import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  @Input() userRole: 'student' | 'teacher' = 'student';
  @Input() currentView: string = 'dashboard';
  
  @Output() roleChange = new EventEmitter<'student' | 'teacher'>();
  @Output() navigate = new EventEmitter<string>();

  // Variable pour contrôler l'état (Mode Sombre)
  isDarkMode = false;

  ngOnInit() {
    // Au démarrage, nous vérifions si l'utilisateur avait déjà enregistré le mode sombre
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark-mode');
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode'); // Ajoute la classe au <body>
      localStorage.setItem('theme', 'dark');    // Sauvegarde en mémoire
    } else {
      document.body.classList.remove('dark-mode'); // Retire la classe
      localStorage.setItem('theme', 'light');      // Sauvegarde en mémoire
    }
  }

  setRole(role: 'student' | 'teacher') {
    this.roleChange.emit(role);
  }

  onNavigate(view: string) {
    this.navigate.emit(view);
  }
}