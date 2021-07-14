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
  BackHandler
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

import { useIsFocused } from '@react-navigation/native';

import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();

import { SliderPicker } from 'react-native-slider-picker';

import { Colors, Images, Constants } from '@constants';
import BusinessItem from '../../components/BusinessItem';
import StayItem from '../../components/StayItem';
import ExploreItem from '../../components/ExploreItem';
import AppHeader from '../../components/AppHeader/AppHeader';
import AppInput from '../../components/AppInput/AppInput';
import TabComponent from '../../components/TabComponent/TabComponent';

import { getData, setData } from '../../service/firebase';
import { getDistance } from 'geolib';
import { fetchPlaces,fetchStayPlaces, fetchExplorePlaces, } from '../../service/places';

export default function BusinessListScreen({ navigation }) {
  const [keyword, setKeyword] = useState('');
  const [business, setBusiness] = useState(Constants.business.filter(each => each.status === 'approved'));
  const [services, setServices] = useState(Constants.services);
  const [refresh, setRefresh] = useState(false);

  const [distanceSearch, setDistanceSearch] = useState(false);
  const [distance, setDistance] = useState(1000);

  const [categorySearch, setCategorySearch] = useState(false);
  const [categories, setCategories] = useState(Constants.categories);
  const [activeCategories, setActiveCategories] = useState([]);

  const [leftTab, setLeftTab] = useState(true);
  const [middleTab, setMiddleTab] = useState(false);
  const [rightTab, setRightTab] = useState(false);

  const [stay, setStay] = useState(Constants.stays);
  const [explore, setExplore] = useState(Constants.explore);

  // useEffect(()=>{
  //   const onBackPress = () => {
  //     return true;
  //   };
  //   BackHandler.addEventListener(
  //     'hardwareBackPress', onBackPress
  //   );

  //   return () => {
  //     BackHandler.removeEventListener(
  //       'hardwareBackPress', onBackPress
  //     );
  //   }
  // })

  Constants.mode = 'user';


  if (useIsFocused() && Constants.refreshFlag) {
    Constants.refreshFlag = false;
    getBusiness();
  }

  async function getBusiness() {
    await getData('business')
      .then((res) => {
        if (res) {
          Constants.business = res;
        }
      })
  }

  const onBusinessItem = (item) => {
    Constants.backRoute = 'Home';
    navigation.navigate('ServiceList', { businessItem: item });
  }

  const onStayItem = (item) => {

  }

  const onExploreItem = (item) => {

  }

  /////////////////////
  const onCategorySearch = (category) => {
    var aCategories = [...activeCategories];
    var index = aCategories.findIndex(each => each.id === category.id);
    if (index === -1) {
      aCategories.push(category)
    }
    else {
      aCategories.splice(index, 1);
    }
    setActiveCategories(aCategories);
  }


  const getBusinessByCategory = () => {
    if (!categorySearch) {
      var result = Constants.business.filter(each => each.status === 'approved');
      return result;
    }

    var bids = [];
    services.forEach(each => {
      if (activeCategories?.findIndex(e => e.id === each.cid) > -1) {
        bids.push(each.bid);
      }
    });

    var filtered = Constants.business.filter(each => bids.includes(each.id) && each.status === 'approved');
    return filtered;
  }
  ///////////////////
  const onDistanceSearch = (distanceValue) => {
    var filtered = getBusinessByCategory();
    filtered = getBusinessByDistance(filtered, distanceValue);
    filtered = getBusinessByKeyword(filtered, keyword);
    setBusiness(filtered);
    setDistance(distanceValue);
    console.log(filtered);
  }
  const getDistanceMile = (item) => {
    let myLocation = (Constants.location.latitude && Constants.location.longitude) ?
        Constants.location : Constants.user?.location;

    if ((!myLocation?.latitude || !myLocation?.longitude) ||
      (!item.location?.latitude || !item.location?.longitude)) {
      return 0;
    }
    else {
      if (!myLocation) return 0;
      var distance = getDistance(myLocation, item.location);
      var distanceMile = distance / 1000 / 1.6;
      return distanceMile.toFixed(2);
    }
  }
  const getBusinessByDistance = (result, distance) => {
    if (!distanceSearch) return result;
    var filtered = result.filter(each => getDistanceMile(each) < distance && each.status === 'approved');
    return filtered;
  }
  ///////////////////
  function onSearch(text) {
    var filtered = getBusinessByCategory();
    filtered = getBusinessByDistance(filtered, distance);
    filtered = getBusinessByKeyword(filtered, text);
    setBusiness(filtered);
    setKeyword(text);
  }
  const getBusinessByKeyword = (result, text) => {
    if (!text) return result;
    var filtered = result.filter(each => (each.name?.toLowerCase().includes(text.toLowerCase()) || each.address?.toLowerCase().includes(text.toLowerCase())) && each.status === 'approved');
    return filtered;
  }

  useEffect(() => {
    if (distanceSearch && categorySearch) {
      var filtered = getBusinessByCategory();
      filtered = getBusinessByDistance(filtered, distance);
      filtered = getBusinessByKeyword(filtered, keyword);
      setBusiness(filtered);
    }
    else if (!distanceSearch && !categorySearch) {
      setBusiness(Constants.business.filter(each => each.status === 'approved'));
      //setActiveCategories([]);
    }
    else if (distanceSearch && !categorySearch) {
      filtered = getBusinessByDistance(Constants.business.filter(each => each.status === 'approved'), distance);
      filtered = getBusinessByKeyword(filtered, keyword);
      setBusiness(filtered);
      //setActiveCategories([]);
      console.log('complex');
    }
    else if (!distanceSearch && categorySearch) {
      var filtered = getBusinessByCategory();
      filtered = getBusinessByKeyword(filtered, keyword);
      setBusiness(filtered);
    }

    async function fetchPlaces(){
      if (Constants.user?.location){
        if (distanceSearch && distance){
          await fetchStayPlaces(Constants.user.location, distance).then(res=> Constants.stays = res);
          await fetchExplorePlaces(Constants.user.location, distance).then(res=> Constants.explore = res);
        }
        else {
          await fetchStayPlaces(Constants.user.location, '250').then(res=> Constants.stays = res);
          await fetchExplorePlaces(Constants.user.location, '250').then(res=> Constants.explore = res);
        }
      }
    }
    fetchPlaces();

  }, [distanceSearch, categorySearch]);

  useEffect(() => {
    var filtered = getBusinessByCategory();
    filtered = getBusinessByDistance(filtered, distance);
    filtered = getBusinessByKeyword(filtered, keyword);
    setBusiness(filtered);
  }, [activeCategories]);

  const onStayPress = () => {
    let myLocation = (Constants.location.latitude && Constants.location.longitude) ?
      Constants.location : Constants.user?.location;

    if ((!myLocation?.latitude || !myLocation?.longitude)) {
      return;
    }
    if (Constants.user?.location?.latitude && Constants.user?.location?.longitude){
        myLocation.latitude = Constants.user.location.latitude;
        myLocation.longitude = Constants.user.location.longitude;
    }

  }

  const onExplorePress = () => {
    let myLocation = (Constants.location.latitude && Constants.location.longitude) ?
      Constants.location : Constants.user?.location;

    if ((!myLocation?.latitude || !myLocation?.longitude)) {
      return;
    }
    if (Constants.user?.location?.latitude && Constants.user?.location?.longitude){
        myLocation.latitude = Constants.user.location.latitude;
        myLocation.longitude = Constants.user.location.longitude;
    }

  }

  const onRefresh = () => {
    setRefresh(!refresh);
  }

  async function  showAlert() {
    Alert.alert('You should login first!', 'Going to login now?',
      [
        {
          text: 'OK', onPress: () => navigation.navigate('Auth')
        },
        {
          text: 'CANCEL', onPress: () => { }
        }
      ]
    );
  }

  return (
    <View style={styles.container} >
      <View style={styles.header}>
          <AppHeader
              title={'Destination Hunt'}
              leftIconPath={Images.ic_profile}
              rightIconOnePath={Images.ic_settings}
              rightIconTwoPath={Images.ic_comment}
              onLeftIconPress={() => {
                if (Constants.user) {
                  navigation.navigate('Profile');
                }
                else {
                  showAlert();
                }
              }}
              onRightIconPress={() => navigation.navigate('Setting')}
              onRightIconTwoPress={() => {
                if (Constants.user) {
                  navigation.navigate('Message');
                }
                else {
                  showAlert();
                }
              }}
          />
      </View>

      <View style={styles.searchOverlay}>
        <AppInput
            borderRadius={wp(7)}
            placeholder={'Search'}
            leftIconPath={Images.ic_location}
            rightIconPath={Images.ic_sort}
            borderWidth={wp(0.4)}
            backgroundColor={'transparent'}
            placeholderTextColor={Colors.white}
            paddingRight={'9%'}
            marginTop={normalize(10, 'height')}
            marginBottom={normalize(10, 'height')}
            rightIconSize={18}
            leftTintColor={distanceSearch ?  Colors.yellowToneColor : Colors.white}
            rightTintColor={categorySearch ? Colors.yellowToneColor : Colors.white}

            value={keyword}
            onChangeText={(text) => onSearch(text)}
            onLeftIconPress = {() => navigation.navigate('MapView')}
            onRightIconPress = {() => {
              setCategorySearch(!categorySearch);
              setDistanceSearch(!distanceSearch);
              }}
        />
        {
          distanceSearch &&
          <View style={styles.distanceSearchPart}>
            <SliderPicker
              minLabel={'0'}
              maxLabel={'3000'}
              maxValue={3000}
              callback={position => {console.log('slider');onDistanceSearch(position);}}
              defaultValue={distance}
              labelFontColor={Colors.whiteColor}
              labelFontWeight={'200'}
              showFill={true}
              fillColor={Colors.yellowToneColor}
              labelFontSize={22}
              //labelFontWeight={'bold'}
              showNumberScale={true}
              showSeparatorScale={true}
              buttonBackgroundColor={Colors.yellowToneColor}
              scaleNumberFontWeight={'200'}
              buttonDimensionsPercentage={6}
              heightPercentage={1}
              widthPercentage={80}
            />
            <Text style={{ fontSize: RFPercentage(2.5), fontWeight: 'bold', color: Colors.whiteColor, position: 'absolute', alignSelf: 'center' }}>{distance} mi</Text>
          </View>
        }
        {
          categorySearch &&
          <View style={styles.categorySearchPart}>
            {
              categories.map((each, index) => {
                return (
                  <TouchableOpacity key={index} style={[styles.categorySearchBtn, activeCategories?.findIndex(e => e.name == each.name) > -1 ? { borderColor: Colors.yellowToneColor } : null]} onPress={() => onCategorySearch(each)}>
                    <Text style={styles.btnTxt}>
                      {each.name}
                    </Text>
                    {/* //<TouchableOpacity onPress={() => {
                    //  var cates = [...categories];
                    //  cates.splice(cates.findIndex(e => e.id == each.id), 1);
                    //  setCategories(cates);
                    //}}>
                    //  <EntypoIcon name="circle-with-cross" style={styles.iconClose}></EntypoIcon>
                    //</TouchableOpacity> */}
                  </TouchableOpacity>
                );
              })
            }
          </View>
        }
      </View>

      <View style={styles.tabsView}>
          <TabComponent
              leftText={'Hunt'}
              middleText={'Stay'}
              rightText={'Explore'}
              onLeftPress={() => {
                setLeftTab(true);
                setRightTab(false);
                setMiddleTab(false);
              }}
              onMiddlePress={() => {
                setLeftTab(false);
                setRightTab(false);
                setMiddleTab(true);
                onStayPress();
              }}
              onRightPress={() => {
                setLeftTab(false);
                setRightTab(true);
                setMiddleTab(false);
                onExplorePress();
              }}
          />
      </View>
      {
        leftTab &&
        <ScrollView style={styles.scrollBody}>
          {
            business.map((each, index) => {
              if (Constants.user?.bid) {
                if (Constants.user?.bid == each.id) return null;
              }
              return <BusinessItem key={index} item={each} onPress={onBusinessItem} onRefresh={onRefresh} showAlert={showAlert} />
            })
          }
          {
            business.length == 0 &&
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTxt}>No Items</Text>
            </View>
          }
        </ScrollView>
      }
      {
        middleTab &&
        <ScrollView style={styles.scrollBody}>
          {
            stay.map((each, index) => {
              return (<ExploreItem key={index} item={each} onPress={onStayItem} onRefresh={onRefresh} showAlert={showAlert} />);
            })
          }
          {
            stay.length === 0 &&
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTxt}>No Items</Text>
            </View>
          }
        </ScrollView>
      }

      {
        rightTab &&
        <ScrollView style={styles.scrollBody}>
          {
            explore.map((each, index) => {
              return (<StayItem key={index} item={each} onPress={onExploreItem} onRefresh={onRefresh} showAlert={showAlert} />);
            })
          }
          {
            explore.length === 0 &&
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTxt}>No Items</Text>
            </View>
          }
        </ScrollView>
      }
    </View>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  },
  header: {
    width: '100%',
    height: normalize(60, 'height'),
    flexDirection: 'row',
    backgroundColor: Colors.blackColor
  },
  iconProfileContainer: {
    width: '12.5%',
    justifyContent: 'center',
    paddingLeft: normalize(20)
  },
  iconMapContainer: {
    width: '12.5%',
    justifyContent: 'center',
    paddingLeft: normalize(20)
  },
  titleContainer: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconMessageContainer: {
    width: '12.5%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconSettingContainer: {
    width: '12.5%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerIcon: {
    fontSize: RFPercentage(3.5),
    color: Colors.whiteColor,
  },
  titleTxt: {
    fontSize: RFPercentage(3),
    fontWeight: '600',
    color: Colors.yellowToneColor,
  },

  searchOverlay: {
    backgroundColor: Colors.blackColor,
    width: '100%',
    // height: normalize(60, 'height'),
    opacity: 0.7,
    justifyContent: 'center'
  },
  searchBoxContainer: {
    width: '90%',
    height: normalize(40, 'height'),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: Colors.whiteColor,
    borderRadius: normalize(25),
    borderWidth: normalize(3),
    marginTop: normalize(10, 'height'),
    marginBottom: normalize(10, 'height'),
    paddingLeft: normalize(10)
  },
  inputBox: {
    width: '75%',
    fontSize: RFPercentage(2.5),
    color: Colors.whiteColor,
    paddingLeft: normalize(5)
  },
  searchBoxIcon: {
    fontSize: RFPercentage(3.5),
    color: Colors.whiteColor,
    marginRight: normalize(10)
  },
  distanceSearchPart: {

  },
  categorySearchPart: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: normalize(7, 'height'),
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
    paddingBottom: normalize(5, 'height'),
  },
  categorySearchBtn: {
    // width: normalize(80),
    // height: normalize(20, 'height'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: normalize(8),
    marginBottom: normalize(8, 'height'),
    paddingLeft: normalize(7),
    paddingRight: normalize(7),
    borderColor: '#333',
    borderWidth: 3
  },
  tabsView:{
    width:'100%',
    backgroundColor:Colors.black,
  },
  btnTxt: {
    fontSize: RFPercentage(2.5),
    color: Colors.yellowToneColor,
  },
  iconClose: {
    fontSize: RFPercentage(2.2),
    color: Colors.greyWeakColor,
    marginLeft: normalize(5)
  },

  scrollBody: {
    width: '100%',
    height: '100%',
    marginTop: normalize(10, 'height'),
    marginBottom: normalize(5, 'height'),
  },

  emptyContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(230, 'height')
  },
  emptyTxt: {
    fontSize: RFPercentage(2.2),
    fontWeight: '600',
    color: Colors.blackColor
  },
});
