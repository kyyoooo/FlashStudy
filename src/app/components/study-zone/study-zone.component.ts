import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashcardService, Flashcard } from '../../flashcard.service';

@Component({
  selector: 'app-study-zone',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './study-zone.component.html',
  styleUrl: './study-zone.component.css'
})
export class StudyZoneComponent implements OnInit {
  // "Nous recevons si c'est le mode étude ou examen"
  @Input() mode: 'study' | 'exam' = 'study'; 
  @Output() finish = new EventEmitter<void>();

  // États internes
  view: 'menu' | 'playing' | 'result' = 'menu';
  categories: string[] = [];
  
  // Jeu / Examen
  playableCards: Flashcard[] = [];
  currentIndex = 0;
  showAnswer = false;
  
  // Examen spécifique
  score = 0;
  isCorrect: boolean | null = null;
  options: string[] = [];
  isShaking = false;

  constructor(private service: FlashcardService) {}

  ngOnInit() {
    this.categories = Array.from(new Set(this.service.getFlashcards().map(c => c.category))).sort();
  }

  selectCategory(cat: string) {
    this.playableCards = this.service.getFlashcards().filter(c => c.category === cat);
    
    // Pour l'examen, on vérifie s'il y a des cartes
    if (this.mode === 'exam' && this.playableCards.length < 1) {
      // "Vous avez besoin d'au moins 1 carte pour l'examen."
      alert("Vous avez besoin d'au moins 1 carte pour l'examen.");
      return;
    }
    
    this.currentIndex = 0;
    this.score = 0;
    this.view = 'playing';
    if (this.mode === 'exam') this.generateOptions();
  }

  // LOGIQUE D'ÉTUDE (RETOURNER) 
  toggleAnswer() { this.showAnswer = !this.showAnswer; }
  
  nextCard() {
    if (this.currentIndex < this.playableCards.length - 1) {
      this.currentIndex++;
      this.showAnswer = false;
      if (this.mode === 'exam') { this.isCorrect = null; this.generateOptions(); }
    } else {
      if (this.mode === 'exam') this.view = 'result';
      else this.finish.emit(); // "Retour au tableau de bord si l'étude est terminée"
    }
  }

  // --- LOGIQUE D'EXAMEN ---
  generateOptions() {
    const card = this.playableCards[this.currentIndex];
    
    // 1. Réponse correcte
    const correct = card.answer;
    
    // 2. Réponses incorrectes (Manuelles)
    // J'ai mis à jour ceci pour utiliser tes "wrongAnswers" du Service
    const distractors = card.wrongAnswers || []; 
    
    // 3. Combiner et mélanger
    const allOptions = [correct, ...distractors];
    this.options = allOptions.sort(() => 0.5 - Math.random());
  }

  checkAnswer(opt: string) {
    const correct = this.playableCards[this.currentIndex].answer;
    if (opt === correct) {
      this.isCorrect = true;
      this.score++;
      this.playSound('risa.mp3'); // "Assurez-vous que le fichier existe dans les assets ou supprimez-le"
    } else {
      this.isCorrect = false;
      this.isShaking = true;
      setTimeout(() => this.isShaking = false, 500);
      this.playSound('error.mp3');
    }
  }

  playSound(file: string) { /* "Implémenter le son si vous le souhaitez" */ }
}