(function (DOM, win, doc) {
  "use strict";

  /*
    Vamos estruturar um pequeno app utilizando módulos.
    Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
    A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
    seguinte forma:
    - No início do arquivo, deverá ter as informações da sua empresa - nome e
    telefone (já vamos ver como isso vai ser feito)
    - Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
    um formulário para cadastro do carro, com os seguintes campos:
      - Imagem do carro (deverá aceitar uma URL)
      - Marca / Modelo
      - Ano
      - Placa
      - Cor
      - e um botão "Cadastrar"
    Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
    carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
    aparecer no final da tabela.
    Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
    empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
    Dê um nome para a empresa e um telefone fictício, preechendo essas informações
    no arquivo company.json que já está criado.
    Essas informações devem ser adicionadas no HTML via Ajax.
    Parte técnica:
    Separe o nosso módulo de DOM criado nas últimas aulas em
    um arquivo DOM.js.
    E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
    que será nomeado de "app".
    */

  var app =(
    function () {
      return {
        init: function () {
          this.getCompanyData();
          this.initEvents();
        },
  
        getCompanyData: function getCompanyData() {
          var ajax = new XMLHttpRequest();
  
          ajax.open("GET", "company.json");
          ajax.send();
          ajax.addEventListener("readystatechange", this.setCompanyData, false);
        },
  
        setCompanyData: function setCompanyData() {
          if (app.isRequestOk.call(this)) {
            var $companyName = DOM("[data-js=companyName]");
            var $companyPhone = DOM("[data-js=companyPhone]");
            var parsedData = JSON.parse(this.responseText);
            $companyName.get().textContent = parsedData.name;
            $companyPhone.get().textContent = parsedData.phone;
          }
        },
  
        isRequestOk: function isRequestOk() {
          return this.readyState === 4 && this.status === 200;
        },
  
        initEvents: function initEvents () {
          var $carForm = DOM("[data-js=carForm]");
          $carForm.on("submit", this.handleSubmit);
        },
  
        handleSubmit: function handleSubmit(event) {
          event.preventDefault();
          var $carTable = DOM("[data-js=carTable]");
          $carTable.get().appendChild(app.newCar());
        },

        handleDelete: function handleDelete(event){
          event.preventDefault()
          var $deletedRow = this.parentNode.parentNode
          var $table = $deletedRow.parentNode
          $table.removeChild($deletedRow)
        },
  
        newCar: function newCar() {
          var $fragment = doc.createDocumentFragment();
          var $newTr = doc.createElement("tr");
          var $tdImage = doc.createElement("td");
          var $imagem = doc.createElement("img")
          var $modelTd = doc.createElement("td");
          var $yearTd = doc.createElement("td");
          var $plateTd = doc.createElement("td");
          var $colorTd = doc.createElement("td");
          var $tdDelete = doc.createElement("td")
          var $deleteButton = doc.createElement("button");

          $deleteButton.innerHTML = "Deletar"
          $deleteButton.addEventListener('click',this.handleDelete, false);
          $tdDelete.appendChild($deleteButton);

          $imagem.src = DOM("[data-js=imagem]").get().value;
          $tdImage.appendChild($imagem)
          $modelTd.textContent = DOM("[data-js=modelo]").get().value;
          $yearTd.textContent = DOM("[data-js=ano]").get().value;
          $plateTd.textContent = DOM("[data-js=placa]").get().value;
          $colorTd.textContent = DOM("[data-js=cor]").get().value;
  
          $newTr.appendChild($tdImage);
          $newTr.appendChild($modelTd);
          $newTr.appendChild($yearTd);
          $newTr.appendChild($plateTd);
          $newTr.appendChild($colorTd);
          $newTr.appendChild($tdDelete);
  
          return $fragment.appendChild($newTr);
        },
      };
    }
  )()
  

  app.init();
})(window.DOM, window, document);