import React from 'react';
import Helmet from 'react-helmet';

import { returnSanta } from 'lib/santa';

import Layout from 'components/Layout';
import Map from 'components/Map';

const LOCATION = {
  lat: 0,
  lng: 0
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 1;

const IndexPage = () => {

  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement } = {}) {
    // Prevent the rest of our code from running in the event our map isn't ready yet
    if ( !leafletElement ) return;
    // Fetch Santa’s route
    returnSanta(leafletElement);
  }

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    noWrap: true,
    mapEffect
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Santa Tracker</title>
      </Helmet>

      <Map {...mapSettings} />

    </Layout>
  );
};

export default IndexPage;
