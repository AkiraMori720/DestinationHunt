/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Text,
  TextInput,
  ImageBackground,
  Alert
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';

import AppIntroSlider from 'react-native-app-intro-slider';

import { Colors, Images } from '@constants';

export default function WelcomeScreen({ navigation }) {
  const items = [
    {img: Images.background, text:'Welcome to Destination Hunt!\r\nA place for people who love spending time outdoors to hunt and explore.'},
    {img: Images.background, text:'Exclusively access the best places for hunting seasons, guidelines, permits, licensing and quick guides to plan your hunt. Find accommodations such as hotels, lodging and airBNBs.'},
    {img: Images.background, text:'Hunter guides for different States or Country may vary. Select your hunting area to see list a Hunter guides for your specific area. Information on species available, number of hunts is also available.'},
    {img: Images.background, text:'Utilize the app to search for entertainment establishments to enjoy other activities within the area outside of hunting. Suggestions for places like movie theaters, musicals, broadway shows and tourist attractions can be found in the app’s Explore function.'},
    {img: Images.background, text:'Suggestions for places like movie theaters, musicals, broadway shows and tourist attractions can be found in the app’s Explore function.'}
  ]
  return (
    <View style={styles.container}>
      {/* <View style={styles.overlay}></View> */}
      <AppIntroSlider
        keyExtractor={(item, index) => index}
        data={items}
        showNextButton={false}
        showDoneButton={false}
        dotStyle={{ backgroundColor: Colors.whiteColor, marginBottom: normalize(260, 'height') }}
        activeDotStyle={{ backgroundColor: Colors.yellowToneColor, marginBottom: normalize(260, 'height') }}
        renderItem={(data) => {
          return (
            <ImageBackground style={styles.img} source={data.item.img} resizeMode='stretch'>
              <View style={styles.logoContainer}>
                <Image style={styles.logo} source={Images.logo} />
              </View>
              <View style={styles.labelView}>
                <Text style={styles.labelTxt}>{data.item.text}</Text>
              </View>
              <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Home', {screen: 'BusinessList'})}>
                <Text style={styles.btnTxt}>CONTINUE</Text>
              </TouchableOpacity>
            </ImageBackground>
          );
        }}
      />
    </View>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: Colors.blackColor,
    width: '100%',
    height: '100%',
    opacity: 0.6
  },
  img: {
    width: '100%',
    height: '100%',
    justifyContent:'space-between',
  },
  logoContainer: {
    width: '100%',
    height: '50%',    
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '80%',
    height: '100%',
    resizeMode: 'contain',
  },
  labelView:{
    width: '100%',
    height: '25%', 
    marginBottom:normalize(20,'height'),
  },
  labelTxt: {
    width: '80%',
    fontSize: RFPercentage(2.4),
    fontWeight: "800",
    color: Colors.whiteColor,
    alignSelf: 'center',
    textAlign:'center',
  },
  btn: {
    width: '80%',
    height: normalize(45, 'height'),
    backgroundColor: Colors.yellowToneColor,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: normalize(100, 'height'),
    borderRadius: normalize(8)
  },
  btnTxt: {
    fontSize: RFPercentage(2.2),
    color: Colors.blackColor
  },
});