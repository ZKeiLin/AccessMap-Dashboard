# December 4, 2017
# Logan Young

from flask import Flask, jsonify, make_response, abort
import geopandas as gpd
import pandas as pd

app = Flask(__name__)

SIDEWALK_FILE = "/Users/loganyg/git/accessmap-data/cities/seattle/data/sidewalk_network.geojson"
CROSSINGS_FILE = "/Users/loganyg/git/accessmap-data/cities/seattle/data/crossing_network.geojson"

sidewalks = gpd.read_file(SIDEWALK_FILE)
crossings = gpd.read_file(CROSSINGS_FILE)
pedways = pd.concat([sidewalks, crossings])

@app.route('/sidewalks/')
def users():
    ''' Retrieve the list of every sidewalk in the dataset.'''
    return sidewalks.to_json()


@app.route('/crossings/')
def items():
    ''' Retrieve the list of every crossing in the dataset'''
    return crossings.to_json()


@app.route('/centrality/<lat_1>/<lon_1>/<lat_2>/<lon_2>')
def user_recs(lat_1, lon_1, lat_2, lon_2):
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
    lat_1 = float(lat_1)
    lon_1 = float(lon_1)
    lat_2 = float(lat_2)
    lon_2 = float(lon_2)
    if lat_2 < lat_1 or lon_2 < lon_1:
        abort(400)
    selected_pedways = pedways.cx[lon_1:lon_2, lat_1:lat_2]
    return selected_pedways.to_json()


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not Found'}), 404)


@app.errorhandler(400)
def bad_request(error):
    return make_response(jsonify({'error': 'Bad Request'}), 400)


if __name__ == '__main__':
    app.run()
