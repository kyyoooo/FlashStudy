export class Flashcard {
    
  // Nous définissons les données de chaque carte
  id: number;
  question: string;
  answer: string;
  category: string;

  // Le constructeur aide à créer de nouvelles cartes facilement
  constructor(id: number, question: string, answer: string, category: string) {
    this.id = id;
    this.question = question;
    this.answer = answer;
    this.category = category;
  }
}