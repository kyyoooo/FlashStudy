import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  // ENTRÉES
  // Reçoit les données du composant parent (App)
  
  // Rôle de l'utilisateur : étudiant ou (professeur)
  @Input() userRole: 'student' | 'teacher' = 'student';
  
  // Statistiques à afficher
  @Input() totalCards = 0;   // total de cartes
  @Input() totalFolders = 0; //  total de dossiers
  @Input() totalClasses = 0; // total de classes (seulement pour le prof)
  
  // SORTIES 
  // Événement pour naviguer vers d'autres vues (ex: 'crear', 'examen')
  @Output() navigate = new EventEmitter<string>();
}