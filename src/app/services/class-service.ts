import { Injectable, signal } from '@angular/core';

// INTERFACE (Modèle de Données) 
export interface ClassGroup {
  id: number;
  name: string;
  students: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  // 1. UTILISATION DE SIGNALS : Gestion d'état réactif pour les classes
  private classesSignal = signal<ClassGroup[]>([
    { id: 1, name: 'Mathématiques 101', students: ['Juan Pérez', 'Maria Lopez'] },
    { id: 2, name: 'Histoire Universelle', students: ['Carlos Ruiz'] }
  ]);

  constructor() { }

  // LECTURE 
  getClasses(): ClassGroup[] {
    return this.classesSignal();
  }

  // ÉCRITURE (Utilisation de .update) 

  addClass(name: string) {
    this.classesSignal.update(currentClasses => {
      const newId = currentClasses.length > 0 ? Math.max(...currentClasses.map(c => c.id)) + 1 : 1;
      return [...currentClasses, { id: newId, name, students: [] }];
    });
  }

  deleteClass(id: number) {
    this.classesSignal.update(currentClasses => 
      currentClasses.filter(c => c.id !== id)
    );
  }

  addStudentToClass(classId: number, studentName: string) {
    this.classesSignal.update(currentClasses => 
      currentClasses.map(clase => {
        if (clase.id === classId) {
          // Nous créons une copie sécurisée de l'objet et du tableau d'étudiants
          return { ...clase, students: [...clase.students, studentName] };
        }
        return clase;
      })
    );
  }

  removeStudentFromClass(classId: number, studentName: string) {
    this.classesSignal.update(currentClasses => 
      currentClasses.map(clase => {
        if (clase.id === classId) {
          return { ...clase, students: clase.students.filter(s => s !== studentName) };
        }
        return clase;
      })
    );
  }
}