"use strict";

class Game {
  constructor(starter) {
    if (starter == null) {
    var zufallszahl  = Math.random();
      if (zufallszahl >= 0.5) {
        this.currentPlayer = "X";
      }
      else{
        this.currentPlayer = "O";
      }
    }
    else {
      this.currentPlayer = starter; //startspieler "X" oder "O"
    }
    this.gameField = ["","","","","","","","",""]; // Spielfeld 
    this.result = ""; // "" = noch offen, "X" = X gewinnt, "O" = O gewinnt, "-" = unentschieden 
  }
  
  

  feldFrei(playerFeld) {
    if (this.gameField[playerFeld] == "") { 
      return true;
    }
    else {
      return false;    
    }
  }
    
  spielerAmZug(playerSymbol) {
    if(this.currentPlayer == playerSymbol) {
      return true; 
    }
    else {
      return false; 
    }
  }
    
  spielOffen() {
    if(this.result == "") {
       return true;
    }
    else {
      return false;
    }
  }

  move(playerSymbol,playerFeld) {       
  if(this.feldFrei(playerFeld) && this.spielerAmZug(playerSymbol) && this.spielOffen()) {
    this.gameField[playerFeld]=playerSymbol;       
    if(this.currentPlayer =="X") {
      this.currentPlayer = "O"
    } 
    else {
      this.currentPlayer = "X"
    } 
    return this.checkResult();
  }
  else {
    if(!this.spielerAmZug(playerSymbol)) {
      return `Ungueltiger Zug: ${playerSymbol} ist nicht am Zug!`;
    } 
    if(!this.feldFrei(playerFeld)) {
      return  `Ungueltiger Zug: Feld ${playerFeld} ist nicht frei!`;
    } 
    if(!this.spielOffen()) {
      return "Ungueltiger Zug: Das Spiel ist zu Ende!";
    } 
  }
  }
    
  spieler(x) {
    this.id;
    this.symbol = x;
  }
    
  getSpielerSymbol(spieler) {
    return spieler.symbol;
  }
    
  getSpielerId(spieler) {
    return spieler.id; 
  }
    
  getPlayerById(id) {
    return this.playerListe.filter(a => a.id == id);
  }
    
  erzeugeSpieler(id, symbol) {
    this.playerListe.push(this.spieler(id, symbol));
    console.log("erzeugeSpieler" + this.playerListe);
  }
    
  checkResult() {
    if(this.checkDraw()) {
      this.result = "-"; 
      return "Ungueltiger Zug: Das Spiel ist zu Ende! Das Ergebnis ist unentschieden!";
    }
      
    if(this.checkPlayerWon('X')) { 
      this.result = 'X';
      return "Ungueltiger Zug: Das Spiel ist zu Ende! Spieler X hat gewonnen!";
    }
      
    if(this.checkPlayerWon('O')) { 
      this.result = 'O';
      return "Ungueltiger Zug: Das Spiel ist zu Ende! Spieler O hat gewonnen!";
    } 
    else {
      return "";
    } 
  }
    
    
  checkPlayerWon(playerSymbol) {
    if( this.gameField[0] == this.gameField[1] && 
    this.gameField[1] == this.gameField[2] &&
    this.gameField[0] == this.gameField[2] &&
    this.gameField[2] == playerSymbol ||
    this.gameField[3] == this.gameField[4] &&
    this.gameField[3] == this.gameField[5] &&
    this.gameField[4] == this.gameField[5] &&
    this.gameField[5] == playerSymbol ||
    this.gameField[6] == this.gameField[7]&&
    this.gameField[6] == this.gameField[8] &&
    this.gameField[8] == playerSymbol ||
    this.gameField[0] == this.gameField[3] &&
    this.gameField[3] == this.gameField[6] &&
    this.gameField[3] == playerSymbol ||       
    this.gameField[1] == this.gameField[4] &&
    this.gameField[4] == this.gameField[7] &&
    this.gameField[7] == playerSymbol ||
    this.gameField[2] == this.gameField[5] &&
    this.gameField[5] == this.gameField[8] &&
    this.gameField[5] == playerSymbol||
    this.gameField[0] == this.gameField[4] &&
    this.gameField[0] == this.gameField[8] &&
    this.gameField[0] == playerSymbol||
    this.gameField[2] == this.gameField[4] &&
    this.gameField[4] == this.gameField[6] &&
    this.gameField[4] == playerSymbol) {
      console.log(`Es hat ${playerSymbol} gewonnen!`);
      this.result = playerSymbol;
      return true;
    } 
    else { 
      return false;
    } 
  };
  
  checkDraw() {
    if ( this.gameField.every(x => x !== "") && !this.checkPlayerWon("X") && !this.checkPlayerWon("O") ) {
      return true; 
    }
    else { 
      return false;
    }
  };
    
  init () {
  }
}

exports.Game = Game;