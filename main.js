$(document).ready(function() {
		
        $('#main').append("<select id='setData' /><br><br>");
  	$('#main').hide().fadeIn(500);

	var maps = {
		"Sélectionnez un jeu de données": "0",
		"Stations Vélov (disponibilité temps réel)":"165923",
  		"Aménagement cyclable": "165928"
	};

	$.each(maps, function( key, value ) {

		$('#setData').append($('<option>', {
    			value: value,
    			text: key
		}));	
	});

	$("#setData").change(function() {


	var iframe_map = '<iframe width="100%" height="50%" frameBorder="0" src="https://umap.openstreetmap.fr/fr/map/datalyon2osm_71781?datalayers=' +  $("#setData option:selected").val() + '&scaleControl=false&miniMap=false&scrollWheelZoom=false&zoomControl=true&allowEdit=false&moreControl=true&datalayersControl=true&onLoadPanel=undefined&captionBar=false"></iframe><p><a href="https://umap.openstreetmap.fr/fr/map/datalyon2osm_71781">Voir en plein écran</a></p>';

	//alert (iframe_map);

	   $('#iframe').empty();
 	   $('#iframe').append(iframe_map);
	});
});
