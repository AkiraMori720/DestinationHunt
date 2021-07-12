/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react';

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
  KeyboardAvoidingView,
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';
import DateTimePicker from '@react-native-community/datetimepicker';
import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();

import moment from 'moment';

import { useIsFocused } from '@react-navigation/native';

import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import DropDownPicker from 'react-native-dropdown-picker';
import RNPickerSelect from 'react-native-picker-select';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { TextInputMask } from 'react-native-masked-text';
import AppHeader from '../../components/AppHeader/AppHeader';

import { Colors, Images, Constants } from '@constants';

import { getData, setData, uploadMedia } from '../../service/firebase';
import BusinessItem from '../../components/BusinessItem';

export default function BusinessProfileEdit({ navigation, route }) {
  const [businessItem, setBusinessItem] = useState();
  const [logo, setLogo] = useState();
  const [icon, setIcon] = useState();
  const [slideImgs, setSlideImgs] = useState([]);
  const [bname, setBname] = useState();
  const [address, setAddress] = useState();
  const [location, setLocation] = useState({});
  const [phone, setPhone] = useState();
  const [desc, setDesc] = useState();
  const [site, setSite] = useState();
  const [operatingHours, setOperatingHours] = useState({from:'', to:''});

  const [spinner, setSpinner] = useState(false);

  const [fromShow, setFromShow] = useState(false);
  const [toShow, setToShow] = useState(false);

  let refAddress = useRef();
  let refInput = useRef();

  if (useIsFocused() && Constants.refreshFlag) {
    Constants.refreshFlag = false;
    if (Constants.user?.bid) {
      let business = Constants.business.find(each => each.id === Constants.user?.bid);
      if (business) {
        setLogo(business.img);
        setIcon(business.icon);
        setSlideImgs(business.slideImgs);
        setBname(business.name);
        setAddress(business.address);
        setLocation(business.location);
        setPhone(business.phone);
        setDesc(business.desc);
        setSite(business.site);
        setOperatingHours(business.operatingHours);
        setBusinessItem(business);
      }
    }
  }

  useEffect(() => {
    if (Constants.user?.bid) {
      let business = Constants.business.find(each => each.id === Constants.user?.bid);
      if (business) {
        setLogo(business.img);
        setIcon(business.icon);
        setSlideImgs(business.slideImgs);
        setBname(business.name);
        setAddress(business.address);
        setLocation(business.location);
        setPhone(business.phone);
        setDesc(business.desc);
        setSite(business.site);
        if (business.operatingHours)
          setOperatingHours(business.operatingHours);
        else 
        {
          setOperatingHours({from:'', to:''});
        }
        setBusinessItem(business);
      }
    }
    if (address) {
      refAddress.current?.setAddressText(address);
    }
  }, [address]);

  const onUpdateImage = (index = null) => {
    var options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        //console.log(response);
        if (Platform.OS !== 'android') {
            response.path = response.uri;
        }
        if (index === 'logo') {
            setLogo(response.uri);
        } else if (index === 'icon'){
            setIcon(response.uri);
        } else {
            let imgs = {...slideImgs};
            //console.log(imgs);
            if (!imgs) imgs = [];
            //imgs.push(response.uri);
            imgs[index]=response.uri;
            //console.log(imgs);
            //console.log(imgs);
            setSlideImgs(imgs);
        }
      }
    });
  };

  const uploadPhoto = (photoLocalPath, remotePath) => {
    return new Promise(async (resolve, reject) => {
      var platformPhotoLocalPath = Platform.OS === "android" ? photoLocalPath : photoLocalPath.replace("file://", "")
      let newPath = '';
      /* await ImageResizer.createResizedImage(platformPhotoLocalPath, 400, 200, 'PNG', 50, 0, null)
        .then(response => {
          newPath = response.uri;
        })
        .catch(err => {
          console.log('image resizer error', err);
        }); */

      await uploadMedia('business', remotePath, platformPhotoLocalPath)
        .then((downloadURL) => {
          if (!downloadURL) return;
          // console.log('downloadURL', downloadURL)
          resolve(downloadURL);
        })
        .catch((err) => {
          console.log('upload photo error', err);
          reject(err);
        });
    })
  }

  function convertTimeFormat12To24(value){ // 12:23 AM -> 00:23
    const [time, meridian] = value.split(' ');
  
    let [h, m] = time.split(':');
  
    if (h === '12') {
      h = '00';
    }
  
    if (meridian === 'PM') {
      h = parseInt(h, 10) + 12;
    }
  
    var retValue = h + ':' + m;
    return retValue;
  }

  const convertTimeStrtoTime = (str) => {
    if (!str){
      return new Date(Date.now());
    }
    var str24 = convertTimeFormat12To24(str);
    var hour = str24.split(":")[0];
    var minute = str24.split(":")[1];
    var time = new Date();
    time.setHours(hour);
    time.setMinutes(minute);
    return time;

  }

  const saveBusiness = async () => {

    let nBusiness = {...businessItem};

    nBusiness.name = bname;
    // nBusiness.img = logo ? logo : nBusiness.img;
    // nBusiness.icon = icon ? icon : nBusiness.icon;
    // nBusiness.slideImgs = slideImgs ? slideImgs : nBusiness.slideImgs;
    nBusiness.address = address;
    nBusiness.phone = phone;
    nBusiness.site = site;
    nBusiness.desc = desc;
    nBusiness.operatingHours = operatingHours;
    nBusiness.location = location;

    let act = '';
    act = 'update';

    await setData('business', act, nBusiness)
      .then((res) => {
        Alert.alert(
          'Profile Saved Successfully!',
          '',
          [
            { text: "OK", onPress: () => { setSpinner(false); } }
          ]);
          Constants.business.splice(Constants.business.findIndex(each => each.id === nBusiness.id), 1, nBusiness);
          Constants.refreshFlag = true;
          if (route.params?.onRefresh){
            route.params.onRefresh();
          }
        console.log('remote save business success', Constants.business.length);
      })
      .catch((err) => {
        Alert.alert(
          'Save Error!',
          err.Error,
          [
            { text: "OK", onPress: () => setSpinner(false) }
          ]);
        console.log('remote save business error', err);
      });
  }

  const validateEmail = (email) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email);
  }

  const remoteUpdateUserToBusiness = async () => {
    await setData('users', 'update', Constants.user)
      .then((res) => {
        console.log('remote user updated to business, but need to be approved');
      })
      .catch((err) => {
        console.log('remote user update error');
      });
  }

  const checkValidataion = () => {
    if (!logo) {
      Alert.alert('Please upload logo image');
      return false;
    }
    if (!bname) {
      Alert.alert('Please enter business name');
      return false;
    }
    if (!address) {
      Alert.alert('Please enter address');
      return false;
    }
    if (!phone) {
      Alert.alert('Please enter contact number');
      return;
    }
    if (!site) {
      Alert.alert('Please enter site');
      return false;
    }

    return true;
  }

  const onSave = async () => {
    if (!checkValidataion()) return;

    setSpinner(true);
    if (businessItem.img !== logo) {
        await uploadPhoto(logo, businessItem.id + '/main')
        .then((res)=>{
          setLogo(res);
          businessItem.img = res;
        })
        .catch((err)=>{
          console.log('upload logo error', err);
        });
    }

    if (businessItem.icon !== icon) {
      await uploadPhoto(icon, businessItem.id + '/icon')
      .then((res)=>{
        setIcon(res);
        businessItem.icon = res;
      })
      .catch((err)=>{
        console.log('upload icon error', err);
      });
    }

    //console.log(slideImgs, slideImgs.length);
    if (slideImgs){
      let imgs = [];
      //console.log(slideImgs);
      for (let i = 0; i < 3; i++) {
        const image_uri = slideImgs[i];
        if (image_uri) {
            if (image_uri.substring(0,4) === 'http') {
              imgs.push(image_uri);
            }
            else
            {
              //console.log(image_uri);
              await uploadPhoto(image_uri, businessItem.id + '/detail_' + imgs.length)
              .then((res)=>{
                imgs.push(res);
              })
              .catch((err)=>{
                console.log('upload slide images error', err);
              });
            }
        }
      }
      businessItem.slideImgs = imgs;
      setSlideImgs(imgs);
    }

    saveBusiness();
  }

  const onOperatingFrom = () => {
    setFromShow(true);
    setToShow(false);
  }

  const onOperatingTo = () => {
    setToShow(true);
    setFromShow(false);
  }

  const onFromTimeChange = (event, selectedTime) => {
    //setFromShow(Platform.OS === 'ios');
    let newOperatingHours;
    if (operatingHours){
      newOperatingHours = Object.assign({}, operatingHours, {from : moment(selectedTime).format('hh:mm A')});
    }
    else
    {
      newOperatingHours = Object.assign({}, {from : moment(selectedTime).format('hh:mm A')});
    }
    setOperatingHours(newOperatingHours);
    setFromShow(false);
  }

  const onToTimeChange = (event, selectedTime) => {
    //setToShow(Platform.OS === 'ios');
    let newOperatingHours;
    if (operatingHours){
      newOperatingHours = Object.assign({}, operatingHours, {to : moment(selectedTime).format('hh:mm A')});
    }
    else
    {
      newOperatingHours = Object.assign({}, {to : moment(selectedTime).format('hh:mm A')});
    }
    setOperatingHours(newOperatingHours);
    setToShow(false);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} backgroundColor={Colors.whiteColor}>
      <Spinner
        visible={spinner}
        textContent={''}
      />
      <View style={styles.header}>
        <AppHeader
              title={'Edit Information'}
              leftIconPath={Images.headerLeftBack}
              //onLeftIconPress={() => navigation.navigate('Home', { screen: 'BusinessList' })}
              onLeftIconPress={()=>{
                navigation.goBack(null);
              }}
        />
      </View>

      <ScrollView style={styles.body} keyboardShouldPersistTaps='always'>
        <Text style={styles.labelTxt}>Company Logo</Text>
        <View style={styles.logo}>
          <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateImage('logo')}>
            {
              (logo != undefined && logo != null && logo != '') &&
              <Image style={styles.logoImg} source={{ uri: logo }} resizeMode='stretch' />
            }
            {
              !logo &&
              <>
                <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                <Text style={styles.logoTxt}>Upload Logo</Text>
              </>
            }
          </TouchableOpacity>
        </View>
        <Text style={styles.labelTxt}>Company Icon</Text>
        <View style={styles.logo}>
          <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateImage('icon')}>
            {
              icon &&
              <Image style={styles.logoImg} source={{ uri: icon }} resizeMode='stretch' />
            }
            {
              !icon &&
              <>
                <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                <Text style={styles.logoTxt}>Upload Icon</Text>
              </>
            }
          </TouchableOpacity>
        </View>

        <Text style={styles.labelTxt}>Slide Images</Text>
        <View style={styles.logo}>
          <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateImage(0)}>
            {
              (slideImgs && slideImgs[0]) &&
              <Image style={styles.logoImg} source={{ uri: slideImgs[0] }} resizeMode='stretch' />
            }
            {
              !(slideImgs && slideImgs[0]) &&
              <>
                <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                <Text style={styles.logoTxt}>Upload slide image 1</Text>
              </>
            }
          </TouchableOpacity>
        </View>
        <View style={styles.logo}>
          <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateImage(1)}>
            {
              (slideImgs && slideImgs[1]) &&
              <Image style={styles.logoImg} source={{ uri: slideImgs[1] }} resizeMode='stretch' />
            }
            {
              !(slideImgs && slideImgs[1]) &&
              <>
                <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                <Text style={styles.logoTxt}>Upload slide image 2</Text>
              </>
            }
          </TouchableOpacity>
        </View>
        <View style={styles.logo}>
          <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateImage(2)}>
            {
              (slideImgs && slideImgs[2]) &&
              <Image style={styles.logoImg} source={{ uri: slideImgs[2] }} resizeMode='stretch' />
            }
            {
              !(slideImgs && slideImgs[2]) &&
              <>
                <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                <Text style={styles.logoTxt}>Upload slide image 3</Text>
              </>
            }
          </TouchableOpacity>
        </View>
        
        <Text style={styles.labelTxt}>Address</Text>
        <GooglePlacesAutocomplete
          ref={refAddress}
          textInputProps={styles.inputBox}
          placeholder=''
          enablePoweredByContainer={false}
          fetchDetails={true}
          onPress={(data, details = null) => {
            var location = {
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng
            }
            setLocation(location);
            setAddress(data.description);
          }}
          query={{
            key: 'AIzaSyDdPAhHXaBBh2V5D2kQ3Vy7YYrDrT7UW3I',
            language: 'en'
          }}
        />
        <Text style={styles.labelTxt}>Website</Text>
        <TextInput
          style={styles.inputBox}
          autoCapitalize='none'
          placeholder={''}
          placeholderTextColor={Colors.greyColor}
          value={site}
          onChangeText={(text) => setSite(text)}
        >
        </TextInput>
        <Text style={styles.labelTxt}>Phone Number</Text>
        <TextInputMask
          type={'custom'}
          options={{
            mask: '+1 (999) 999 - 9999'
          }}
          refInput={refInput}
          style={styles.inputBox}
          placeholder={''}
          placeholderTextColor={Colors.greyColor}
          value={phone}
          keyboardType={'numeric'}
          onChangeText={(text) => setPhone(text)}
        />

        <Text style={styles.labelTxt}>Operating Hours</Text>
        <View style={styles.timeView}>
          <TouchableOpacity style={styles.time} onPress={onOperatingFrom}>
            <Text style={styles.timeTxt}>{operatingHours?.from}</Text>
            {fromShow && (
              <DateTimePicker
                value={convertTimeStrtoTime(operatingHours?.from)}
                mode={'time'}
                is24Hour={false}
                display="default"
                onChange={onFromTimeChange}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.time} onPress={onOperatingTo}>
            <Text style={styles.timeTxt}>{operatingHours?.to}</Text>
            {toShow && (
              <DateTimePicker
                value={convertTimeStrtoTime(operatingHours?.to)}
                mode={'time'}
                is24Hour={false}
                display="default"
                onChange={onToTimeChange}
              />
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.labelTxt}>Information</Text>
        <TextInput
          style={styles.inputInfo}
          autoCapitalize={'none'}
          placeholder={''}
          placeholderTextColor={Colors.greyColor}
          multiline = {true}
          value={desc}
          onChangeText={(text) => setDesc(text)}
        />
        <View style={{height: 230}}>
        <TouchableOpacity style={styles.btn} onPress={() => onSave()}>
          <Text style={styles.btnTxt}>Save</Text>
        </TouchableOpacity>
        </View>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    //backgroundColor:Colors.whiteColor,
  },
  header: {
    width: '100%',
    height: normalize(60, 'height'),
    flexDirection: 'row',
    //borderBottomColor:Colors.greyWeakColor,
    //borderBottomWidth:normalize(2),
  },
  iconBackContainer: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerIcon: {
    fontSize: RFPercentage(3.5),
    color: Colors.whiteColor,
  },
  titleTxt: {
    fontSize: RFPercentage(2.2),
    fontWeight: '600',
    color: Colors.yellowToneColor,
  },

  body: {
    width: '90%',
    // height: 2000,
    alignSelf: 'center',
    backgroundColor:Colors.whiteColor,
  },
  logo: {
    width: width * 0.9,
    height: normalize(width * 0.9 / 2.4, 'height'),
    backgroundColor: Colors.greyWeakColor,
    marginTop: normalize(10, 'height'),
    borderRadius: normalize(8),
  },
  logoImg: {
    width: '100%',
    height: '100%',
    borderRadius: normalize(8)
  },
  logoBtn: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoTxt: {
    fontSize: RFPercentage(2.5),
    color: Colors.blackColor,
  },

  inputBox: {
    width: '100%',
    height: normalize(45, 'height'),
    backgroundColor: Colors.greyWeakColor,
    fontSize: RFPercentage(2.2),
    borderRadius: normalize(15),
    marginTop: normalize(10, 'height'),
    paddingLeft: normalize(10),
  },

  inputInfo: {
    width: '100%',
    height: normalize(200, 'height'),
    backgroundColor: Colors.greyWeakColor,
    fontSize: RFPercentage(2.2),
    borderRadius: normalize(15),
    marginTop: normalize(10, 'height'),
    paddingLeft: normalize(10),
    textAlignVertical: 'top',
  },

  btn: {
    width: '80%',
    height: normalize(45, 'height'),
    backgroundColor: Colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: normalize(8),
    marginTop: normalize(35, 'height')
  },
  btnTxt: {
    fontSize: RFPercentage(2.5),
    color: Colors.whiteColor
  },
  labelTxt: {
    width: '50%',
    textAlign: 'left',
    fontSize: RFPercentage(2.2),
    fontWeight: '900',
    color: Colors.blackColor,
    marginTop: normalize(10, 'height'),
    marginLeft: normalize(3),
    //alignSelf: 'flex-start',
  },
  labelIcon: {
    fontSize: RFPercentage(2),
    color: Colors.whiteColor,
    marginLeft: normalize(10)
  },
  timeView: {
    width: '100%',
    flexDirection:'row',
  },
  timeTxt:{
    width: '95%',
    height: normalize(45, 'height'),
    backgroundColor: Colors.greyWeakColor,
    fontSize: RFPercentage(2.2),
    borderRadius: normalize(15),
    marginTop: normalize(10, 'height'),
    paddingLeft: normalize(10),
    color:Colors.blackColor,
    textAlignVertical:'center',
    alignSelf:'center',
    lineHeight: Platform.OS === 'ios' ? 60 : 20,
  },
  time:{
    width:'50%',
  }
});