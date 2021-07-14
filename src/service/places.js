/* eslint-disable prettier/prettier */
import React from 'react';
import {
  ActivityIndicator,
} from 'react-native';
import { getDistance, getPreciseDistance } from 'geolib';
import { Colors, Images, Constants } from '@constants';

const googleApiKey = 'AIzaSyAt4gxuUq7O8ThY2ZM1gdkh6OzyaLOfhkg';
const language = 'en';

const getDistanceMile = (location, orgLocation) => {
    let myLocation = (orgLocation.latitude && orgLocation.longitude) ? orgLocation : Constants.user?.location;
    if (!location || !myLocation){
        return 0;
    }

    let item = {latitude:location?.lat, longitude:location?.lng};

    if ((!myLocation?.latitude || !myLocation?.longitude) ||
      (!item?.latitude || !item?.longitude)) {
      return 0;
    }
    else {
      if (!myLocation) return 0;
      var distance = getDistance(myLocation, item);
      var distanceMile = distance / 1000 / 1.6;
      return distanceMile.toFixed(2);
    }
  }

const analyzeStayPlaces = async(results, location) => {
    let places = [];
    for (let element of results){
        if (element.rating && element.photos && element.business_status === 'OPERATIONAL'){
            /* const imgUrl = await fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=360
                &photoreference=${element.photos[0].photo_reference}
                &key=${googleApiKey}`)
                .then(response => response.url); */
                const imgUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=360
                &photoreference=${element.photos[0].photo_reference}
                &key=${googleApiKey}`;
                const iconUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=80
                &photoreference=${element.photos[0].photo_reference}
                &key=${googleApiKey}`;
            places.push({
                name: element.name,
                icon: imgUrl,
                address: element.formatted_address ? element.formatted_address : element.vicinity,
                img: imgUrl,
                desc:'Good accommodation and service in town now!',
                reviews: element.user_ratings_total,
                rating: element.rating,
                distance: getDistanceMile(element.geometry?.location, location),
                properties:[
                    {
                        id:1,
                        name:'Wifi available',
                        imageService:Images.ic_wifi,
                    },
                    {
                        id:3,
                        name:element.website ? element.website[0] : '  -',
                        imageService:Images.ic_world,
                    },
                    {
                        id:4,
                        name:'TV',
                        imageService:Images.ic_tv,
                    },
                    {
                        id:6,
                        name: element.formatted_phone_number ? element.formatted_phone_number : '  -',
                        imageService:Images.ic_phone,
                    },
                ],
            });
        }
    }

    return places;
}

const analyzeExplorePlaces = async(results, location) => {
    let places = [];
    for (let element of results){
        if (element.rating && element.photos && element.business_status === 'OPERATIONAL'){
                const imgUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=360
                &photoreference=${element.photos[0].photo_reference}
                &key=${googleApiKey}`;
                const iconUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=80
                &photoreference=${element.photos[0].photo_reference}
                &key=${googleApiKey}`;
            places.push({
                name: element.name,
                icon: imgUrl,
                address: element.formatted_address ? element.formatted_address : element.vicinity,
                img: imgUrl,
                desc:'Please enjoy spectacluar sights.',
                reviews: element.user_ratings_total,
                rating: element.rating,
                distance: getDistanceMile(element.geometry?.location, location),
                properties:[
                    {
                        id:'1',
                        name:'  - $',
                        imageService:Images.ic_ticket,
                    },
                    {
                        id:'2',
                        name: element.website ? element.website[0] : '  -',
                        imageService:Images.ic_world,
                    },
                    {
                        id:'3',
                        name: element.formatted_phone_number ? element.formatted_phone_number : '  -',
                        imageService:Images.ic_phone,
                    },
                ],
            });
        }
    }

    return places;
}

export const fetchStayPlaces = async (location,distance) => {
    try
    {
        const locationParam = location.latitude + ',' + location.longitude;
        const type = 'lodging';
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
            locationParam
        }&key=${
            googleApiKey
        }&radius=${
            distance
        }&types=${
            type
        }`;
        const places = await fetch(
            url
        ).then(response => response.json())
        .catch(err => console.log(err));
        let formatted_places=[];
        if (places && places?.results && places.results?.length > 0){
            formatted_places = await analyzeStayPlaces(places.results, location);
        }
        return formatted_places;
    }
    catch (err){
        console.log('On getting places, an error is occurred:',err);
        return [];
    }
};

export const fetchExplorePlaces = async (location,distance) => {
    let formatted_places = [];
    try
    {
        const locationParam = location.latitude + ',' + location.longitude;
        const types = ['tourist_attraction','museum','casino','movie_theater','stadium','zoo'];
        
        for (let type of types)
        {
            const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
                locationParam
            }&key=${
                googleApiKey
            }&radius=${
                distance
            }&types=${
                type
            }`;
            const places = await fetch(
                url
            ).then(response => response.json())
            .catch(err => console.log(err));

            if (places && places?.results && places.results?.length > 0){
                let analyzed = await analyzeExplorePlaces(places.results, location);
                if (analyzed && analyzed.length > 0){
                    for (let place of analyzed){
                        formatted_places.push(place);
                    }
                }
            }
        }
        return formatted_places;
    }
    catch (err){
        console.log('On getting places, an error is occurred:',err);
        return formatted_places;
    }
};

export const getPlaceInfo = async (id, passedPlace) => {
    const queryFields = '';
    try {
        const place = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?placeid=${id}
            &key=${googleApiKey}
            &fields=${queryFields}
            &language=${language}`
        ).then(response => response.json())
        .catch(err => console.log(err));

        return place;
    } catch (e) {
        return null;
    }
};
