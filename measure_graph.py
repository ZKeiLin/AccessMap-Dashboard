import networkx as nx
import numpy as np
import math


def haversine_distance(origin, destination):
    '''
    Uses the haversine formula to calculate the distance between two latlon
    points.

    :param origin: A tuple of (latitude, longitude) for the first point.
    :param destination: A tuple of (latitude, longitude) for the second point.
    :return: The distance between the two points in kilometers.
    '''
    lat1, lon1 = origin
    lat2, lon2 = destination
    radius_km = 6371
    lat_dist = math.radians(lat2 - lat1)
    lon_dist = math.radians(lon2 - lon1)
    a = math.sin(lat_dist / 2) * math.sin(lat_dist / 2) \
        + math.cos(math.radians(lat1)) \
        * math.cos(math.radians(lat2)) * math.sin(lon_dist / 2) \
        * math.sin(lon_dist / 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    d = radius_km * c
    return d


def build_graph(gdf, precision=1, simplify=.05, graph=None, id_col="id"):
    '''
    Builds and a returns a graph based on a GeoDataFrame where an
    edge is stored in each row.
    Nodes are extrapolated from edges.
    Edges stored the distance between their nodes in kilometers.
    Code modelled after AccessMap's sidewalkify
    (https://github.com/AccessMap/sidewalkify.git)

    :param gdf: The GeoDataFrame storing the edges for the graph.
    :param precision: The number of decimals to which node coordinates will
    be rounded.
    :param simplify: The tolerance to which the edges will be simplified.
    :return: A networkx Graph built from the edges.
    '''
    gdf.geometry = gdf.geometry.simplify(simplify)
    g = graph
    if graph is None:
        g = nx.Graph()

    def add_edges(row, G, id_col):
        geom = row.geometry
        coords = list(geom.coords)
        start = tuple(np.round(coords[0], precision))
        end = tuple(np.round(coords[-1], precision))
        # Add edge
        edge_attr = {
            'geometry': geom,
            'distance': haversine_distance(coords[0], coords[-1])
            #'id': row.loc[id_col]
        }
        G.add_edge(start, end, **edge_attr)

    gdf.apply(add_edges, axis=1, args=[g, id_col])

    return g
