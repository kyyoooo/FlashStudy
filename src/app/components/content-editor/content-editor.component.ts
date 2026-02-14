import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlashcardService, Flashcard } from '../../flashcard.service';

@Component({
  selector: 'app-content-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './content-editor.component.html',
  styleUrl: './content-editor.component.css'
})
export class ContentEditorComponent implements OnInit {
  // Données
  categories: string[] = [];
  managingCategory: string | null = null;
  managedCards: Flashcard[] = [];
  
  // Variables du Formulaire
  editingCardId: number | null = null;
  formQuestion = '';
  formAnswer = '';       // Réponse Correcte
  formWrongAnswers = ''; // Réponses Incorrectes (Texte séparé par des virgules)

  constructor(private service: FlashcardService) {}

  ngOnInit() { 
    this.refresh(); 
  }
  
  refresh() {
    // Nous obtenons les catégories uniques
    this.categories = Array.from(new Set(this.service.getFlashcards().map(c => c.category))).sort();
    
    // Si nous sommes à l'intérieur d'un dossier, nous mettons à jour la liste des cartes
    if (this.managingCategory) {
      this.managedCards = this.service.getFlashcards().filter(c => c.category === this.managingCategory);
    }
  }

  nuevaCarpeta() {
    // "Nom du nouveau dossier :"
    const n = prompt("Nom du nouveau dossier :");
    if (n?.trim()) { 
      this.managingCategory = n.trim(); 
      this.managedCards = []; 
    }
  }

  borrarCarpeta(cat: string, e: Event) {
    e.stopPropagation();
    // "Supprimer le dossier et tout son contenu ?"
    if (confirm("Supprimer le dossier et tout son contenu ?")) { 
      this.service.deleteCategory(cat); 
      this.refresh(); 
      if (this.managingCategory === cat) {
        this.managingCategory = null;
      }
    }
  }

  guardar() {
    if (this.managingCategory && this.formQuestion && this.formAnswer) {
      
      // 1. Nous convertissons le texte des incorrectes "a, b, c" en un tableau ["a", "b", "c"]
      const wrongsArray = this.formWrongAnswers.split(',').map(s => s.trim()).filter(s => s !== '');

      if (this.editingCardId) {
        // METTRE À JOUR LA CARTE EXISTANTE
        this.service.updateFlashcard(
          this.editingCardId, 
          this.formQuestion, 
          this.formAnswer, 
          wrongsArray, 
          this.managingCategory
        );
      } else {
        // CRÉER UNE NOUVELLE CARTE
        this.service.addFlashcard(
          this.formQuestion, 
          this.formAnswer, 
          wrongsArray, 
          this.managingCategory
        );
      }
      
      this.limpiar();
      this.refresh();
    } else {
      // "Veuillez compléter au moins la question et la réponse correcte."
      alert("Veuillez compléter au moins la question et la réponse correcte.");
    }
  }

  editar(card: Flashcard) {
    this.editingCardId = card.id;
    this.formQuestion = card.question;
    this.formAnswer = card.answer;
    
    // 2. Nous joignons le tableau pour l'afficher dans l'entrée de texte
    // Nous utilisons ( || []) par sécurité si la carte n'a pas de réponses incorrectes définies
    this.formWrongAnswers = (card.wrongAnswers || []).join(', ');
  }

  borrarCarta(id: number) {
    // "Supprimer cette carte ?"
    if (confirm("Supprimer cette carte ?")) { 
      this.service.deleteFlashcard(id); 
      this.refresh(); 
      if (this.editingCardId === id) this.limpiar();
    }
  }

  limpiar() { 
    this.editingCardId = null; 
    this.formQuestion = ''; 
    this.formAnswer = ''; 
    this.formWrongAnswers = '';
  }
}