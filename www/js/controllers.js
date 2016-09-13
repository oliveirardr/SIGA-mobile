angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $http, $state, $ionicLoading, $ionicPopup, $ionicNavBarDelegate){

    $scope.setNavTitle = function(a){
      $ionicNavBarDelegate.title("SIGA Mobile");
    }


    $scope.refresh = function(){

    $http.post("http://razorblade.me:7070/sigatec/Siga/auth", JSON.parse(localStorage.getItem('requestBody')))
    .then(function(response){

        //$state.go("app.main");
        localStorage.setItem("loginInfo", JSON.stringify(response));
        localStorage.setItem("response", JSON.stringify(response.data));
        var sucTxt = {
            'title' : 'Sincronização',
            'template' : 'Dados atualizados com sucesso!'
          }

        $ionicPopup.alert(sucTxt);

    }, function(){//err
        var errTxt = {
            'title' : 'Sincronização',
            'template' : 'Não foi possível conectar ao servidor. Tente novamente mais tarde.'
          }

        $ionicPopup.alert(errTxt);
    })
    .finally(function(){
      $scope.$broadcast('scroll.refreshComplete');
    })};

    $scope.logout = function(){
      localStorage.clear();
      $state.go("login");
    };
})

.controller('LoginCtrl', function($scope, $http, $state, $ionicLoading, $ionicPopup){ //GradesService,

  $scope.memoLogin = { text: "Memorizar dados?", checked: true};



  $scope.login = function(loginData) {

    $ionicLoading.show();
    localStorage.clear();
    var requestBody = {
      login : loginData.username,
      password : loginData.password
    }

      //$http.post("http://104.236.204.168:7070/sigatec/Siga/auth", requestBody)
      //CORS -> proxy
      $http.post("http://razorblade.me:7070/sigatec/Siga/auth", requestBody)
      .then(function(response){ 
          console.log(response); 
          $state.go("app.main");
          localStorage.setItem("loginInfo", JSON.stringify(requestBody));
          localStorage.setItem("response", JSON.stringify(response.data)); 
        },
        function(err){ console.log(err);

          var errTxt = {};

        if(err.status === 401)//login/senha invalidos
        {
          errTxt = {
            'title' : 'Erro!',
            'template' : 'Login inválido, tente novamente.'
          }

        }else{//conexão
          errTxt = {
            'title' : 'Erro!',
            'template' : 'Não foi possível conectar ao servidor. Tente novamente mais tarde.'
          }
        };
        $ionicPopup.alert(errTxt);
      })
      .finally(function(){
        $ionicLoading.hide();
      })
    }
  })

.controller('MainCtrl', function($scope, $state, $ionicPopup){

  $scope.logout = function(){
      //localStorage.clear();
      $state.go("login");
    };

    $scope.showGrades = function(disciplina) {

      console.log("chamada - showGrades()");

      if (disciplina.nome === "Estágio Supervisionado" || disciplina.nome === "Trabalho de Graduação") {
        var errTxt = {
          'title' : 'Erro!',
          'template' : 'Não existem informações sobre a disciplina selecionada.'
        };
        $ionicPopup.alert(errTxt);
      }else{
        localStorage.setItem("detailContainer", JSON.stringify(disciplina));
        $state.go("app.details");
      };

    };

    var conteudo  = JSON.parse(localStorage.getItem("response"));
    $scope.aluno = conteudo.aluno;
    $scope.disciplinas = conteudo.disciplinas;

  })

.controller('DetailsCtrl', function($scope, $state){

  function plot(){
    $scope.series = ['Series A', 'Series B'];
    var ctx = document.getElementById("line");



    var config = {
      type: 'line',
      
      data: {
        labels: [],
        datasets: [{
          label: 'Nota',
          data: [],
          pointStyle: "circle",
          borderColor: "#002966"
          // backgroundColor: "#99c2ff"
        },
        {
          label: 'Média',
          data: [6,6,6],
          steppedLine: "true",
          borderColor: "#F00"
          // backgroundColor: "#FFCCCC"

        }
        // {
        //   labels: ["bottom"],
        //   data: [0]

        // }
        ]
      },
      options: {
        // title:{
        //     display: true,
        //     text: 'Notas Parciais'
        // },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    };



    for (var i = 0; i < $scope.detalhes.notas.length; i++) {
      config.data.datasets[0].data[i] = $scope.detalhes.notas[i].nota;
      config.data.labels[i] = $scope.detalhes.notas[i].nome;
    };

    $scope.myChart = new Chart(ctx, config);

  };


  console.log("início da view Detalhes");

  $scope.detalhes = JSON.parse(localStorage.getItem("detailContainer"));

  $scope.detalhes.notas[0].nota = 7;
  $scope.detalhes.notas[1].nota = 8;
  $scope.detalhes.notas[2].nota = 2;
  console.log($scope.detalhes);

  plot();


  })




;
