var cnpAppModule = angular.module('cnpApp', ['ui.bootstrap']);

cnpAppModule.factory('cnp_generator', function(counties){
  return function(date_of_birth, county, gender){
    var year, month;
    
    var get_gender = function(){
      //foreign persons residency not implementd
      if(!gender){
        gender = random_int(1,2) == 1 ? 'm' : 'f';
      }

      if(gender == 'm'){
        return gender_code_based_on_year_of_birth([1,5]);
      }

      return gender_code_based_on_year_of_birth([2,6]);
    }

    var gender_code_based_on_year_of_birth = function(gender_code){
      if(full_year() < 2000){
        return gender_code[0]
      }
      return gender_code[1]
    }

    var full_year = function(no_random){
      if(year && no_random){
        return year;
      }

      if(date_of_birth){
        year = date_of_birth.getFullYear();
      } else{
        year = random_int(1914,2014);
      }

      return year;
    }

    var get_year = function(no_random){
      return full_year(no_random).toString().slice(-2);
    }

    var get_month = function(no_random){
      if(month && no_random){
        return month;
      }

      if(date_of_birth){
        month = two_chars_number(date_of_birth.getMonth()+1)
      } else{
        month = two_chars_number(random_int(1,12))
      }

      return month;
    }

    var days_in_month = function(month, year){
      return new Date(year, month, 0).getDate();
    }

    var get_day = function(){
      if(date_of_birth){
        return two_chars_number(date_of_birth.getDate());
      }
      return two_chars_number(random_int(1,days_in_month(get_month(true), get_year(true))));
    }

    var get_county = function(){
      if(county){
        return counties[parseInt(county) - 1].cod;
      }

      var random_county = random_int(0, counties.length - 1);
      return counties[random_county].cod;
    }

    var random_int = function(min,max){
      return Math.floor(Math.random()*(max-min+1)+min);
    }

    var two_chars_number = function(nr){
      return nr<10? '0'+nr:''+nr;
    }
    var do_magic_on_first_eleven_chars = function(cnp){
      return (cnp[0] * 2 + cnp[1] * 7 + cnp[2] * 9 + cnp[3] * 1 + cnp[4] * 4 + cnp[5] * 6 + cnp[6] * 3 + cnp[7] * 5 + cnp[8] * 8 + cnp[9] * 2 +cnp[10] * 7 + cnp[11] * 9) % 11

    }

    var three_chars_before_last = function(){
      return "00" + random_int(1,9);
    }

    var cnp = get_gender() + get_year(true) + get_month() + get_day() + get_county() + three_chars_before_last();
    var cnp_arr = _.map(cnp.split(""), function(ch){return parseInt(ch)});
    var scrambled_sum = do_magic_on_first_eleven_chars(cnp_arr);

    if(scrambled_sum<10){
      cnp+=scrambled_sum;
    } else {
      cnp+=1;
    }

    return cnp;
  }
});

cnpAppModule.provider('counties', function(){
  this.$get = function(){
    return [
      {judet:"Alba", cod:'01'},
      {judet:"Arad", cod:'02'},
      {judet:"Argeș", cod:'03'},
      {judet:"Bacău", cod:'04'},
      {judet:"Bihor", cod:'05'},
      {judet:"Bistrița-Năsăud", cod:'06'},
      {judet:"Botoșani", cod:'07'},
      {judet:"Brașov", cod:'08'},
      {judet:"Brăila", cod:'09'},
      {judet:"Buzău", cod:'10'},
      {judet:"Caraș-Severin", cod:'11'},
      {judet:"Cluj", cod:'12'},
      {judet:"Constanța", cod:'13'},
      {judet:"Covasna", cod:'14'},
      {judet:"Dâmbovița", cod:'15'},
      {judet:"Dolj", cod:'16'},
      {judet:"Galați", cod:'17'},
      {judet:"Gorj", cod:'18'},
      {judet:"Harghita", cod:'19'},
      {judet:"Hunedoara", cod:'20'},
      {judet:"Ialomița", cod:'21'},
      {judet:"Iași", cod:'22'},
      {judet:"Ilfov", cod:'23'},
      {judet:"Maramureș", cod:'24'},
      {judet:"Mehedinți", cod:'25'},
      {judet:"Mureș", cod:'26'},
      {judet:"Neamț", cod:'27'},
      {judet:"Olt", cod:'28'},
      {judet:"Prahova", cod:'29'},
      {judet:"Satu Mare", cod:'30'},
      {judet:"Sălaj", cod:'31'},
      {judet:"Sibiu", cod:'32'},
      {judet:"Suceava", cod:'33'},
      {judet:"Teleorman", cod:'34'},
      {judet:"Timiș", cod:'35'},
      {judet:"Tulcea", cod:'36'},
      {judet:"Vaslui", cod:'37'},
      {judet:"Vâlcea", cod:'38'},
      {judet:"Vrancea", cod:'39'},
      {judet:"București", cod:'40'},
      {judet:"București S.1", cod:'41'},
      {judet:"București S.2", cod:'42'},
      {judet:"București S.3", cod:'43'},
      {judet:"București S.4", cod:'44'},
      {judet:"București S.5", cod:'45'},
      {judet:"București S.6", cod:'46'},
      {judet:"Călărași", cod:'51'},
      {judet:"Giurgiu", cod:'52'}
    ];
  }
})

cnpAppModule.controller('CnpCtrl', function($scope, cnp_generator, counties){
  $scope.display_alert = false;
  $scope.display_options = false;
  $scope.counties = counties

  $scope.generateCNP = function(){
    $scope.cnp = cnp_generator($scope.date_of_birth, $scope.county, $scope.gender);
    $scope.display_alert = true;
  }

  $scope.toggleOptions = function (){
    $scope.display_options = !$scope.display_options;
  }

  $scope.hideAlert = function (){
    $scope.display_alert = false;
  }

  /*Calendar settings*/
  $scope.clear = function () {
    $scope.date_of_birth = null;
  };

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1
  };

  $scope.format = 'dd-MM-yyyy';
})
