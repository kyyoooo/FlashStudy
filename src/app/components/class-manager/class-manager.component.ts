import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 1. CHANGEMENT IMPORTANT : Nous importons le nouveau service et l'interface depuis leur nouvel emplacement
import { ClassService, ClassGroup } from '../../services/class-service';

@Component({
  selector: 'app-class-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './class-manager.component.html',
  styleUrl: './class-manager.component.css'
})
export class ClassManagerComponent implements OnInit {
  allClasses: ClassGroup[] = [];
  selectedClass: ClassGroup | null = null;
  formStudentName = '';

  // 2. CHANGEMENT IMPORTANT : Nous injectons 'ClassService' au lieu de 'FlashcardService'
  constructor(private classService: ClassService) {}

  ngOnInit() { this.refresh(); }

  // 3. CHANGEMENTS : Tous les appels utilisent maintenant 'this.classService'
  refresh() { 
    this.allClasses = this.classService.getClasses(); 
  }

  crearNuevaClase() {
    const nombre = prompt("Nom de la nouvelle classe :");
    if (nombre?.trim()) {
      this.classService.addClass(nombre.trim()); // <--- Utilisation du nouveau service
      this.refresh();
    }
  }

  verDetalle(clase: ClassGroup) { this.selectedClass = clase; }
  
  volver() { 
    this.selectedClass = null; 
    this.refresh(); 
  }

  borrarClase(id: number, e: Event) {
    e.stopPropagation();
    if (confirm("Supprimer la classe ?")) {
      this.classService.deleteClass(id); // <--- Utilisation du nouveau service
      this.refresh();
      this.selectedClass = null;
    }
  }

  agregarAlumno() {
    if (this.selectedClass && this.formStudentName.trim()) {
      this.classService.addStudentToClass(this.selectedClass.id, this.formStudentName.trim()); // <--- Nouveau service
      this.formStudentName = '';
      
      // Nous mettons à jour la vue localement pour voir le changement immédiat
      // (Dans les signals, il est parfois nécessaire de rafraîchir la référence locale si nous n'utilisons pas le signal direct dans le HTML)
      this.refresh();
      
      // Petite astuce pour mettre à jour la classe sélectionnée avec les nouvelles données
      this.selectedClass = this.allClasses.find(c => c.id === this.selectedClass?.id) || null;
    }
  }

  eliminarAlumno(alumno: string) {
    if (this.selectedClass && confirm(`Supprimer ${alumno} ?`)) {
      this.classService.removeStudentFromClass(this.selectedClass.id, alumno); // <--- Nouveau service
      this.refresh();
      this.selectedClass = this.allClasses.find(c => c.id === this.selectedClass?.id) || null;
    }
  }

  copiarLink(clase: ClassGroup) {
    navigator.clipboard.writeText(`https://flashstudy.app/join/${clase.id}`)
      .then(() => alert('✅ Lien copié (Simulé)'));
  }

  getMockScore(name: string): number {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash % 51) + 50; 
  }
}