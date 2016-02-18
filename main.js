$(document).ready(function() {
		
        $('#main').append("<select id='setData' /><br><br>");
  	$('#main').hide().fadeIn(500);

	var url = "http:/www.agamitsudo.ovh/DataLyon2OSM/data.json";

	getJSON(url).then(function(data) {

		for(var i=0;i<data.length; i++){
		    element = data[i];
		    $('#setData').append($('<option>', {
	    		value: element.id,
	    		text: element.name
		    }));	
		}
	});

	$("#setData").change(function() {


	var iframe_map = '<br><iframe width="75%" height="75%" frameBorder="0" src="https://umap.openstreetmap.fr/fr/map/datalyon2osm_72010?datalayers=' +  $("#setData option:selected").val() + '&scaleControl=false&miniMap=true&scrollWheelZoom=false&zoomControl=true&allowEdit=false&moreControl=false&datalayersControl=false&onLoadPanel=undefined&captionBar=false"></iframe><p><a href="https://umap.openstreetmap.fr/fr/map/datalyon2osm_71781">Voir en plein écran</a></p>';

	//alert (iframe_map);

	   $('#iframe').empty();
 	   $('#iframe').append(iframe_map);
	});
});

//
// getJSON
//
var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};
