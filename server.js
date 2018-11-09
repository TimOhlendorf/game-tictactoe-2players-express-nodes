  "use strict"
  let express = require('express');
  let server = express();
  let port = "8082";
  server.use(express.static("public"));

  let http = require("http");
  let webServer = http.Server(server);
  let socketIo = require("socket.io");
  let io = socketIo(webServer);

  let GameModule = require("./GameModule.js");
  let clients = [];
  let Spiel = new GameModule.Game();
  let players = [{"id" : "", "symbol" : ""},{"id" : "", "symbol" : ""}];

  const zufallSymbol = () => {
  var zufallszahl  = Math.random();
      if (zufallszahl >= 0.5) {
        players[0].symbol = "X";
        players[1].symbol = "O";
      }
      else {
        players[0].symbol = "O";
        players[1].symbol = "X";
      }
    }

  Spiel.init();
  io.on("connection", socket => {       
    console.log(`neuer client (${socket.id}) von ${socket.conn.remoteAddress}`);
    console.log(`Es sind ${clients.length} Spieler verbunden`); 
    if (clients.length === 1) { 
      clients.push(socket.id);
      players[0].id = io.sockets.connected[clients[0]];
      players[1].id = io.sockets.connected[clients[1]];
      zufallSymbol();
      io.sockets.connected[clients[0]].emit("nachrichtSpieler", `Sie spielen als Spieler ${players[0].symbol} !`);
      io.sockets.connected[clients[1]].emit("nachrichtSpieler", `Sie spielen als Spieler ${players[1].symbol} !`);
      io.emit("nachrichtServer", `Zwei Spieler verbunden. Spiel kann beginnen!` );
      io.emit("nachrichtSpiel",  `Am Zug ${Spiel.currentPlayer}. `); 
    }
      
    if (clients.length === 0) {
      clients.push(socket.id);
      io.emit("nachrichtServer", "Warten Sie auf einen Gegner!");
      console.log(clients);
    }
      
    if (clients.length === 2 && socket.id !== clients[1] || clients.length > 2 ) {
      clients.push(socket.id);
      io.sockets.connected[socket.id].emit("nachrichtSpiel", "Sie befinden sich im Zuschauer-Modus!");
      io.sockets.connected[socket.id].emit("nachrichtServer", "Sorry, es waren bereits genug Spieler online.");
      console.log(clients);
    } 
    
      
    socket.on("angekreuzt", function(data) {    
      io.emit("nachrichtSpiel", `Am Zug ${Spiel.currentPlayer}.`);
      if(clients[0] === socket.id) {
        console.log("Spielfeld: " + Spiel.gameField);    
        io.sockets.connected[clients[0]].emit("aktualisiereSpielfeld", Spiel.gameField);
        io.sockets.connected[clients[0]].emit("nachrichtSpiel", `${Spiel.move(players[0].symbol, data.feldId)} Am Zug ${Spiel.currentPlayer}`); 
        io.sockets.connected[clients[1]].emit("nachrichtSpiel",  `Am Zug ${Spiel.currentPlayer}`);
        clients.slice(2,clients.length).map(a => io.sockets.connected[a].emit("nachrichtSpiel",  `Am Zug ${Spiel.currentPlayer}`));  
      }
        
      if(clients[1] === socket.id) { 
        console.log("Spielfeld: " + Spiel.gameField);    
        io.sockets.connected[clients[1]].emit("aktualisiereSpielfeld", Spiel.gameField);
        io.sockets.connected[clients[1]].emit("nachrichtSpiel", `${Spiel.move(players[1].symbol, data.feldId)} Am Zug ${Spiel.currentPlayer}`);  
        io.sockets.connected[clients[0]].emit("nachrichtSpiel",  `Am Zug ${Spiel.currentPlayer}`);
        clients.slice(2,clients.length).map(a => io.sockets.connected[a].emit("nachrichtSpiel",  `Am Zug ${Spiel.currentPlayer}`));  
      }
      else {
        clients.slice(2,clients.length).map(a => io.sockets.connected[a].emit("nachrichtSpiel",  `Am Zug ${Spiel.currentPlayer}`));  
      }
      io.emit("aktualisiereSpielfeld", Spiel.gameField );
      if(Spiel.result === "-") io.sockets.emit("nachrichtSpiel", `Spiel endet unentschieden!` );
      if(Spiel.result === "O") io.sockets.emit("nachrichtSpiel", `Spiel beendet: Spieler O hat gewonnen.` );
      if(Spiel.result === "X") io.sockets.emit("nachrichtSpiel", `Spiel beendet: Spieler X hat gewonnen.` );         
    });
});


  let stdin = process.openStdin();
  stdin.addListener("data", d=> { io.emit("nachricht", d.toString())});
  webServer.listen(port, "localhost");
  console.log(`Webserver läuft auf Port: ${port}`);