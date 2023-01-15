import React, { useEffect, useRef, useState } from 'react'

import mapboxgl from 'mapbox-gl';
import { Button } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX;




export default function Map({sightings,coords}) {
  const SelectedBirdOnExplore = useSelector(state=>state.SelectedBirdOnExplore);

  const dispatch = useDispatch()

  const mapContainer = useRef(null);
  const map = useRef(null);
  
  const [currentSightings, setCurrentSightings] = useState([])//as geojson data
  const [currentSightingsAPI, setCurrentSightingsAPI] = useState([])//as geojson data

  const [userCoords, setUserCoords] = useState(undefined) //[lng, lat]
  
  //given a list of sightings, we output a list of geoJSON points
  function convertToGeoJSON(list){ 
    if (!list || list.length==0) return {"type":"FeatureCollection","features":[]};
    const tempArr = [];
    for (let x of list) {
      const lat = x.lat;
      const lng = x.lng;
      const GeoJSON = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates":[lng,lat]
        },
        "properties":{...x}
      }
      tempArr.push(GeoJSON)
    }
    return {"type":"FeatureCollection","features":tempArr}
  }  
  //function that retrieves current location of user
  async function locateMe(){

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos)=>{
        setUserCoords([pos.coords.longitude, pos.coords.latitude])
        map.current.flyTo({
          center:[pos.coords.longitude, pos.coords.latitude],
          zoom:15
        })
      })    
    }
  }
  
  //function that, given a point, creates a popup
  function popUpCreation(point) {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();

    const popUp = new mapboxgl.Popup({closeOnClick:false})
      .setLngLat(point.geometry.coordinates)
      .setHTML(`<p>${point.properties.comName}</p>`)
      .addTo(map.current)
  }
  //function that, given a point, moves the map to focus on 
  function focusPoint(point){
    map.current.flyTo({
      center:point.geometry.coordinates,
      zoom:15
    })
  }

  //initializing the map on render
  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container:mapContainer.current, //ID of the container element
      style:'mapbox://styles/zak99/clcdg42u7002416o4vrxtxjc6',
      //if the users location is known, set center to their coords, else default location
      center: userCoords? [...userCoords] : [-0.1291664, 51.504435],
      zoom:9
    })
  }, [])
  
  // keeps track of lat, lng & zoom
  useEffect(() => {
    // if map is instantiated AND 
    // the map is being used to upload a sighting (coords), update data in parent element too
    if (!map.current || !coords) return;
    map.current.on('move',()=>{
      const center = map.current.getCenter()
      coords.setLng(center.lng)
      coords.setLat(center.lat)
    })
  }, [])

  // plots the data  
  useEffect(() => {
    // only runs if there is a current map and the locations layer does't exists
    if (!map.current) return // || map.current.getLayer('locations') || currentSightings.length<0) return;
    map.current.on('load',()=>{
      map.current.addLayer({
        id:'locations',
        type:'circle',
        source:{
          type:'geojson',
          data:currentSightings
        }
      })
      map.current.addLayer({
        id:'locations2',
        type:'circle',
        source:{
          type:'geojson',
          data:currentSightingsAPI
        },
        paint:{'circle-color': '#1aa13e'}
      })
    })
  }, [])
  
  // useEffect(() => {
  //   // only runs if there is a current map and the locations layer does't exists
  //   if (!map.current || map.current.getLayer('locations') || currentSightings.length<0) return;
  //   map.current.on('load',()=>{
  //     map.current.addLayer({
  //       id:'locations',
  //       type:'circle',
  //       source:{
  //         type:'geojson',
  //         data:currentSightings
  //       }
  //     })
  //   })
  // }, [])
  
  //handles update currentSightings state
  useEffect(() => {
    console.log(sightings)
    if (sightings){
      if (sightings[0].length > 0) {setCurrentSightings(convertToGeoJSON(sightings[0]))}
      if (sightings[1].length > 0) {setCurrentSightingsAPI(convertToGeoJSON(sightings[1]))}
    }
  }, [sightings])
  
  //handles map update in state update
  useEffect(() => {
    if (!map.current.getSource('locations')) return; //if the layer doesnt exist
    map.current.getSource('locations').setData(currentSightings)
    if (!map.current.getSource('locations2')) return; //if the layer doesnt exist
    map.current.getSource('locations2').setData(currentSightingsAPI)

  }, [currentSightings,currentSightingsAPI])


  // updates map when a bird from the list component is selected -> adds a popup
  useEffect(() => {
    console.log("sightings",sightings)
    console.log("currentSightings",currentSightings)
    if (sightings) {
      if (sightings[0] && sightings[0].length > 0 && SelectedBirdOnExplore){
        const x = sightings[0].find((bird)=>{
          return bird.id == SelectedBirdOnExplore.id
        })
        console.log(x)
        if (!x) return;
        x.geometry = {coordinates:[x.lng,x.lat]}
        focusPoint(x)
        const popUps = document.getElementsByClassName('mapboxgl-popup');
        if (popUps[0]) popUps[0].remove();
        const popUp = new mapboxgl.Popup({closeOnClick:false})
          .setLngLat(x.geometry.coordinates)
          .setHTML(`<p>${x.comName}</p>`)
          .addTo(map.current)
      }
    }
  }, [SelectedBirdOnExplore])

  //handle mapclick 
  useEffect(() => {
    map.current.on('click',(e)=>{
      const listOfPoints = map.current.queryRenderedFeatures(e.point,{layers:['locations','locations2']})
      if (listOfPoints.length < 1 || !listOfPoints) return; //Makes sure a point is actually clicked
      dispatch({type:'UPDATE_EXPLORE_BIRD',
        bird:{...listOfPoints[0].properties}})// convert data back from geoJson
      focusPoint(listOfPoints[0])
      popUpCreation(listOfPoints[0])
    })
  }, [])
  


  return (
    <>
    <div ref={mapContainer} style={{minHeight:'80vh'}}></div>
    <Button onClick={()=>{
      locateMe()}} m='10px'>
      current Location
    </Button>
    {coords.handleRecollect && 
    <Button onClick={()=>coords.handleRecollect(map.current.getCenter().lng,map.current.getCenter().lat)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
      <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
      </svg>
    </Button>
    }
    </>
  )
}