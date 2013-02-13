(function(){
	
	var Coords = {}, finalCoords = {},
			GMap = {};
	
	GMap = {		
		map: undefined,
		marker: undefined,
		init: function () {
			var mapContainer = $( "#map-body" )[0],
					zipcode = $('#zipcode').val();
		
			GMap.map = new google.maps.Map(mapContainer, {
				disableDefaultUI: true,
				zoom: 17,
				zoomControl:true,
				 mapTypeControl: true,
				center: new google.maps.LatLng(Coords.lat, Coords.long),
				mapTypeId: google.maps.MapTypeId.ROADMAP
			});	
			
			// Display address
			GMap.geocode_latlong();
			
			// Add a marker to the map
			GMap.addMarker(
				Coords.lat,
				Coords.long,
				"Initial Position"
			);		
						
		}, // End GMap.init
		addMarker: function ( latitude, longitude, label ){  
			// Create the marker - this will automatically place it
			// on the existing Google map (that we pass-in).
			GMap.marker = new google.maps.Marker({
				map: GMap.map,
				position: new google.maps.LatLng(latitude, longitude),	
				draggable:true,
				title: (label || "")
			});

			google.maps.event.addListener(GMap.marker, 'dragend', function(evt) { 
				  
				  finalCoords.lat = evt.latLng.Ya;
				  finalCoords.long = evt.latLng.Za;
				  GMap.updateLocation();
			 });
			 
			//return( marker );
		},
		updateMarker: function ( marker, latitude, longitude, label ){
			// Update the position.
			marker.setPosition(new google.maps.LatLng(latitude, longitude));			
			GMap.map.setCenter(new google.maps.LatLng(latitude, longitude))
			// Update the title if it was provided.
			if (label) {				 
				marker.setTitle( label );				 
			}
		}, // End GMap.updateMarker
		geocode_latlong: function () {
			var latlng = new google.maps.LatLng(Coords.lat,Coords.long);
			
			// Reverse geocode lat, long to get address
			geocoder = new google.maps.Geocoder();
			// geocoder.geocode({ 'address': address }, function(results, status) {
			geocoder.geocode({ 'latLng': latlng }, function(results, status) {
			  if (status == google.maps.GeocoderStatus.OK) {
			    /*map.setCenter(results[0].geometry.location);
			    var marker = new google.maps.Marker({
				    map: map,
				    position: results[0].geometry.location
				 	});*/
					
					$('#addr').text(results[0].formatted_address);
					$('#lat').text(Coords.lat);
					$('#long').text(Coords.long);
					
				}
			});
		}, // End GMap.geocode_latlong
		geocode_zip: function (address) {
			// Reverse geocode lat, long to get address
			geocoder = new google.maps.Geocoder();
			// geocoder.geocode({ 'address': address }, function(results, status) {
			geocoder.geocode({ 'address': address }, function(results, status) {
			  if (status == google.maps.GeocoderStatus.OK) {
			    /*map.setCenter(results[0].geometry.location);
			    var marker = new google.maps.Marker({
				    map: map,
				    position: results[0].geometry.location
				 	});*/
					
					Coords.lat = results[0].geometry.location.lat();
					Coords.long = results[0].geometry.location.lng();
					
					//GMap.init();
					
					GMap.updateMarker(
								GMap.marker,
							Coords.lat,
							Coords.long,
							"Initial Position"
						);
					finalCoords={};
					GMap.updateLocation();
					
				}
			});
		}, // End GMap.geocode_zip

		updateLocation: function(){
			var locInfo = "Geocoded Coord: (" + Coords.lat + "," +  Coords.long + ") "; 
			if (typeof finalCoords.lat != "undefined"){
				locInfo += "<br>current Coord: (" + finalCoords.lat + "," +  finalCoords.long + ")"; 
			}
			$("#locInfo").html(locInfo);
		}
	} // End GMap
	
	Coords = {
		lat: 38.908066,
		long: -77.040596,
		getPos: function () {
				
				
				$('#btn-getCoords').click(function(e) {					
					var zip = $('#zipcode').val();
					var addr = '';
					
					e.preventDefault();			
					
					//$('#map-body').removeAttr('style').empty();
					
					$('#field-addr').find('input[type="text"]').each(function () {
						addr += $(this).val() + ' ';	
					});
					addr += $('#sel-state').val();

					GMap.geocode_zip(addr);								
				});
				
				$('#zipcode').keyup(function(e){
					if (e.keyCode == 13) {
						$('#btn-getCoords').click();
					}
				});
				
				
		}	// End Coords.getPos
	} // End Coords
	
	Coords.getPos();
	GMap.init();

})();