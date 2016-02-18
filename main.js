$(document).ready(function() {
		
        $('#main').append("<select id='setData' /><br><br>");
  	$('#main').hide().fadeIn(500);

	var maps = {
		"Sélectionnez un jeu de données": "0",
		"Stations Vélov (disponibilité temps réel)":"165923",
  		"Aménagement cyclable": "165928",
 		"Tronçon de la trame viaire (voies et adresses)": "166200",
		"Point d'intérêt touristique": "166231",
		"Commune du Grand Lyon (voies et adresses)":"166233"
	};

	$.each(maps, function( key, value ) {

		$('#setData').append($('<option>', {
    			value: value,
    			text: key
		}));	
	});

	$("#setData").change(function() {


	var iframe_map = '<br><iframe width="99%" height="99%" frameBorder="0" src="https://umap.openstreetmap.fr/fr/map/datalyon2osm_71781?datalayers=' +  $("#setData option:selected").val() + '&scaleControl=false&miniMap=true&scrollWheelZoom=false&zoomControl=true&allowEdit=false&moreControl=false&datalayersControl=false&onLoadPanel=undefined&captionBar=false"></iframe><p><a href="https://umap.openstreetmap.fr/fr/map/datalyon2osm_71781">Voir en plein écran</a></p>';

	//alert (iframe_map);

	   $('#iframe').empty();
 	   $('#iframe').append(iframe_map);
	});
});
