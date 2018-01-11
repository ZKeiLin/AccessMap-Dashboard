# Pedestrian Accessibility in Seattle - Dashboard Style Visualizations
Group Members: Harshitha Akkaraju, Sherry Chen, Zhiqi Lin, Logan Young

## Abstract
The focus for this quarter was to build four different interactive visualizations that explore the pedestrian accessibility in Seattle. These visualizations include pedestrian accessibility explorer, dynamic isochrone generator based on a user profile, distribution of curbramps across different districts in Seattle, and a network centrality visualizer.

## Larger Project Context
The current context of our project is that people in the community are asking all kinds of questions about the data that Access Map has right now. We hope to answer their questions by developing data visualizations to allow the users have a better understanding of accessibility status in Seattle Area. For now, each of us created a visualization that resonated with our interests.

## Group Objectives
To build four interactive data visualizations that allow the users to explore accessibility related data.
To Integrate multiple datasets together.
To learn new skills while working on this project.

### Pedestrian Accessibility Explorer
Harshitha Akkaraju

#### Objective
To create a web app that allows pedestrians to explore the accessibility of an area in various aspects. I would like to integrate datasets such as the SDOT’s incident data, SDOT’s Neighborhood dataset, and also the AccessMap’s sidewalk data. 
The webapp would generate an accessibility score based on user input. I think such scores based on different aspects of accessibility could be integrated with routing as well.

#### Functionality
- Select a time of the day you want the data for (by default, the app uses current time in the day)
- Drop a pin in the area you want to explore
- This shows a popup with a percent score that indicates the percent of incidents that were reported in a given time of the day
- Click on the 'breakdown' button to further explore the data

### Dynamic Isochrones Based On User Profiles
Sherry Chen

#### Objective
From daily experience, it is clear that the incline of Seattle streets can vary greatly from area to area. Big incline can potentially bring much inconvenient to people, especially among the populations with limited mobility, such as people using walker and wheelchair.

The purpose of this visualization is the show the user accessibility of Seattle streets based on the area they can travel in a given amount of time with certain mode of transportation. 
As more factors of streets such as street condition and furnishing are to be considered, this visualization takes street incline as the only factor that influence travel time. And the level of accessibility is directly shown in the form of isochrone.

### Distribution of Curbramps
Zhiqi Lin

#### Objective
The number of crossings without curb ramps is as twice as the crossings with curb ramps. The purpose of the visualization is to let the users find out which area in Seattle need to build more curb ramps to make the crossings more accessible.

This visualization shows the distribution of the curb ramps in Seattle area and how they vary across districts. Users are able to hover the map to gain the certain neighborhood’s name.

The cost of each curb ramp at nearly $13,100 in Seattle because of Seattle’s complex geography, so that the visualization can also which neighborhoods needs more funds on developing curb ramps.

### Network Centrality Visualization 
Logan Young

#### Objective
The main objective of my visualization was to give a dynamic way to see the
connectivity of local pedestrian networks, shown through edge betweenness centrality. I chose this goal because of its high potential for extensibility. There are many ways to expand on this visualization, such as adding walkways to the network, customizing the criteria for walkways included in the network, and how to calculate the edge centrality.

For now, however, I limited my goal to getting just the basics up and running: A working web page that displays a map of seattle, where the user can select a bounding box of walkways to use, then display the selected walkways, with each linestring colored based on its centrality.

While I was able to get a barebones implementation of this working, I faced issues in mainly two area: Speed, and accuracy. Currently, the interaction between the map and the API is almost excruciatingly slow. Additionally, I did not have time to investigate fully how accurately the graph is being constructed, and whether or not there are potential disconnects between sidewalks that should be connected. Similarly, the centrality measure currently does not take into account clustering of nodes, so the calculation will be skewed towards areas with highly concentrated groupings of nodes.
