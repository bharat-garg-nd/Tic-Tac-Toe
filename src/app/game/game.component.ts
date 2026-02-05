import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit{
  user: string | null = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if(!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = this.auth.getUser();
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

board: string[] = Array(9).fill('');
  // status: string = 'Player X Turn';
  gameOver: boolean = false;
  gameStarted: boolean = false;

  playerSymbol: string = '';
  computerSymbol: string = '';

  status: string = '';

  winningPatterns: number[][] = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];
  chooseSymbol(symbol: string){
    this.playerSymbol = symbol;
    this.computerSymbol = symbol == 'X' ? 'O' : 'X';

    this.startGame();
  }
  updateURL() {
    const url = `?board=${this.board.join(',')}&human=${this.playerSymbol}`;
    window.history.pushState({}, '', url);
  }
  startGame() {
    this.gameStarted = true;
    this.gameOver = false;
    this.board = Array(9).fill('');

    if(this.playerSymbol == 'X')
      this.status = 'Your Turn';
    else {
      this.status = 'Computer Turn';

      setTimeout(() => {
        this.computerMove();
      }, 500);
    }
  }
  makeMove(index: number){
    if(this.board[index] !== '' || this.gameOver )
      return;
  
    this.board[index] = this.playerSymbol;
    if (this.checkWinner(this.playerSymbol)){
      this.status = `You Wins!`;
      this.gameOver = true;
      return;
    }
    if(this.checkDraw()){
      this.status = 'Its a Draw';
      this.gameOver = true;
      return;
    }
    // this.currentPlayer = this.currentPlayer == 'X' ? 'O' : 'X';

    this.status = `Computer Thinking`;
    setTimeout(() => {
      this.computerMove();
    },500);

    this.updateURL();
  }
  computerMove(){
    if (this.gameOver) return;
// Truthy/Falsy................0 index considered as False..XD..
    let move = this.findWinningMove(this.computerSymbol);
    if(move == null){
      move = this.findWinningMove(this.playerSymbol);
    }
    if(move == null){
      move = this.getRandomMove();
    }

    this.board[move] = this.computerSymbol;

    if (this.checkWinner(this.computerSymbol)){
      this.status = `Computer Wins!`;
      this.gameOver = true;
      return;
    }
    if(this.checkDraw()){
      this.status = 'Its a Draw';
      this.gameOver = true;
      return;
    }

    this.status = 'Your Turn';
    this.updateURL();
  }
  findWinningMove(player:string): number | null {
    for(let pattern of this.winningPatterns){
      const[a,b,c] = pattern;
      const values = [this.board[a], this.board[b], this.board[c]];
      if(values.filter(v => v == player).length == 2 && values.includes('')){
        if(this.board[a] == '') return a;
        if(this.board[b] == '') return b;
        if(this.board[c] == '') return c;
      }
    }
    return null;
  }
  getRandomMove(): number{
    const emptyCells: number[] = [];
    this.board.forEach((cell, i) => {
      if(cell == ''){
        emptyCells.push(i);
      }
    });
    const randomIndex = Math.floor(Math.random()*emptyCells.length);
    return emptyCells[randomIndex];
  }
  checkWinner(player: string): boolean {
    for(let pattern of this.winningPatterns){
      const [a,b,c] = pattern;
      if(
        this.board[a] == player && this.board[b] == player && this.board[c] == player
      ) {
        return true;
      }
    }
    return false;
  }
  checkDraw(): boolean{
    if(this.board.every(cell => cell !== '')){
      return true;
    }
    return false;
  }
  getCellClass(index: number): string {
    let classes = '';

    if(index % 3 !==2){
      classes += 'v-line';
    }
    if(index<6){
      classes += 'h-line';
    }
    return classes;
  }
  reset(){
    this.gameStarted = false;
    this.gameOver = false;
    this.computerSymbol = '';
    this.playerSymbol = '';
    this.board = Array(9).fill('');
    this.status = '';

    window.history.pushState({}, '', '/');
  }
  restoreGameState(){
    if(this.checkWinner(this.playerSymbol)){
      this.status = "You Win!";
      this.gameOver = true;
      return;
    }
    if(this.checkWinner(this.computerSymbol)){
      this.status = "Computer Wins!";
      this.gameOver = true;
      return;
    }
    if(this.checkDraw()){
      this.status = 'Its a Draw';
      this.gameOver = true;
      return;
    }
    this.gameOver = false;
    const filledCells = this.board.filter(cell => cell !== '').length;
// Odd move O's turn....Even moves X's turn
    const isX = filledCells%2 == 0;
    if(this.playerSymbol == 'X'){
      if(isX){
        this.status = 'Your Turn';
      }
      else {
        this.status = 'Computer Turn';
        this.triggerComputerMove();
      }
    }
    else {
      if(isX){
        this.status = 'Computer Turn';
        this.triggerComputerMove();
      }else
      {
        this.status = 'Your Turn';
      }
    }
  }
  triggerComputerMove(){
    if(this.gameOver)
      return;
    setTimeout(() => {
      this.computerMove();
    },500);
  }
}