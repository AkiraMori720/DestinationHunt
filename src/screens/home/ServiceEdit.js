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
import CheckBox from '@react-native-community/checkbox';

import AppHeader from '../../components/AppHeader/AppHeader';
import { Colors, Images, Constants } from '@constants';
import { getData, setData, uploadMedia } from '../../service/firebase';
import BusinessItem from '../../components/BusinessItem';

export default function ServiceEditScreen({ navigation,route }) {
  const [serviceItem, setServiceItem] = useState(route.params.serviceItem ? route.params.serviceItem : 
    {
        name: '',
        img: '',
        cid: '',
        address: '',
        about: '',
        guide: '',
        days: '1',
        hunters: '1',
        price: '',
        isContactPrice: false,
        rating: 0,
        season: {
            from: '',
            to: ''
        },
        detailImgs: [],
        hunterImg: '',
        hunterDesc: '',
        terms: '',
    });
  const isAdd = route.params.serviceItem ? false : true;

  const [photoLocalPath, setPhotoLocalPath] = useState();
  const [imgDownloadUrl, setImgDownloadUrl] = useState();
  const [spinner, setSpinner] = useState(false);
  const [categories, setCategories] = useState();
  const [fromShow, setFromShow] = useState(false);
  const [toShow, setToShow] = useState(false);

  const [img, setImg] = useState();
  const [category, setCategory] = useState();
  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [about, setAbout] = useState({});
  const [guide, setGuide] = useState();
  const [days, setDays] = useState();
  const [hunters, setHunters] = useState();
  const [price, setPrice] = useState();
  const [contact, setContact] = useState();
  const [season, setSeason] = useState();
  const [terms, setTerms] = useState();
  const [detailImgs, setDetailImgs] = useState();

  // Dropdown list
  const [catOpen, setCatOpen] = useState(false);
  const [dayOpen, setDayOpen] = useState(false);
  const [huntOpen, setHuntOpen] = useState(false);
  const [catItems, setCatItems] = useState(Constants.categories?.map((each) => {return ({label:each.name,value:each.id})}));
  const [dayItems, setDayItems] = useState([{label:'1', value:'1'},{label:'2', value:'2'},
    {label:'3', value:'3'},{label:'4', value:'4'},{label:'5', value:'5'},{label:'6', value:'6'},
    {label:'7', value:'7'}
  ]);
  const [huntItems, setHuntItems] = useState([{label:'1', value:'1'},{label:'2', value:'2'},
    {label:'3', value:'3'},{label:'4', value:'4'},{label:'5', value:'5'},{label:'6', value:'6'},
    {label:'7', value:'7'},{label:'8', value:'8'},{label:'9', value:'9'},{label:'10', value:'10'}]);

  let refAddress = useRef();
  let refInput = useRef();

  useEffect(() => {
    if (serviceItem) {
        if (serviceItem.img && serviceItem.img.length > 0) setImg(serviceItem.img);
        setCategory(serviceItem.cid);
        setName(serviceItem.name);
        setAddress(serviceItem.address);
        setAbout(serviceItem.about);
        setGuide(serviceItem.guide);
        setDays(serviceItem.days);
        setHunters(serviceItem.hunters);
        setPrice(serviceItem.price);
        setContact(serviceItem.isContactPrice);
        setSeason(serviceItem.season);
        setTerms(serviceItem.terms);
        setDetailImgs(serviceItem.detailImgs);
    }
  }, [serviceItem]);

  /* const onServiceImg = () => {
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
        setPhotoLocalPath(response.uri);
        setImg(response.uri);
      }
    });
  };

  const uploadPhoto = () => {
    return new Promise(async (resolve, reject) => {
      var platformPhotoLocalPath = Platform.OS === "android" ? photoLocalPath : photoLocalPath.replace("file://", "")
      let newPath = '';
      await ImageResizer.createResizedImage(platformPhotoLocalPath, 400, 200, 'PNG', 50, 0, null)
        .then(response => {
          newPath = response.uri;
        })
        .catch(err => {
          console.log('image resizer error', err);
        });

        let upName = Constants.user.bid + '_' + moment().valueOf().toString();
        await uploadMedia('services', upName, newPath)
        .then((downloadURL) => {
          //if (!downloadURL) return;
          
          setImgDownloadUrl(downloadURL);
          setImg(downloadURL);
          resolve(downloadURL);
        })
        .catch((err) => {
          console.log('upload photo error', err);
          reject(err);
        });
    });
  } */


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
            setImg(response.uri);
        } else {
            let imgs = {...detailImgs};
            if (!imgs) imgs=[];
            imgs[index] = response.uri;
            setDetailImgs(imgs);
        }
      }
    });
  };

  const uploadPhoto = (photoLocalPath, remotePath) => {
    return new Promise(async (resolve, reject) => {
      var platformPhotoLocalPath = Platform.OS === "android" ? photoLocalPath : photoLocalPath.replace("file://", "")
      let newPath = '';
      await ImageResizer.createResizedImage(platformPhotoLocalPath, 400, 200, 'PNG', 50, 0, null)
        .then(response => {
          newPath = response.uri;
        })
        .catch(err => {
          console.log('image resizer error', err);
        });

      await uploadMedia('services', remotePath, newPath)
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


  const saveService = async () => {

    let service = {...serviceItem};
    service.name = name;
    //service.img = uploadImageUrl ? uploadImageUrl : service.img;
    service.cid = category;
    service.address = address;
    service.about = about;
    service.guide = guide;
    service.days = days;
    service.hunters = hunters;
    service.price = price;
    service.isContactPrice = contact;
    service.season = season;
    service.terms = terms;
    //service.detailImgs = detailImgs;
    service.bid = Constants.user.bid;

    let act = '';
    console.log(service);
    if (!service.id || service.id === '')
    {
      act = 'add';
    }
    else {
      act = 'update';
    }

    await setData('services', act, service)
      .then((res) => {
        Alert.alert(
          'Service Saved Successfully!',
          '',
          [
            { text: "OK", onPress: () => { setSpinner(false); } }
          ]);

        if (act === 'add') {
          service.id = res.id;
          Constants.services.push(service);
        }
        else if (act === 'update') {
          Constants.services.splice(Constants.services.findIndex(each => each.id === service.id), 1, service);
        }
        Constants.refreshFlag = true;
        if (route.params?.onRefresh)
        {
            route.params.onRefresh();
        }
        console.log('remote save service success', Constants.services.length);
      })
      .catch((err) => {
        Alert.alert(
          'Save Error!',
          err.Error,
          [
            { text: "OK", onPress: () => setSpinner(false) }
          ]);
        console.log('remote save service error', err);
      });
  }

  const checkValidataion = () => {
    if (!img) {
      Alert.alert('Please upload Service image');
      return false;
    }
    if (!name) {
      Alert.alert('Please enter Service name');
      return false;
    }
    if (!days) {
      Alert.alert('Please enter Hunt duration');
      return false;
    }
    if (!hunters) {
      Alert.alert('Please enter Hunt per package');
      return;
    }
    if (!about) {
      Alert.alert('Please enter About the hunt');
      return false;
    }

    return true;
  }

  const onSave = async () => {
    if (!checkValidataion()) return;

    setSpinner(true);
    if (!serviceItem.id || serviceItem.id === '')
    {
      await setData('services', 'add', {name: name})
      .then((res)=>{
        serviceItem.id = res.id;
        Constants.services.push(serviceItem);
      })
      .catch((err)=>{
        console.log('On adding a service, err:',err);
      });
    }

    if (!serviceItem.id || serviceItem.id === '')
    {
      Alert.alert('Adding a service is failed. Please check internet connection and retry again.');
      return;
    }

    if (serviceItem.img !== img) {
        await uploadPhoto(img, serviceItem.id + '/main')
        .then((res)=>{
          setImg(res);
          serviceItem.img = res;
        })
        .catch((err)=>{
          console.log('upload logo error', err);
        });
    }

    if (detailImgs){
      let imgs = [];
      console.log(detailImgs);
      for (let i = 0; i < 4; i++) {
        const image_uri = detailImgs[i];
        if (image_uri) {
            if (image_uri.substring(0,4) === 'http') {
              imgs.push(image_uri);
            }
            else
            {
              console.log(image_uri);
              await uploadPhoto(image_uri, serviceItem.id + '/detail_' + imgs.length)
              .then((res)=>{
                imgs.push(res);
              })
              .catch((err)=>{
                console.log('upload detail images error', err);
              });
            }
        }
      }
      serviceItem.detailImgs = imgs;
      setDetailImgs(imgs);
    }

    saveService();
  }

  const onSeasonFrom = () => {
    setFromShow(true);
    setToShow(false);
  }

  const onSeasonTo = () => {
    setToShow(true);
    setFromShow(false);
  }

  const onFromTimeChange = (event, selectedTime) => {
    //setFromShow(Platform.OS === 'ios');
    let newSeason;
    if (season){
      newSeason = Object.assign({}, season, {from : moment(selectedTime).format('YYYY-MM-DD')});
    }
    else
    {
      newSeason = Object.assign({}, {from : moment(selectedTime).format('YYYY-MM-DD')});
    }
    setSeason(newSeason);
    setFromShow(false);
  }

  const onToTimeChange = (event, selectedTime) => {
    //setToShow(Platform.OS === 'ios');
    let newSeason;
    if (season){
      newSeason = Object.assign({}, season, {to : moment(selectedTime).format('YYYY-MM-DD')});
    }
    else
    {
      newSeason = Object.assign({}, {to : moment(selectedTime).format('YYYY-MM-DD')});
    }
    setSeason(newSeason);
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
              title={'Edit Service'}
              leftIconPath={Images.headerLeftBack}
              //onLeftIconPress={() => navigation.navigate('Home', { screen: 'BusinessList' })}
              onLeftIconPress={()=>{
                navigation.goBack(null);
              }}
        />
      </View>

      <ScrollView style={styles.body} keyboardShouldPersistTaps='always'>
        <Text style={styles.labelTxt}>Service Image</Text>
        <View style={styles.logo}>
          <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateImage('logo')}>
            {
              img &&
              <Image style={styles.logoImg} source={{ uri: img }} resizeMode='stretch' />
            }
            {
              !img &&
              <>
                <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                <Text style={styles.logoTxt}>{'Service Image'}</Text>
              </>
            }
          </TouchableOpacity>
        </View>
        <Text style={styles.labelTxt}>Detail Images</Text>
        <View style={styles.logo}>
          <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateImage(0)}>
            {
              (detailImgs && detailImgs[0]) &&
              <Image style={styles.logoImg} source={{ uri: detailImgs[0] }} resizeMode='stretch' />
            }
            {
              !(detailImgs && detailImgs[0]) &&
              <>
                <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                <Text style={styles.logoTxt}>{'Detail Image 1'}</Text>
              </>
            }
          </TouchableOpacity>
        </View>
        <View style={styles.logo}>
          <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateImage(1)}>
            {
              (detailImgs && detailImgs[1]) &&
              <Image style={styles.logoImg} source={{ uri: detailImgs[1] }} resizeMode='stretch' />
            }
            {
              !(detailImgs && detailImgs[1]) &&
              <>
                <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                <Text style={styles.logoTxt}>{'Detail Image 2'}</Text>
              </>
            }
          </TouchableOpacity>
        </View>
        <View style={styles.logo}>
          <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateImage(2)}>
            {
              (detailImgs && detailImgs[2]) &&
              <Image style={styles.logoImg} source={{ uri: detailImgs[2] }} resizeMode='stretch' />
            }
            {
              !(detailImgs && detailImgs[2]) &&
              <>
                <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                <Text style={styles.logoTxt}>{'Detail Image 3'}</Text>
              </>
            }
          </TouchableOpacity>
        </View>
        <View style={styles.logo}>
          <TouchableOpacity style={styles.logoBtn} onPress={() => onUpdateImage(3)}>
            {
              (detailImgs && detailImgs[3]) &&
              <Image style={styles.logoImg} source={{ uri: detailImgs[3] }} resizeMode='stretch' />
            }
            {
              !(detailImgs && detailImgs[3]) &&
              <>
                <EntypoIcon name="plus" style={styles.logoTxt}></EntypoIcon>
                <Text style={styles.logoTxt}>{'Detail Image 4'}</Text>
              </>
            }
          </TouchableOpacity>
        </View>
        <Text style={styles.labelTxt}>Hunt Category</Text>
        <DropDownPicker
            open={catOpen}
            value={category}
            items={catItems}
            setOpen={setCatOpen}
            setValue={setCategory}
            setItems={setCatItems}
            style={styles.catDropDown}
            textStyle={{
                fontSize: RFPercentage(2.2),
            }}
            maxHeight={600}
        />

        <Text style={styles.labelTxt}>Hunt Title</Text>
        <TextInput
          style={styles.inputBox}
          autoCapitalize='none'
          placeholder={''}
          placeholderTextColor={Colors.greyColor}
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Text style={styles.labelTxt}>Address</Text>
        <GooglePlacesAutocomplete
          ref={refAddress}
          textInputProps={styles.inputBox}
          placeholder={address}
          enablePoweredByContainer={false}
          fetchDetails={true}
          onPress={(data, details = null) => {
            var location = {
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            }
            setAddress(data.description);
          }}
          query={{
            key: 'AIzaSyDdPAhHXaBBh2V5D2kQ3Vy7YYrDrT7UW3I',
            language: 'en',
          }}
        />
        <Text style={styles.labelTxt}>About the hunt</Text>
        <TextInput
          style={styles.inputInfo}
          autoCapitalize={'none'}
          placeholder={''}
          placeholderTextColor={Colors.greyColor}
          multiline = {true}
          value={about}
          onChangeText={(text) => setAbout(text)}
        />
        <Text style={styles.labelTxt}>Hunting Guidelines</Text>
        <TextInput
          style={styles.inputInfo}
          autoCapitalize={'none'}
          placeholder={''}
          placeholderTextColor={Colors.greyColor}
          multiline = {true}
          value={guide}
          onChangeText={(text) => setGuide(text)}
        />
        <Text style={styles.labelTxt}>Hunt Duration(day/s)</Text>
        <DropDownPicker
            open={dayOpen}
            value={days}
            items={dayItems}
            setOpen={setDayOpen}
            setValue={setDays}
            setItems={setDayItems}
            style={styles.dayDropDown}
            textStyle={{
                fontSize: RFPercentage(2.2),
            }}
            maxHeight={500}
        />
        <Text style={styles.labelTxt}>Hunt per package</Text>
        <DropDownPicker
            open={huntOpen}
            value={hunters}
            items={huntItems}
            setOpen={setHuntOpen}
            setValue={setHunters}
            setItems={setHuntItems}
            style={styles.huntDropDown}
            textStyle={{
                fontSize: RFPercentage(2.2),
            }}
            maxHeight={500}
        />
        <Text style={styles.labelTxt}>Package Price($)</Text>
        <TextInput
          style={styles.inputBox}
          autoCapitalize='none'
          placeholder={''}
          placeholderTextColor={Colors.greyColor}
          value={price}
          onChangeText={(text) => setPrice(text)}
        />
        <View style={styles.checkBoxContainer}>
            <CheckBox
                style={{ width: 20, height: 20, marginLeft: 10 }}
                value={contact}
                disabled={false}
                boxType={'square'}
                onValueChange={() => {
                    setContact(!contact);
                }}
            />
            <Text style={styles.checkLbl}>Contact guide for package price</Text>
        </View>
        <Text style={styles.labelTxt}>Hunting Season</Text>
        <View style={styles.timeView}>
          <TouchableOpacity style={styles.time} onPress={onSeasonFrom}>
            <Text style={styles.timeTxt}>{season?.from}</Text>
            {fromShow && (
              <DateTimePicker
                value={(new Date(season?.from ? season.from : Date.now()))}
                mode={'date'}
                is24Hour={false}
                display="default"
                onChange={onFromTimeChange}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.time} onPress={onSeasonTo}>
            <Text style={styles.timeTxt}>{season?.to}</Text>
            {toShow && (
              <DateTimePicker
                value={(new Date(season?.to ? season.to : Date.now()))}
                mode={'date'}
                is24Hour={false}
                display="default"
                onChange={onToTimeChange}
              />
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.labelTxt}>Terms and Conditions</Text>
        <TextInput
          style={styles.inputInfo}
          autoCapitalize={'none'}
          placeholder={''}
          placeholderTextColor={Colors.greyColor}
          multiline = {true}
          value={terms}
          onChangeText={(text) => setTerms(text)}
        />
        <View style={{height: 230}}>
        <TouchableOpacity style={styles.btn} onPress={() => onSave()}>
          <Text style={styles.btnTxt}>Publish</Text>
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
  titleLabelTxt: {
    width: '50%',
    textAlign: 'left',
    fontSize: RFPercentage(2.2),
    fontWeight: '900',
    color: Colors.blackColor,
    marginTop: normalize(10, 'height'),
    marginLeft: normalize(3),
    //zIndex:100,
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
    textAlignVertical: 'center',
    alignSelf:'center',
    lineHeight: Platform.OS === 'ios' ? 60 : 20,
  },
  time:{
    width:'50%',
  },
  checkBoxContainer: {
    width: '100%',
    height: normalize(45, 'height'),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  checkLbl: {
    fontSize: RFPercentage(2.2),
    color: Colors.blackColor,
    marginLeft: normalize(10),
  },
  catDropDown:{
    marginTop:normalize(10),
    backgroundColor:Colors.greyWeakColor,
    //zIndex:2000,
  },
  dayDropDown:{
      marginTop:normalize(10),
      backgroundColor:Colors.greyWeakColor,
      zIndex:1001,
  },
  huntDropDown:{
    marginTop:normalize(10),
    backgroundColor:Colors.greyWeakColor,
    zIndex:1000,
  },
});