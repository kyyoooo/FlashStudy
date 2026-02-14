import { Injectable, signal, computed } from '@angular/core';

// --- INTERFACE (Modèle de Données Complet) ---
export interface Flashcard {
  id: number;
  question: string;
  answer: string;          // La réponse CORRECTE
  wrongAnswers: string[];  // <--- Les réponses INCORRECTES (Pièges)
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {
  
  // 1. Données initiales (Y compris des exemples avec réponses incorrectes)
  private flashcardsSignal = signal<Flashcard[]>([
    { 
      id: 1, 
      category: 'Mathématiques', 
      question: 'Combien font 2 + 2 ?', 
      answer: '4', 
      wrongAnswers: ['3', '5', '22'] 
    },
    { 
      id: 2, 
      category: 'Histoire', 
      question: 'Qui a découvert l\'Amérique ?', 
      answer: 'Christophe Colomb', 
      wrongAnswers: ['Napoléon', 'Einstein', 'Cortés'] 
    },
    { 
      id: 3, 
      category: 'Anglais', 
      question: 'Chien en anglais', 
      answer: 'Dog', 
      wrongAnswers: ['Cat', 'Mouse', 'Bird'] 
    }
  ]);

  // Nombre total de cartes calculé automatiquement
  totalCardsCount = computed(() => this.flashcardsSignal().length);

  constructor() { }

  // --- LECTURE ---
  getFlashcards(): Flashcard[] {
    return this.flashcardsSignal();
  }

  // --- ÉCRITURE (Accepte maintenant wrongAnswers) ---

  // 2. Méthode ADD mise à jour pour recevoir 4 arguments + wrongAnswers
  addFlashcard(question: string, answer: string, wrongAnswers: string[], category: string) {
    this.flashcardsSignal.update(currentCards => {
      const newId = currentCards.length > 0 ? Math.max(...currentCards.map(c => c.id)) + 1 : 1;
      return [...currentCards, { id: newId, question, answer, wrongAnswers, category }];
    });
  }

  // 3. Méthode UPDATE mise à jour
  updateFlashcard(id: number, question: string, answer: string, wrongAnswers: string[], category: string) {
    this.flashcardsSignal.update(currentCards => 
      currentCards.map(card => 
        card.id === id ? { ...card, question, answer, wrongAnswers, category } : card
      )
    );
  }

  deleteFlashcard(id: number) {
    this.flashcardsSignal.update(currentCards => 
      currentCards.filter(c => c.id !== id)
    );
  }

  deleteCategory(category: string) {
    this.flashcardsSignal.update(currentCards => 
      currentCards.filter(c => c.category !== category)
    );
  }
}