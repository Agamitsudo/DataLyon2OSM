$(document).ready(function() {
		
        $('#main').append("<select id='setData' /><br><br>");
  	$('#main').hide().fadeIn(500);

	var mydata = new Array();

	$.getJSON( "http://agamitsudo.ovh/DataLyon2OSM/data.json", function(data) {
		for(var i=0;i<data.length; i++){
		    $('#setData').append($('<option>', {
	    		value: data[i].id,
	    		text: data[i].name
		    }));	
		mydata.push(data[i]);		
		}
   	   });
	
	//
	// setData change
	//
	$("#setData").change(function() {

	   var element;
	   for(var i=0;i<mydata.length; i++){
		    if (mydata[i].id == $("#setData option:selected").val())
		    {
		    	element = mydata[i];
			break;
		    }
	   }

	   var iframe_map = '<br><iframe width="600px" height="400px" frameBorder="0" src="https://umap.openstreetmap.fr/fr/map/datalyon2osm_72010?datalayers=' +  $("#setData option:selected").val() + '&scaleControl=false&miniMap=true&scrollWheelZoom=false&zoomControl=true&allowEdit=false&moreControl=false&datalayersControl=false&onLoadPanel=undefined&captionBar=false"></iframe><p><a href="https://umap.openstreetmap.fr/fr/map/datalyon2osm_71781" target="_blank">Voir en plein écran</a></p>';

	   $('#iframe').empty();
 	   $('#iframe').append(iframe_map);
	   $('#iframe').append('<p><a href="' + element.url + '" target="_blank">Descriptif du jeu de données</a></p>');

	   $('#gpx').empty();	
		
           $.getJSON( element.sample, function(data) {

		
		   var table = $('<table></table>');
		   var row = $('<tr></tr>');
		   var rowdata = "<td>propriété json</td><td>exemple de valorisation</td><td>correspondance gpx</td>";
		   row.append(rowdata);
		   table.append(row);

		   $.each( data.features[0].properties, function(key, val) {
		      	   row = $('<tr></tr>');		
	    	      	   rowdata = "<td>" + key + "</td><td>" + val + "</td><td><input type='text' size='150' id='" + key + "'></td>";
		           row.append(rowdata);		
			   table.append(row);	
		   }); 
		   $('#gpx').append(table);
        });
    });
});
