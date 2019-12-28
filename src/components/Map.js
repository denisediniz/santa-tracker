import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { Map as BaseMap, TileLayer, ZoomControl } from 'react-leaflet';

import { useConfigureLeaflet, useMapServices, useRefEffect } from 'hooks';
import { isDomAvailable } from 'lib/util';

const Map = ( props ) => {
  const { children, className, defaultBaseMap = 'OpenStreetMap', mapEffect, ...rest } = props;

  const mapRef = useRef();

  useConfigureLeaflet();

  useRefEffect({
    ref: mapRef,
    effect: mapEffect
  });

  const services = useMapServices({
    names: ['OpenStreetMap']
  });
  const basemap = services.find(( service ) => service.name === defaultBaseMap );

  let mapClassName = `map`;

  if ( className ) {
    mapClassName = `${mapClassName} ${className}`;
  }

  if ( !isDomAvailable()) {
    return (
      <div className={mapClassName}>
        <p className="map-loading">Loading map...</p>
      </div>
    );
  }

  const corner1 = new L.LatLng(-90, -180);
  const corner2 = new L.LatLng(90, 180);
  const maxBound = new L.LatLngBounds(corner1, corner2);

  const mapSettings = {
    className: 'map-base',
    zoomControl: false,
    maxBounds: maxBound,
    ...rest
  };

  return (
    <div className={mapClassName}>
      <BaseMap ref={mapRef} {...mapSettings}>
        { children }
        { basemap && <TileLayer {...basemap} /> }
        <ZoomControl position="bottomright" />
      </BaseMap>
    </div>
  );
};

Map.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  defaultBaseMap: PropTypes.string,
  mapEffect: PropTypes.func
};

export default Map;
