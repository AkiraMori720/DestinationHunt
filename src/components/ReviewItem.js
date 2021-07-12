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
  Alert,
  Button
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';
import StarRating from 'react-native-star-rating';
import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();

import { Colors, Images, Constants } from '@constants';

export default function ReviewItem({ item, onAcceptPress, onReportPress }) {

    const [status, setStatus] = useState(item.status);
    const [rating, setRating] = useState(item.type === 'business' ? item.bRating : item.sRating);
    const [desc, setDesc] = useState(item.type === 'business' ? item.bDesc : item.sDesc);
    
    
    const getReviewUser = (id) => {
      let reviewUser = Constants.users.find((each) => each.id == id);
      return reviewUser;
    }

    const [reviewUser, setReviewUser] = useState(getReviewUser(item.uid));

  return (
    <View style={styles.container}>
      {
        status === 'ready' &&
        <>
          <View style={styles.topLine}>
            <Image style={styles.img} source={reviewUser?.img ? { uri: reviewUser.img } : Images.profileImg} />
            <Text style={styles.title}>{reviewUser.name}</Text>
            <TouchableOpacity onPress={onAcceptPress}>
              <Text style={styles.buttonStyle}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onReportPress}>
              <Text style={styles.buttonStyle2}>Report</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomLine}>
            <Text style={styles.desc} ellipsizeMode='tail'>{desc}</Text>
            <View style={styles.rating}>
                <StarRating
                  starSize={15}
                  fullStarColor={Colors.yellowToneColor}
                  disabled={true}
                  maxStars={5}
                  rating={rating}
                  selectedStar={(rating) => { }}
                />
                <Text style={styles.ratingTxt}>{rating.toFixed(1)}</Text>
                <Text style={styles.type}>{item.type}</Text>
            </View>
          </View>
        </>
      }
      {
        status !== 'ready' &&
        <>
          <View style={styles.topLine}>
            <Image style={styles.img} source={reviewUser?.img ? { uri: reviewUser.img } : Images.profileImg} />
            <Text style={styles.title2}>{reviewUser.name}</Text>
            <Text style={styles.status}>{status === 'accepted' ? 'ACCEPTED' : 'REPORTED'}</Text>
          </View>
          <View style={styles.bottomLine}>
            <Text style={styles.desc} ellipsizeMode='tail'>{desc}</Text>
            <View style={styles.rating}>
                <StarRating
                  starSize={15}
                  fullStarColor={Colors.yellowToneColor}
                  disabled={true}
                  maxStars={5}
                  rating={rating}
                  selectedStar={(rating) => { }}
                />
                <Text style={styles.ratingTxt}>{rating?.toFixed(1)}</Text>
                <Text style={styles.type}>{item.type}</Text>
            </View>
          </View>
        </>
      }
    </View>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: '95%',
    height: normalize(100, 'height'),
    backgroundColor: Colors.whiteColor,
    alignSelf: 'center',
    marginBottom: normalize(15, 'height'),
    borderRadius: normalize(10),
    padding: normalize(15),
  },
  topLine: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  img: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(25),
    resizeMode:'contain',
  },
  title: {
    width: '42%',
    fontSize: RFPercentage(2.5),
    fontWeight: '600',
    color: Colors.blueTitleColor,
    marginLeft: normalize(10)
  },
  title2: {
    width: '53%',
    fontSize: RFPercentage(2.5),
    fontWeight: '600',
    color: Colors.blueTitleColor,
    marginLeft: normalize(10)
  },
  icon: {
    fontSize: RFPercentage(3.5),
    color: Colors.yellowToneColor,
    transform: [{ scaleX: 1.5 }]
  },
  bottomLine: {
    width: '100%',
    height: '50%',
    paddingTop: normalize(5),
  },
  desc: {
    fontSize: RFPercentage(2),
    color: Colors.blackColor,
  },
  buttonStyle:{
    fontSize: RFPercentage(2.3),
    fontWeight: '600',
    color: Colors.whiteColor,
    backgroundColor:Colors.blue_button,
    marginLeft: normalize(10),
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
    paddingTop:normalize(5),
    paddingBottom: normalize(10),
    borderRadius:normalize(5),
  },
  buttonStyle2:{
    fontSize: RFPercentage(2.3),
    fontWeight: '600',
    color: Colors.whiteColor,
    backgroundColor:Colors.appRedColor,
    marginLeft: normalize(10),
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
    paddingTop:normalize(5),
    paddingBottom: normalize(10),
    borderRadius:normalize(5),
  },
  status:{
    fontSize: RFPercentage(2.3),
    fontWeight: '800',
    color: Colors.appGreenColor,
    //backgroundColor:Colors.yellow,
    marginLeft: normalize(10),
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
    paddingTop:normalize(5),
    paddingBottom: normalize(5),
    borderRadius:normalize(7),
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingTxt: {
    fontSize: RFPercentage(2),
    color: Colors.blackColor,
    marginLeft: normalize(10),
    marginRight: normalize(20),
  },
  type:{
    marginLeft: normalize(30),
    fontSize: RFPercentage(2.4),
  }
});