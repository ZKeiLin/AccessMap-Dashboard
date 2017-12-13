# December 4, 2017
# Logan Young

from flask import Flask, jsonify, make_response, abort, request
import geopandas as gpd
import pandas as pd
import geojson
import json
from measure_graph import build_graph
import networkx as nx

app = Flask(__name__)

SIDEWALK_FILE = "/Users/loganyg/git/accessmap-data/cities/seattle/data/sidewalk_network.geojson"
CROSSINGS_FILE = "/Users/loganyg/git/accessmap-data/cities/seattle/data/crossing_network.geojson"

sidewalks_df = gpd.read_file(SIDEWALK_FILE)
crossings_df = gpd.read_file(CROSSINGS_FILE)
pedways_df = pd.concat([sidewalks_df, crossings_df])

@app.route('/centrality.geojson', methods=['GET'])
def centrality():
    '''
    Retrieve all of the sidewalks and crossings within the bounding box defined by (lat_1, lon_1)
    and (lat_2, lon_2). 

    :param lat_1: The latitude of the bottom left corner of the bounding box.
    :param lon_1: The longitude of the bottom left corner of the bounding box.
    :param lat_2: The latitude of the top right corner of the bounding box.
    :param lon_2: The longitude of the top right corner of the bounding box.
    :return: A geopandas dataframe of lines that are the sidewalks and crossings within the bounding
    box.
    '''
    lat_1 = float(request.args['lat_1'])
    lon_1 = float(request.args['lon_1'])
    lat_2 = float(request.args['lat_2'])
    lon_2 = float(request.args['lon_2'])
    if lat_2 < lat_1 or lon_2 < lon_1:
        abort(400)
    selected_pedways = pedways_df.cx[lon_1:lon_2, lat_1:lat_2]
    graph = build_graph(selected_pedways, precision=100)
    ebc = nx.edge_betweenness_centrality(graph, weight='distance', normalized=True)
    features = geojson.FeatureCollection([])
    for edge in ebc:
        centr = ebc[edge]
        geometry = {'type': 'LineString'}
        geometry['coordinates'] = [[edge[0][0], edge[0][1]], [edge[1][0], edge[1][1]]]
        feature = geojson.Feature()
        feature['geometry'] = geometry
        feature['properties'] = {'centrality': centr}
        features['features'].append(feature)
    return_response = jsonify(features)
    return_response.headers['Access-Control-Allow-Origin'] = '*'
    return return_response


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not Found'}), 404)


@app.errorhandler(400)
def bad_request(error):
    return make_response(jsonify({'error': 'Bad Request'}), 400)


if __name__ == '__main__':
    app.run()
