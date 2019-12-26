import L from 'leaflet';

export async function returnSanta(map) {
    let route, routeJson;
    try {
      route = await fetch('https://firebasestorage.googleapis.com/v0/b/santa-tracker-firebase.appspot.com/o/route%2Fsanta_en.json?alt=media&2018b');
      routeJson = await route.json();
    } catch(e) {
      console.log(`Failed to find Santa!: ${e}`);
    }

    // Use Santa's last known location where presents were delivered
    const { destinations = [] } = routeJson || {};
    const destinationsVisited = destinations.filter( ({arrival}) => arrival < Date.now() );
    const destinationsWithPresents = destinationsVisited.filter( ({presentsDelivered}) => presentsDelivered > 0 );
    
    // Handle the case where Santa's still at the North Pole
    if ( destinationsWithPresents.lenght === 0 ) {
      const center = new L.LatLng(84.6, 168);
      const noSanta = L.marker( center, {
        icon: L.divIcon({
          className: 'icon',
          html: `<div class="icon-santa">🎅</div>`,
          iconSize: 50
        })
      });
      noSanta.addTo(map);
      noSanta.bindPopup(`Santa's still at the North Pole!`);
      noSanta.openPopup();
      return;
    }

    // Add Santa to the map

    const lastKnownDestination = destinationsWithPresents[destinationsWithPresents.length-1];

    const santaLocation = new L.LatLng( lastKnownDestination.location.lat, lastKnownDestination.location.lng );

    const santaMarker = L.marker( santaLocation, {
      icon: L.divIcon({
        className: 'icon',
        html: `<div class="icon-santa">🎅</div>`,
        iconSize: 50
      })
    });

    santaMarker.addTo(map);

    // Create a set of LatLng coordinates that make up Santa's route
    const santasRouteLatLngs = destinationsWithPresents.map( destination => {
      const { location } = destination;
      const { lat, lng } = location;
      return new L.LatLng(lat, lng);
    });

    // Utilize Leaflet's Polyline to add the route to the map
    const santasRoute = new L.Polyline( santasRouteLatLngs, {
      weight: 2,
      color: 'green',
      opacity: 1,
      fillColor: 'green',
      fillOpacity: 0.5
    });

    // Add Santa's route to the map
    santasRoute.addTo(map);
}