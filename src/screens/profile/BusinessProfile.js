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
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';

import { useIsFocused, DrawerActions } from '@react-navigation/native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import LinearGradient from 'react-native-linear-gradient';
import AppIntroSlider from 'react-native-app-intro-slider';
import Collapse from 'accordion-collapse-react-native/build/components/Collapse';
import CollapseHeader from 'accordion-collapse-react-native/build/components/CollapseHeader';
import CollapseBody from 'accordion-collapse-react-native/build/components/CollapseBody';

import AppHeader from '../../components/AppHeader/AppHeader';

import { Colors, Images, Constants } from '@constants';
import ReviewItem from '../../components/ReviewItem';
import { getUser, getData, setData, checkInternet  } from '../../service/firebase';
import TabBusiness from '../../components/TabComponent/TabComponent';

export default function BusinessProfileScreen({ navigation }) {

  const [profile, setProfile] = useState(Constants.user);
  const [businessItem, setBusinessItem] = useState(Constants.user.bid ? 
        Constants.business.find(item => item.id === Constants.user.bid) : null);
  const [reviews, setReviews] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const [leftTab, setLeftTab] = useState(true);
  const [middleTab, setMiddleTab] = useState(false);

  useEffect(() => {
    if (Constants.user?.id) {
      updateLocalUser();
      getReviews();
    }
  }, []);

  const onRefresh = async() => {
    if (Constants.user?.id) {
      updateLocalUser();
      getReviews();
    }
  }

  const updateLocalUser = async () => {
    await getUser(Constants.user?.id)
      .then((user) => {
        if (user) {
          Constants.user = user;
          AsyncStorage.setItem('user', JSON.stringify(user));
          setProfile(user);
          setBusinessItem(Constants.user.bid ? 
            Constants.business.find(item => item.id === Constants.user.bid) : null);
        }
      });
  }

  const getReviews = () => {
    let services = Constants.services.filter((each) => each.bid === businessItem.id);
    let sids = [];
    services.forEach(each => {
      sids.push(each.id);
    });
    let myReviews= Constants.allReviews.filter((each) => each.bid === businessItem.id || sids.includes(each.sid));
    setReviews(myReviews);
  }

  const onAcceptReview = (review) => {
    if (review.status === 'accepted') return;

    //update business rating value
    if (review.bid) {
      var bReviews = reviews.filter(each => each.status === 'accepted' && each.bid === review.bid)
      var bRating = 0;
      bReviews.forEach(each => {
        bRating += each.bRating;
      })
      // console.log(bReviews)
      
      bRating += review.bRating;
      bRating = bRating / (bReviews.length + 1);
      // console.log('brating updated', bRating)

      businessItem.rating = bRating;
      setData('business', 'update', businessItem);
    }

    //update service rating value
    if (review.sid) {
      var sReviews = reviews.filter(each => each.status === 'accepted' && each.sid == review.sid)
      var sRating = 0;
      sReviews.forEach(each => {
        sRating += each.sRating;
      });
      sRating += review.sRating;
      sRating = sRating / (sReviews.length + 1);

      var service = Constants.services.find(each => each.id == review.sid);
      service.rating = sRating;
      setData('services', 'update', service);
    }

    //update review status
    review.status = 'accepted';
    setData('reviews', 'update', review);
  }

  const onReportReview = (review) => {
    if (review.status === 'reported') return;

    review.status = 'reported';
    setData('reviews', 'update', review);

    let user = profile;
    if (!user) {
      user = JSON.parse(AsyncStorage.getItem("user"));
    }
    var report = {
      uid: user.id,
      rid: review.id,
    }
    setData('reports', 'add', report);
  }

  if (useIsFocused() && Constants.refreshFlag) {
    Constants.refreshFlag = false;
    updateLocalUser();
    getReviews();
  }

  return (
    <View style={styles.container}>
      <Spinner
        visible={spinner}
        textContent={''}
      />
      <View style={styles.header}>
        {/* <View style={styles.iconHomeContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Home', { screen: 'BusinessList' })}>
            <EntypoIcon name="home" style={styles.headerIcon}></EntypoIcon>
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTxt}>User Profile</Text>
        </View>
        <View style={styles.iconEditContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileEdit')}>
            <EntypoIcon name="new-message" style={styles.headerIcon}></EntypoIcon>
          </TouchableOpacity>
        </View> */}
        <AppHeader
              title={'Business Profile'}
              leftIconPath={Images.ic_menu}
              rightIconOnePath={Images.ic_edit}
              //onLeftIconPress={() => navigation.navigate('Home', { screen: 'BusinessList' })}
              onLeftIconPress={()=>navigation.openDrawer()}
              onRightIconPress={() => navigation.navigate('BusinessProfileEdit', {onRefresh:onRefresh})}
          />
      </View>

      <View style={styles.topImgLine}>
        <AppIntroSlider
          keyExtractor={(item, index) => index.toString()}
          data={businessItem.slideImgs.length > 0 ? businessItem.slideImgs : [businessItem.img]}
          showNextButton={false}
          showDoneButton={false}
          dotStyle={{ backgroundColor: Colors.whiteColor, marginBottom: normalize(160, 'height') }}
          activeDotStyle={{ backgroundColor: Colors.yellowToneColor, marginBottom: normalize(160, 'height') }}
          renderItem={(data) => {
            return (
              <Image style={styles.img} source={ data.item ? { uri: data.item } : null} resizeMode='stretch' />
            )
          }}
        />
        <LinearGradient style={styles.backGradient} colors={['rgba(0,0,0,0)', 'rgba(20,20,20,1)']}>
          <View style={styles.distanceAddressLine}>
            <View style={styles.addressPart}>
              <EntypoIcon name="location-pin" style={styles.labelIcon}></EntypoIcon>
              <Text style={styles.labelTxt}>{businessItem.address}</Text>
            </View>
          </View>
          {
            businessItem.site &&
            <View style={styles.urlLine}>
              <EntypoIcon name="network" style={styles.labelIcon}></EntypoIcon>
              <Text style={styles.labelTxt}>{businessItem.site}</Text>
            </View>
          }
          <View style={styles.phoneHoursLine}>
            <EntypoIcon name="phone" style={styles.labelIcon}></EntypoIcon>
            <Text style={styles.labelTxt}>{businessItem.phone}</Text>
          </View>
          <View style={styles.phoneHoursLine}>
            <EntypoIcon name="clock" style={styles.labelIcon}></EntypoIcon>
            <Text style={styles.labelTxt}>{businessItem.operatingHours.from} - {businessItem.operatingHours.to}</Text>
          </View>
        </LinearGradient>
      </View>
      <ScrollView style={styles.profileBody} scrollIndicatorInsets={{ right: 1 }}>
        {/* <View style={styles.informationHeader}>
          <Text style={styles.informationHeaderTxt}>INFORMATION</Text>
        </View>
        <View style={styles.informationBody}>
          <Text stlye={styles.informationTxt}>{businessItem.desc}</Text>
        </View>
        <View style={styles.informationHeader}>
          <Text style={styles.informationHeaderTxt}>REVIEWS</Text>
        </View>
        <View style={styles.reviewBody}>
          {
            reviews && reviews.map((each, index) =>
              <ReviewItem key={index} item={each} onPressAccept={()=>onAcceptReview(each)} onPressReport={()=>onReportReview(each)}/>
            )
          }
          {
            reviews.length === 0 &&
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTxt}>No Reviews</Text>
            </View>
          }
        </View> */}
        <Collapse style={{backgroundColor: 'white', marginBottom:5, borderRadius:5, overflow: 'hidden'}}>
          <CollapseHeader>
              <View flexDirection='row' style={{padding:10, backgroundColor:''}}>
                  <EntypoIcon name="chevron-thin-down" style1={[styles.headerIcon, { fontSize: RFPercentage(3.2), marginLeft:10 }]}></EntypoIcon>
                  <Text style={{marginLeft:5}} >Information</Text>
              </View>
          </CollapseHeader>
          <CollapseBody>
              <Text style={styles.informationTxt} >{businessItem.desc}</Text>
          </CollapseBody>
      </Collapse>
      <Collapse style={{backgroundColor: 'white', marginBottom:5, borderRadius:5, overflow: 'hidden'}}>
          <CollapseHeader>
              <View flexDirection='row' style={{padding:10, backgroundColor:''}}>
                  <EntypoIcon name="chevron-thin-down" style1={[styles.headerIcon, { fontSize: RFPercentage(3.2), marginLeft:10 }]}></EntypoIcon>
                  <Text style={{marginLeft:5}} >Reviews ({reviews.length})</Text>
              </View>
          </CollapseHeader>
          <CollapseBody>
          {
            reviews && reviews.map((each, index) =>
              <ReviewItem key={index} item={each} onPressAccept={()=>onAcceptReview(each)} onPressReport={()=>onReportReview(each)}/>
            )
          }
          {
            reviews.length === 0 &&
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTxt}>No Reviews</Text>
            </View>
          }
          </CollapseBody>
      </Collapse>
      </ScrollView>
    </View>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: Colors.greyWeakColor
  },
  header: {
    width: '100%',
    height: normalize(60, 'height'),
    flexDirection: 'row',
    backgroundColor: Colors.greyColor
  },
  iconHomeContainer: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconEditContainer: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerIcon: {
    fontSize: RFPercentage(3.5),
    color: Colors.whiteColor,
  },
  titleTxt: {
    fontSize: RFPercentage(3.5),
    fontWeight: '600',
    color: Colors.yellowToneColor,
  },


  name: {
    fontSize: RFPercentage(3.5),
    fontWeight: '600',
    color: Colors.whiteColor,
    marginTop: normalize(20, 'height'),
  },
  addressLine: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: normalize(10, 'height'),
  },
  address: {
    fontSize: RFPercentage(2.5),
    color: Colors.whiteColor,
    marginLeft: normalize(10)
  },

  favoritesHeader: {
    width: '100%',
    height: '8%',
    backgroundColor: Colors.gold,
    justifyContent: 'center',
    alignItems: 'center'
  },
  favoritesHeaderTxt: {
    fontSize: RFPercentage(3),
    fontWeight: '600',
    color: Colors.whiteColor
  },
  favoritesBody: {
    width: '100%',
    maxHeight: normalize(250, 'height'),
    marginTop: normalize(15, 'height')
  },

  emptyContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor:Colors.whiteColor,
    borderRadius:normalize(10),
    marginTop: normalize(80, 'height')
  },
  emptyTxt: {
    fontSize: RFPercentage(2.2),
    fontWeight: '600',
    color: Colors.blackColor
  },


  topImgLine: {
    width: '100%',
    height: '35%',
  },
  img: {
    width: '100%',
    height: '100%'
  },
  backGradient: {
    width: '100%',
    height: normalize(120, 'height'),
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  distanceAddressLine: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: normalize(10, 'height'),
  },
  distancePart: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  addressPart: {
    maxWidth: normalize(230),
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: normalize(10),
  },
  labelIcon: {
    fontSize: RFPercentage(2),
    color: Colors.whiteColor,
    marginLeft: normalize(10)
  },
  labelTxt: {
    fontSize: RFPercentage(2),
    color: Colors.greyWeakColor,
    marginLeft: normalize(5)
  },
  urlLine: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(10, 'height')
  },
  phoneHoursLine: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabsView:{
    width:'100%',
    backgroundColor:Colors.black,
  },
  informationHeader:{
    marginLeft:'2.5%',
    marginTop:normalize(20),
    marginBottom:normalize(5),
  },
  informationHeaderTxt:{
    fontSize: RFPercentage(2.2),
    color: Colors.blackColor,
    marginLeft: normalize(5),
  },
  informationBody:{
    width:'95%',
    backgroundColor: Colors.whiteColor,
    alignSelf: 'center',
    marginBottom: normalize(15, 'height'),
    borderRadius: normalize(10),
    padding: normalize(15),
  },
  informationTxt:{
    fontSize: RFPercentage(2),
    color: Colors.blackColor,
    marginLeft: normalize(5),
    padding: normalize(10),
  },
  reviewBody:{
    marginBottom: normalize(30),
  },
});