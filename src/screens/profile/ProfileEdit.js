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
  Alert,
  KeyboardAvoidingView,
  Linking
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';

import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();

import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AppHeader from '../../components/AppHeader/AppHeader';

import { Colors, Images, Constants } from '@constants';
import FavoriteItem from '../../components/FavoriteItem';

import { setData, uploadMedia } from '../../service/firebase';

export default function ProfileEditScreen({ navigation, route }) {
  const [profile, setProfile] = useState(Constants.user);
  const [refresh, setRefresh] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const [photoLocalPath, setPhotoLocalPath] = useState('');

  let ref = useRef();
  useEffect(() => {
    if (profile.address) {
      ref.current.setAddressText(profile.address);
    }
  }, [])

  const onFavoriteItem = (item) => {
    var index = Constants.user?.favorbids.findIndex(each => each == item.id);
    if (index != -1) Constants.user?.favorbids.splice(index, 1);

    index = Constants.user?.favorsids.findIndex(each => each == item.id);
    if (index != -1) Constants.user?.favorsids.splice(index, 1);

    var favorites = [];
    Constants.user?.favorbids.forEach(each => {
      var item = Constants.business.find(e => e.id == each);
      if (item) favorites.push(item);
    })
    Constants.user?.favorsids.forEach(each => {
      var item = Constants.services.find(e => e.id == each);
      if (item) favorites.push(item);
    })
    Constants.favorites = favorites;
    setRefresh(!refresh);
  }

  const checkCameraPermission = () => {
    return new Promise((resolve, reject) => {
      check(PERMISSIONS.IOS.CAMERA)
        .then((result) => {          
          if (result == RESULTS.GRANTED) resolve(true);
          else resolve(false);
        })
        .catch((error) => {
          resolve(false);
        })
    })
  }

  const pickImage = async () => {
    if (Platform.OS === 'ios') {
      var isCameraPermission = await checkCameraPermission();
      if (!isCameraPermission) {
        Alert.alert(
          'Visit settings and allow camera permission',
          '',
          [
            { text: "OK", onPress: () => {
              Linking.openURL('app-settings:');
            }},
            { text: "CANCEL", onPress: () => {} }
          ]);
        return;
      }
    }

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
        console.log('pick error', response.error)
      } else if (response.customButton) {
      } else {
        // console.log('path', response.uri)
        setPhotoLocalPath(response.uri);
        var nProfile = { ...profile };
        nProfile.img = response.uri;
        setProfile(nProfile);
      }
    });
  };

  const uploadPhoto = () => {
    return new Promise(async (resolve, reject) => {
      var platformPhotoLocalPath = Platform.OS === "android" ? photoLocalPath : photoLocalPath.replace("file://", "")
      let newPath = '';
      await ImageResizer.createResizedImage(platformPhotoLocalPath, 300, 300, 'PNG', 50, 0, null)
        .then(response => {
          newPath = response.uri;
        })
        .catch(err => {
          console.log('image resizer error', err);
        });

      await uploadMedia('users', Constants.user?.id, newPath)
        .then((downloadURL) => {
          console.log('downloadURL', downloadURL)
          if (!downloadURL) return;

          Constants.user.img = downloadURL;
          resolve();
        })
        .catch((err) => {
          console.log('upload photo error', err);
          reject(err);
        })
    })
  }

  const remoteUpdateUser = async (alertShow = false) => {
    await setData('users', 'update', Constants.user)
      .then(() => {
        if (alertShow) {
          setTimeout(()=>{
            Alert.alert(
              'Profile updated successfully!',
              '',
              [
                { text: "OK", onPress: () => { setSpinner(false); setRefresh(!refresh) } }
              ]);
            },
            100);
        }
        else {
          setSpinner(false);
        }
        console.log('remote user update success');
        setSpinner(false);
      })
      .catch((err) => {
        if (alertShow) {
          Alert.alert(
            'Profile update failed!',
            '',
            [
              { text: "OK", onPress: () => setSpinner(false) }
            ]);
        }
        else {
          setSpinner(false)
        }
        console.timeLog('remote user update error');
      })
  }

  const onSave = async () => {
    if (!profile.firstname) {
      Alert.alert('Please enter your first name');
      return;
    }
    if (!profile.lastname) {
      Alert.alert('Please enter your last name');
      return;
    }
    if (!profile.address) {
      Alert.alert('Please enter your address');
      return;
    }

    setSpinner(true);
    if (photoLocalPath) {
      await uploadPhoto();
    }

    Constants.user.firstname = profile.firstname;
    Constants.user.lastname = profile.lastname;
    Constants.user.name = (profile.firstname ? profile.firstname : '') + ' ' + (profile.lastname ? profile.lastname : '');
    Constants.user.address = profile.address;
    Constants.user.location = profile.location;

    remoteUpdateUser(true);
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Spinner
        visible={spinner}
        textContent={''}
      />
      <View style={styles.header}>
        {/* <View style={styles.iconHomeContainer}>
          <TouchableOpacity onPress={() => { Constants.refreshFlag = true; navigation.goBack(null) }}>
            <EntypoIcon name="chevron-thin-left" style={styles.headerIcon}></EntypoIcon>
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTxt}>Edit Profile</Text>
        </View> */}
        <AppHeader
              title={'Edit Profile'}
              leftIconPath={Images.headerLeftBack}
              //onLeftIconPress={() => navigation.navigate('Home', { screen: 'BusinessList' })}
              onLeftIconPress={()=>navigation.goBack()}
          />
      </View>

      <View style={styles.body}>
        <ScrollView keyboardShouldPersistTaps='always'>
          <View style={styles.imgContainer}>
            <Image style={styles.img} source={profile.img ? { uri: profile.img } : Images.profileImg} />
            <TouchableOpacity style={styles.imgEditIconBack} onPress={() => pickImage()}>
              <Image style={styles.imgEditIcon} source={Images.iconCamera} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.labelTxt}>First name</Text>
            <TextInput
              style={styles.inputBox}
              autoCapitalize='none'
              // placeholder={'Full Name'}
              // placeholderTextColor={Colors.greyWeakColor}
              value={profile.firstname}
              onChangeText={(text) => {
                var newProfile = { ...profile };
                newProfile.firstname = text;
                //newProfile.name = newProfile.firstname + ' ' + newProfile.lastname;
                setProfile(newProfile);
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.labelTxt}>Last name</Text>
            <TextInput
              style={styles.inputBox}
              autoCapitalize='none'
              // placeholder={'Full Name'}
              // placeholderTextColor={Colors.greyWeakColor}
              value={profile.lastname}
              onChangeText={(text) => {
                var newProfile = { ...profile };
                newProfile.lastname = text;
                //newProfile.name = newProfile.firstname + ' ' + newProfile.lastname;
                setProfile(newProfile);
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.labelTxt}>Address</Text>
            <GooglePlacesAutocomplete
              ref={ref}
              styles={{
                container: {
                  width: '100%',
                  alignSelf: 'center',
                },
                textInputContainer: {
                  width: '100%',
                  height: normalize(35, 'height'),
                  backgroundColor: Colors.greyColor,
                  alignSelf: 'center',
                  marginTop: normalize(10, 'height'),
                  borderColor: Colors.whiteColor,
                  borderRadius: normalize(25),
                  borderWidth: normalize(3),
                  paddingLeft: normalize(10),
                },
                textInput: {
                  width: '100%',
                  backgroundColor: 'transparent',
                  fontSize: RFPercentage(2),
                  color: Colors.whiteColor,
                  marginTop: normalize(-2, 'height'),
                },
                description: {
                  width: '80%',
                  fontWeight: 'bold',
                },
              }}
              placeholder={''}
              enablePoweredByContainer={false}
              fetchDetails={true}
              onPress={(data, details = null) => {
                var location = {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng
                }
                var newProfile = { ...profile };
                newProfile.address = data.description;
                newProfile.location = location;
                setProfile(newProfile);
              }}
              query={{
                key: 'AIzaSyDdPAhHXaBBh2V5D2kQ3Vy7YYrDrT7UW3I',
                language: 'en'
              }}
            />
          </View>

          <View style={styles.favoritesHeader}>
            <Text style={styles.favoritesHeaderTxt}>My Favorites</Text>
          </View>

          {
            Constants.favorites.length > 0 &&
            <View style={styles.favoriteContainer}>
            {
              Constants.favorites.map((each, index) =>
                <FavoriteItem key={index} item={each} onPressBookmark={onFavoriteItem} />
              )
            }
            </View>
          }
          {
            Constants.favorites.length == 0 &&
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTxt}>No Favorites</Text>
            </View>
          }
        </ScrollView>
      </View>

      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={() => onSave()}>
          <Text style={styles.btnTxt}>SAVE</Text>
        </TouchableOpacity>
      </View>
      <View style={{width:'100%', height:'10%', backgroundColor:Colors.white_dark }}>

      </View>
    </KeyboardAvoidingView>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: Colors.whiteColor,
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

  body: {
    backgroundColor: Colors.greyColor,
    height: '80%',
  },
  imgContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: normalize(10, 'height'),
    marginBottom: normalize(0, 'height')
  },
  img: {
    width: normalize(150),
    height: normalize(150),
    borderRadius: normalize(75),
    borderWidth: normalize(2),
    borderColor: Colors.greyWeakColor
  },
  imgEditIconBack: {
    width: normalize(25),
    height: normalize(25),
    marginTop: Platform.OS === 'android' ? normalize(120, 'height') : normalize(90, 'height'),
    marginLeft: normalize(-30),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.yellowToneColor,
    borderRadius: normalize(15)
  },
  imgEditIcon: {
    width: '60%',
    height: '60%',
  },

  inputContainer: {
    width: '80%',
    //flexDirection: 'row',
    alignSelf: 'center',
    // borderWidth: 1
  },
  labelTxt: {
    width: '25%',
    textAlign: 'left',
    fontSize: RFPercentage(2.2),
    fontWeight: '600',
    color: Colors.whiteColor,
    marginTop: normalize(10, 'height'),
    marginLeft: normalize(3),
    //alignSelf: 'flex-start',
  },
  inputBox: {
    width: '100%',
    height: normalize(35, 'height'),
    fontSize: RFPercentage(2),
    color: Colors.whiteColor,
    alignSelf: 'flex-start',
    marginTop: normalize(10, 'height'),
    borderColor: Colors.whiteColor,
    borderRadius: normalize(25),
    borderWidth: normalize(3),
    paddingLeft: normalize(20),
  },

  favoritesHeader: {
    width: '100%',
    height: '8%',
    backgroundColor: Colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(10, 'height'),
    //marginBottom: normalize(5, 'height'),
  },
  favoritesHeaderTxt: {
    fontSize: RFPercentage(3),
    fontWeight: '600',
    color: Colors.whiteColor
  },

  favoriteContainer:{
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: normalize(10, 'height'),
    paddingBottom: normalize(50, 'height'),
    backgroundColor:Colors.white_dark
  },
  emptyContainer: {
    width: '100%',
    height: normalize(200, 'height'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:Colors.white_dark
  },
  emptyTxt: {
    fontSize: RFPercentage(2.2),
    fontWeight: '600',
    color: Colors.blackColor
  },

  btnContainer: {
    width: '100%',
    height: '8%',
    backgroundColor: Colors.white_dark,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btn: {
    width: '80%',
    height: normalize(45, 'height'),
    backgroundColor: Colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(8),
  },
  btnTxt: {
    fontSize: RFPercentage(2.5),
    color: Colors.whiteColor
  },
});