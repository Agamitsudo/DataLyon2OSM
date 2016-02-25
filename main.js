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

	   if ($("#setData option:selected").val() == 0)
	   {
		   $('#iframe').empty();
	      $('#iframetitle').empty();	
		   $('#osm').empty();	
		   $('#osmtitle').empty();	
		   return;
	   }

	   var element;
	   for(var i=0;i<mydata.length; i++){
		    if (mydata[i].id == $("#setData option:selected").val())
		    {
		    	element = mydata[i];
			break;
		    }
	   }

	   var iframe_map = '<br><iframe width="600px" height="300px" frameBorder="0" src="https://umap.openstreetmap.fr/fr/map/datalyon2osm_72010?datalayers=' +  $("#setData option:selected").val() + '&scaleControl=false&miniMap=true&scrollWheelZoom=false&zoomControl=true&allowEdit=false&moreControl=false&datalayersControl=false&onLoadPanel=undefined&captionBar=false"></iframe>';
	   $('#iframe').empty();
	   $('#iframetitle').empty();
	   $('#iframetitle').append("<h1>1. Affichage des trente premiers éléments</h1>");	
 	   $('#iframe').append(iframe_map);
	   $('#iframe').append('<p><a href="' + element.url + '" target="_blank">Descriptif du jeu de données</a></p>');

	   $('#osm').empty();	
	   $('#osmtitle').empty();
	   $('#osmtitle').append("<h1>2. Génération d'un fichier .osm</h1>");
      $('#osmtitle').append("<label>Générer le fichier .osm pour l'ensemble des données disponibles </label><button id='gen'>Générer</button><br/>");
	   
	   /*
	   $('#osmtitle').append("<select id='maxfeatures' /><br><br>");
	   $('#maxfeatures').hide().fadeIn(500);
	   $('#maxfeatures').append($('<option>', {
	    		value: "30",
	    		text: "les 30 éléments"
	   }));
	   $('#maxfeatures').append($('<option>', {
	    		value: "100",
	    		text: "les 100 éléments"
	   }));
	   $('#maxfeatures').append($('<option>', {
	    		value: "0",
	    		text: "tous les éléments"
	   }));
	   */
	   $('#gen').click(function() {

		   $("#setData").attr("disabled", true); 
		   $("#gen").attr("disabled", true); 
		   $("#maxfeatures").attr("disabled", true);

		   $('#iframe').empty();
	           $('#iframetitle').empty();	
		   $('#osm').empty();	

		   var myurlsample = element.sample;
		   //if ($("#maxfeatures option:selected").val() != "0")
		   //	myurlsample += "&maxfeatures=" + $("#maxfeatures option:selected").val();	
		  
		   $.getJSON( myurlsample, function(data) {
			   
		           /*	
			   var table = $('<table></table>');
			   var row = $('<tr></tr>');
			   var rowdata = "<td>propriété json</td><td>exemple de valorisation</td><td>correspondance osm</td><td>notes</td>";
			   row.append(rowdata);
			   table.append(row);

			   $.each( data.features[0].properties, function(key, val) {
			      	   row = $('<tr></tr>');		
		    	      	   rowdata = "<td>" + key + "</td><td>" + val + "</td><td><input type='text' size='50' id='" + key + "'></td><td>...</td>";
				   row.append(rowdata);		
				   table.append(row);	
			   }); 
			   $('#osm').append(table);
			   */

			   // Point / LineString / Polygon ?
			   // "geometry": { "type": "Point", "coordinates": [ 4.845192520164354, 45.750263873691459 ] } },
			   // "geometry": { "type": "LineString", "coordinates": [ [ 4.913027724848727, 45.670199714539663 ], 
			   // "Polygon", "coordinates": [ [ [ 4.790407945472112, 45.869014690473236 ], [ 4.789913246646215, 45.869051348990531 ]
			   var type = data.features[0].geometry.type;
			   var promise = $.getJSON(element.sample);

			   promise.done(function(data) {

				if (type == "Point")
	                        {
					var cmp = 1;

				        var input = '<?xml version="1.0" encoding="UTF-8"?>\r\n';
				        input += '<osm version="0.6" upload="true" generator="JOSM">\r\n';
				
	 				for(var i=0;i<data.features.length; i++){	
					
						input += '<node action="modify" visible="true" id="-'  + cmp.toString() + '" lat="' + data.features[i].geometry.coordinates[0] + '" lon="' + data.features[i].geometry.coordinates[1] + '">\r\n';
					
						cmp++;

						$.each( data.features[i].properties, function(key, val) {
							var myval = val.replace(/>/g, "+");
							var myval = myval.replace(/&/g, "et");
							var myval = myval.replace(/</g, "-");
							var myval = myval.replace(/"/g, "");

							input += '<tag k="' + key + '" v="' + myval + '"/>\r\n';
						}); 
						input += "</node>\r\n";
					}
					input += '</osm>\r\n';
					input = input.replace(/&/g, "et");

				   	$("#setData").attr("disabled", false); 
	  				$("#gen").attr("disabled", false); 
					$('#osmtitle').append("<label>" + data.features.length.toString() + " éléments traités </label><button id='btn-save'>Téléchargez le fichier .osm</button><br/><br/>");
					
					$("#btn-save").click( function() {
					
					  var text = input;
					  var filename = "output";
					  var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
					  saveAs(blob, filename+".osm");
					});
			   }
			   else if (type == "LineString" || type == "MultiLineString")
			   {
					var cmpNode = 1;

				        var input = '<?xml version="1.0" encoding="UTF-8"?>\r\n';
				        input += '<osm version="0.6" upload="true" generator="JOSM">\r\n';
				
	 				for(var i=0;i<data.features.length; i++){// line after line

						if (data.features[i].geometry.type == "LineString")
						{
							// nodes
							for(var j=0;j<data.features[i].geometry.coordinates.length; j++){
							
								input += '<node visible="true" id="-'  + cmpNode.toString() + '" lat="' + data.features[i].geometry.coordinates[j][0] + '" lon="' + data.features[i].geometry.coordinates[j][1] + '">\r\n';
								input += "</node>\r\n";
								cmpNode++;	
							} 
							// way
							input += '<way visible="true" id="-'  + cmpNode.toString() + '">\r\n';
								
							var maxNodeId = cmpNode - 1;					
							var minNodeId = cmpNode - data.features[i].geometry.coordinates.length;

							for(var u=minNodeId;u<=maxNodeId; u++){
								input += "<nd ref='-" + u + "' />\r\n";
							}
		
							// tags
							$.each( data.features[i].properties, function(key, val) {
		
								var myval = val.replace(/>/g, "+");
								var myval = myval.replace(/</g, "-");
								var myval = myval.replace(/"/g, "");
								input += '<tag k="' + key + '" v="' + myval + '"/>\r\n';
							});
							input += '</way>\r\n';
						}
						else if (data.features[i].geometry.type == "MultiLineString")
						{
							for(var j=0;j<data.features[i].geometry.coordinates.length; j++){
							
								// nodes
								for(var z=0;z<data.features[i].geometry.coordinates[j].length; z++){
								
									input += '<node visible="true" id="-'  + cmpNode.toString() + '" lat="' + data.features[i].geometry.coordinates[j][z][0] + '" lon="' + data.features[i].geometry.coordinates[j][z][1] + '">\r\n';
									input += "</node>\r\n";
									cmpNode++;
								}
								// way
								input += '<way visible="true" id="-'  + cmpNode.toString() + '">\r\n';
								
								var maxNodeId = cmpNode - 1;					
								var minNodeId = cmpNode - data.features[i].geometry.coordinates[j].length;

								for(var u=minNodeId;u<=maxNodeId; u++){
									input += "<nd ref='-" + u + "' />\r\n";
								}
		
								// tags
								$.each( data.features[i].properties, function(key, val) {
			
									var myval = val.replace(/>/g, "+");
									var myval = myval.replace(/&/g, "et");
									var myval = myval.replace(/</g, "-");
									var myval = myval.replace(/"/g, "");
									input += '<tag k="' + key + '" v="' + myval + '"/>\r\n';
								});
								input += '</way>\r\n';
							}
						}
					}
					input += '</osm>\r\n';
					input = input.replace(/&/g, "et");

				   	$("#setData").attr("disabled", false); 
	  				$("#gen").attr("disabled", false); 
					//$("#maxfeatures").attr("disabled", false);
 
					$('#osm').append("<label>" + data.features.length.toString() + " éléments traités </label><button id='btn-save'>Téléchargez le fichier .osm</button><br/><br/>");
					
					$("#btn-save").click( function() {
					
					  var text = input;
					  var filename = "output";
					  var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
					  saveAs(blob, filename+".osm");
					});
		           }
      	   else if (type == "Polygon")
			   {
				
					var cmpNode = 1;

				        var input = '<?xml version="1.0" encoding="UTF-8"?>\r\n';
				        input += '<osm version="0.6" upload="true" generator="JOSM">\r\n';
				
	 				for(var i=0;i<data.features.length; i++){// line after line

						for(var j=0;j<data.features[i].geometry.coordinates.length; j++){
							
							// nodes
							for(var z=0;z<data.features[i].geometry.coordinates[j].length; z++){
			
								input += '<node visible="true" id="-'  + cmpNode.toString() + '" lat="' + data.features[i].geometry.coordinates[j][z][0] + '" lon="' + data.features[i].geometry.coordinates[j][z][1] + '">\r\n';
								input += "</node>\r\n";
								cmpNode++;
							}
							// way
							input += '<way visible="true" id="-'  + cmpNode.toString() + '">\r\n';
								
							var maxNodeId = cmpNode - 1;					
							var minNodeId = cmpNode - data.features[i].geometry.coordinates[j].length;

							for(var u=minNodeId;u<=maxNodeId; u++){
								input += "<nd ref='-" + u + "' />\r\n";
							}
							input += "<nd ref='-" + minNodeId + "' />\r\n";// we loop on the first point.

							// tags
							$.each( data.features[i].properties, function(key, val) {
			
								var myval = val.replace(/>/g, "+");
								var myval = myval.replace(/&/g, "et");
								var myval = myval.replace(/</g, "-");
								var myval = myval.replace(/"/g, "");
								input += '<tag k="' + key + '" v="' + myval + '"/>\r\n';
							});
							input += '</way>\r\n';
						}
					}
					input += '</osm>\r\n';
					input = input.replace(/&/g, "et");

				   	$("#setData").attr("disabled", false); 
	  				$("#gen").attr("disabled", false); 
	 
					$('#osm').append("<label>" + data.features.length.toString() + " éléments traités </label><button id='btn-save'>Téléchargez le fichier .osm</button><br/><br/>");
					
					$("#btn-save").click( function() {
				
					  var text = input;
					  var filename = "output";
					  var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
					  saveAs(blob, filename+".osm");
					});
		        }
              else if (type == "MultiPolygon")
			     {
					   var cmpNode = 1;

				      var input = '<?xml version="1.0" encoding="UTF-8"?>\r\n';
				      input += '<osm version="0.6" upload="true" generator="JOSM">\r\n';
				
	    				for(var i=0;i<data.features.length; i++){// line after line

						   for(var j=0;j<data.features[i].geometry.coordinates.length; j++){
							

							   for(var z=0;z<data.features[i].geometry.coordinates[j].length; z++){

                           var minNodeId = cmpNode;
                           var maxNodeId = cmpNode;
                           
                           for(var k=0;k<data.features[i].geometry.coordinates[j][z].length; k++){
			
   								   input += '<node visible="true" id="-'  + cmpNode.toString() + '" lat="' + data.features[i].geometry.coordinates[j][z][k][0] + '" lon="' + data.features[i].geometry.coordinates[j][z][k][1] + '">\r\n';
   								   input += "</node>\r\n";
   								   maxNodeId = cmpNode;   
   								   cmpNode++;
   							   }
   							   
							      // way
							      input += '<way visible="true" id="-'  + cmpNode.toString() + '">\r\n';
								                               
                           cmpNode++;
                           
							      for(var u=minNodeId;u<maxNodeId; u++){
								      input += "<nd ref='-" + u + "' />\r\n";
							      }
							      input += "<nd ref='-" + minNodeId + "' />\r\n";// we loop on the first point.

							      // tags
							      $.each( data.features[i].properties, function(key, val) {
			
								      var myval = val.replace(/>/g, "+");
								      var myval = myval.replace(/&/g, "et");
								      var myval = myval.replace(/</g, "-");
								      var myval = myval.replace(/"/g, "");
								      input += '<tag k="' + key + '" v="' + myval + '"/>\r\n';
							      });
							      input += '</way>\r\n';   							   
   							   
						      }
					      }
					   }
					   input += '</osm>\r\n';
					   input = input.replace(/&/g, "et");

				      $("#setData").attr("disabled", false); 
	        			$("#gen").attr("disabled", false); 
	       
					   $('#osm').append("<label>" + data.features.length.toString() + " éléments traités </label><button id='btn-save'>Téléchargez le fichier .osm</button><br/><br/>");
					
					   $("#btn-save").click( function() {
				
					   var text = input;
					   var filename = "output";
					   var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
					        saveAs(blob, filename+".osm");
					   });	
				   }	// else if (type == "MultiPolygon")        
         });
		});
	  });
    });
});
