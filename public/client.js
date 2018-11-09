"use strict";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
NodeList.prototype.__proto__ = Array.prototype;
HTMLCollection.prototype.__proto__ = Array.prototype;

const infoSpiel = $("#infoSpiel");
const infoSpieler = $("#infoSpieler");
const infoServer = $("#infoServer");
const alleFelder = () => $$("td");

var socket = io.connect();

const aktualisiereSpielfeld = (aktuelleSpielfeld) => {
  alleFelder()[0].innerHTML = aktuelleSpielfeld[0];
  alleFelder()[1].innerHTML = aktuelleSpielfeld[1];
  alleFelder()[2].innerHTML = aktuelleSpielfeld[2];
  alleFelder()[3].innerHTML = aktuelleSpielfeld[3];
  alleFelder()[4].innerHTML = aktuelleSpielfeld[4];
  alleFelder()[5].innerHTML = aktuelleSpielfeld[5];
  alleFelder()[6].innerHTML = aktuelleSpielfeld[6];
  alleFelder()[7].innerHTML = aktuelleSpielfeld[7];
  alleFelder()[8].innerHTML = aktuelleSpielfeld[8];
};

const init = () => {
  infoServer.textContent = "Bitte warten Sie auf ihren Gegner!";
  alleFelder().map(e => e.addEventListener("mouseover", setactive));
  alleFelder().map(e => e.addEventListener("mouseout", setinactive));
  alleFelder().map(e => e.addEventListener("click", setsymbol));
  socket.on("nachrichtSpiel", function(data) {
    var el = infoSpiel;
    el.textContent = data; 
    console.log(data);
  });
  socket.on("nachrichtSpieler", function(data) {
    var el = infoSpieler;
    el.textContent = data; 
    console.log(data);
  });
  socket.on("nachrichtServer", function(data) {
    var el = infoServer;
    el.textContent = data; 
  }); 
  socket.on("aktualisiereSpielfeld", function(gameField) { 
    aktualisiereSpielfeld(gameField);
  }); 
};

const setsymbol = (e) => {
  let id = e.currentTarget.id.slice(4,5);
  var data = {feldId: id};
  socket.emit("angekreuzt", data);
};

const setactive = (e) => {
  e.target.style.backgroundColor ="#DF7171";
};

const setinactive = (e) => {
  e.target.style.backgroundColor ="white";
};

init();
