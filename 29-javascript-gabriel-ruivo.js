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

  let app = (function () {
    return {

      //inicializa as funções;
      init: function () {
        this.getCompanyData();
        this.initEvents();
        this.getDataFromServer();
      },

      //busca da company.json nome da empresa e telefone
      getCompanyData: function getCompanyData() {
        let ajax = new XMLHttpRequest();
        ajax.open("GET", "company.json");
        ajax.send();
        ajax.addEventListener("readystatechange", this.setCompanyData, false);
      },

      //setta os respectivos nomes na tela.
      setCompanyData: function setCompanyData() {
        if (app.isRequestOk.call(this)) {
          let $companyName = DOM("[data-js=companyName]");
          let $companyPhone = DOM("[data-js=companyPhone]");
          let parsedData = JSON.parse(this.responseText);
          $companyName.get().textContent = parsedData.name;
          $companyPhone.get().textContent = parsedData.phone;
        }
      },

      //verifica se a requisição deu tudo certo.(true or false)
      isRequestOk: function isRequestOk() {
        return this.readyState === 4 && this.status === 200;
      },

      //pega dados do carro do servidor;
      getDataFromServer: function getDataFromServer() {
        let ajaxGet = new XMLHttpRequest();
        ajaxGet.open("GET", "http://localhost:3000/car");
        ajaxGet.send();
        ajaxGet.addEventListener("readystatechange", this.carData, false);
      },

      //pega os dados entrados pelo usuario e cria uma nova tabela;
      carData: function carData() {
        if (app.isRequestOk.call(this)) {
          let allItemCars = JSON.parse(this.response);
          allItemCars.forEach(item => {
            app.addCarToTable(
              item.image,
              item.brandModel,
              item.year,
              item.plate,
              item.color
            );
          });
        }
      },

      //salva os dados digitados enviando um post para o servidor;
      saveCarData: function saveCarData() {
        let $inputValues = this.getInputValues();
        let ajaxPostCar = new XMLHttpRequest();
        ajaxPostCar.open("POST", "http://localhost:3000/car");
        
        let image = $inputValues.imagem;
        let brandModel = $inputValues.modelo;        
        let year = $inputValues.ano;
        let plate = $inputValues.placa;
        let color = $inputValues.cor;
        
        ajaxPostCar.send(`
          image=${image}
          &brandModel=${brandModel}
          &year=${year}
          &plate=${plate}
          &color=${color}`
        );
      },

      initEvents: function initEvents() {
        let $carForm = DOM("[data-js=carForm]");
        $carForm.on("submit", this.handleSubmit);
      },

      handleSubmit: function handleSubmit(event) {
        event.preventDefault();
        app.saveCarData();
        app.newCar();
      },

      handleDelete: function handleDelete(event) {
        event.preventDefault();
        console.log('this:', this) // <button>Deletar</button>
        let $deletedRow = this.parentNode.parentNode; //td --> tr
        console.log($deletedRow)
        let $table = $deletedRow.parentNode; // toda table
        console.log($table);
        $table.removeChild($deletedRow); // remove apenas filho de table <tr>
      },

      newCar: function newCar() {
        let $inputValues = this.getInputValues();
        this.addCarToTable(
          $inputValues.imagem,
          $inputValues.modelo,
          $inputValues.ano,
          $inputValues.placa,
          $inputValues.cor
        );
      },

      addCarToTable: function addCarToTable(imagem, modelo, ano, placa, cor) {
        let $carTable = DOM("[data-js=carTable]");

        let $fragment = doc.createDocumentFragment();
        let $newTr = doc.createElement("tr");
        let $imageTd = doc.createElement("td");
        let $imagem = doc.createElement("img");
        let $modelTd = doc.createElement("td");
        let $yearTd = doc.createElement("td");
        let $plateTd = doc.createElement("td");
        let $colorTd = doc.createElement("td");
        let $deleteCell = doc.createElement("td");

        let $deleteButton = doc.createElement("button");
        $deleteButton.innerHTML = "Deletar";
        $deleteButton.addEventListener("click", this.handleDelete, false);
        $deleteCell.appendChild($deleteButton);

        $imagem.src = imagem;
        $imageTd.appendChild($imagem);
        $modelTd.textContent = modelo;
        $yearTd.textContent = ano;
        $plateTd.textContent = placa;
        $colorTd.textContent = cor;

        $newTr.appendChild($imageTd);
        $newTr.appendChild($modelTd);
        $newTr.appendChild($yearTd);
        $newTr.appendChild($plateTd);
        $newTr.appendChild($colorTd);
        $newTr.appendChild($deleteCell);

        $fragment.appendChild($newTr);
        $carTable.get().appendChild($fragment);
      },

      //pega todos os valores digitados
      getInputValues: function getInputValues() {
        let $inputImagem = DOM("[data-js=imagem]").get().value;
        let $inputModelo = DOM("[data-js=modelo]").get().value;
        let $inputAno = DOM("[data-js=ano]").get().value;
        let $inputPlaca = DOM("[data-js=placa]").get().value;
        let $inputCor = DOM("[data-js=cor]").get().value;

        return {
          imagem: $inputImagem,
          modelo: $inputModelo,
          ano: $inputAno,
          placa: $inputPlaca,
          cor: $inputCor,
        };
      },
    };
  })();

  app.init();
})(window.DOM, window, document);