var map = L.map('mapid').on('load', onMapLoad).setView([41.400, 2.206], 12);
//map.locate({setView: true, maxZoom: 17});
	
var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

//en el clusters almaceno todos los markers
var markers = L.markerClusterGroup();
var data_markers = [];
var dataAux;

function onMapLoad() {

	console.log("Mapa cargado");

	var selectKindFood = document.getElementById("kind_food_selector");
	var arrayFinalKindFood = ["-"];
	var option;

	$.getJSON("http://localhost/mapa/api/apiRestaurants.php", 
            function (data, textStatus, jqXHR) {
				dataAux = data;
				for(let i=0; i<data.length; i++){
					//Afegeixo el marcador a l'array
					data_markers.push(L.marker([data[i].lat, data[i].lng]));

					//Faig una serie de bucles per extreure el tipus de menjar, eliminar redundancies i afegir-ho al select
					var kindFood = data[i].kind_food;
					var arrayKindFood = kindFood.split(",");
					for(let x=0; x<arrayKindFood.length; x++){
						var existsKind = false;
						for(var z=0; z<arrayFinalKindFood.length; z++){
							if(arrayFinalKindFood[z] == arrayKindFood[x]){
								existsKind = true;
							} 
						}
						if(!existsKind){
							arrayFinalKindFood.push(arrayKindFood[x]);
						} 
					}
				}
				for(var i=1; i<arrayFinalKindFood.length; i++){
					option = document.createElement("option");
					option.text = arrayFinalKindFood[i];
					selectKindFood.add(option, i);
				}
				render_to_map(data_markers,"all");
				console.log(data);
            });

    /*
	FASE 3.1
		1) Relleno el data_markers con una petición a la api
		2) Añado de forma dinámica en el select los posibles tipos de restaurantes
		3) Llamo a la función para --> render_to_map(data_markers, 'all'); <-- para mostrar restaurantes en el mapa
	*/

}

$('#kind_food_selector').on('change', function() {
  console.log(this.value);
  render_to_map(data_markers, this.value);
});



function render_to_map(data_markers,filter){
	
	//Netejo marcadors
	markers.remove();
	markers.clearLayers();


	if(filter == "all"){//Mostrar sense filtre
		for(var i=0; i<data_markers.length; i++){
			markers.addLayer(data_markers[i]);
		}
	}else{//mostrar amb filtre
		for(var i=0; i<dataAux.length; i++){
			if(dataAux[i].kind_food.includes(filter)){
				markers.addLayer(data_markers[i]);
			}
		}
	}
	map.addLayer(markers);
	
	/*
	FASE 3.2
		1) Limpio todos los marcadores
		2) Realizo un bucle para decidir que marcadores cumplen el filtro, y los agregamos al mapa
	*/	
			
}

$(document).ready(function () {
	
	
});