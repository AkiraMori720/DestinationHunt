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
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
EntypoIcon.loadFont();
FontAwesomeIcon.loadFont();

import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

import CheckBox from '@react-native-community/checkbox';
import Spinner from 'react-native-loading-spinner-overlay';
import AppHeader from '../../components/AppHeader/AppHeader';
import AppDoubleInput from '../../components/AppDoubleInput/AppDoubleInput';

import { Colors, Images, Constants } from '@constants';
import { appleSignin, googleSignin, facebookSignin, signin, } from '../../service/firebase';
import { getUserSocialRegistered, createUser, checkInternet } from '../../service/firebase';

export default function SigninScreen({ navigation }) {
  const [page, setPage] = useState('all');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('hunteruserremember')
      .then(async (res) => {
        if (res) {
          var email = await AsyncStorage.getItem('hunteruseremail');
          var pwd = await AsyncStorage.getItem('hunteruserpwd');
          setEmail(email);
          setPwd(pwd);
          setRememberMe(true);
        }
      })
  }, []);

  const onAppleSignin = async () => {
    await appleSignin()
      .then(async (res) => {
        console.log('apple signin success', res);
        getUserRegistered(res.user);
      })
      .catch((err) => {
        console.log('apple signin error', err);
      });
  }

  const onGoogleSignin = async () => {
    await googleSignin()
      .then(async (res) => {
        console.log('google signin success', res);
        if (res.user){
          res.user.firstname = res.additionalUserInfo?.profile?.given_name;
          res.user.lastname = res.additionalUserInfo?.profile?.family_name;
          res.user.displayName = res.user.displayName ? res.user.displayName : res.additionalUserInfo?.profile?.name;
        }
        getUserRegistered(res.user);
      })
      .catch((err) => {
        console.log('google signin error', err)
      });
  }

  const onFacebookSignin = async () => {
    await facebookSignin()
      .then(async (res) => {
        console.log('facebook signin success', res);
        getUserRegistered(res.user);
      })
      .catch((err) => {
        console.log('facebook signin error', err)
      });
  }

  const getUserRegistered = async (userInfo) => {
    await getUserSocialRegistered(userInfo.email)
      .then((user) => {
        if (user == 'no exist') {
          createUserWithSocial(userInfo);
          return;
        }

        if (!user.active) {
          Alert.alert('You are banned by admin.');
          return;
        }

        Constants.user = user;
        AsyncStorage.setItem('user', JSON.stringify(user));
        navigation.navigate('Home');
      })
      .catch((err) => {
        console.log('signin errr', err);

        Alert.alert(
          'Signin is failed.',
          'Please try again.',
          [
            { text: "OK", onPress: () => setSpinner(false) }
          ],
        );
      })
  }

  const createUserWithSocial = async (userInfo) => {
    console.log('create user info')
    var user = {
      id: userInfo.uid,
      name: userInfo.displayName,
      firstname: userInfo.firstname,
      lastname: userInfo.lastname,
      img: userInfo.photoURL ? userInfo.photoURL : '',
      email: userInfo.email,
      pwd: '',
      address: '',
      favorbids: [],
      favorsids: [],
      active: true,
      createdAt: moment().format("MM/DD/YYYY"),
      role: 'user'
    };

    await createUser(user)
      .then(() => {
        console.log('create user success');
        Constants.user = user;
        AsyncStorage.setItem('user', JSON.stringify(user));
        navigation.navigate('Welcome');
      })
      .catch((err) => {
        console.log('create user error', err);
        setSpinner(false)
      });
  }

  //////////////////
  const onSignin = async () => {
    if (!email) {
      Alert.alert('Please enter email');
      return;
    }
    if (!pwd) {
      Alert.alert('Please enter password');
      return;
    }

    var isConnected = await checkInternet();
    if (!isConnected) {
      Alert.alert('Please check your internet connection.');
      return;
    }

    setSpinner(true);

    await signin(email, pwd)
      .then((user) => {
        //console.log('signin success', user);

        if (!user.active) {
          Alert.alert(
            'You are banned by admin.',
            '',
            [
              { text: "OK", onPress: () => setSpinner(false) }
            ],
          );
          return;
        }

        setSpinner(false);

        Constants.user = user;
        AsyncStorage.setItem('user', JSON.stringify(user));
        navigation.reset({
          index: 0,
          routes: [{name: 'Welcome'}],
        });
        navigation.navigate('Home', { screen: 'BusinessList' });
      })
      .catch((err) => {
        console.log('signin errr', err);

        Alert.alert(
          'Signing is failed.',
          'Please try again.',
          [
            { text: "OK", onPress: () => setSpinner(false) }
          ],
        );
      });
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Spinner
        visible={spinner}
        textContent={''}
      />
      <ImageBackground style={styles.mainContainer} source={Images.background}>
        <View style={styles.headerView}>
          <StatusBar barStyle="dark-content" hidden={false} backgroundColor={Colors.statusBarColor} translucent={false} />
          {
            page !== 'all' &&
            <AppHeader
                leftIconPath={Images.headerLeftBack}
                bgColor={'transparent'}
                tintColor={Colors.white}
                onLeftIconPress={() => setPage('all')}
            />
          }
        </View>
        <View style={styles.upperView}>
            <Image
                style={styles.imageStyles}
                source={Images.logo}  >
            </Image>
        </View>
        <View style={styles.label}>
          {
            page === 'email' &&
            <Text style={styles.labelTxt}>Login</Text>
          }
          {
            page === 'all' &&
            <Text style={styles.labelTxt}>Sign Up With</Text>
          }
        </View>
        <View style={styles.body}>
          {
            page === 'all' &&
            <View style={styles.btnsContainer}>
              {/*<TouchableOpacity style={[styles.btn, { backgroundColor: '#3b8fe2' }]} onPress={() => onFacebookSignin()}>*/}
              {/*  <View style={styles.btnIcon}>*/}
              {/*    <FontAwesomeIcon name="facebook" style={[styles.btnIconTxt, { color: Colors.whiteColor }]}></FontAwesomeIcon>*/}
              {/*  </View>*/}
              {/*  <Text style={styles.btnTxt}>Sign in with Facebook</Text>*/}
              {/*</TouchableOpacity>*/}
              {/*<TouchableOpacity style={[styles.btn, { backgroundColor: '#fff', borderColor: Colors.greyWeakColor, borderWidth: 2 }]} onPress={() => onGoogleSignin()}>*/}
              {/*  <Image style={styles.btnIcon} source={Images.google} />*/}
              {/*  <Text style={[styles.btnTxt, { color: Colors.blackColor }]}>Sign in with Google</Text>*/}
              {/*</TouchableOpacity>*/}
              {/*/!* {*/}
              {/*  Platform.OS === 'ios' && *!/*/}
              {/*  <TouchableOpacity style={[styles.btn, { backgroundColor: '#fff', borderColor: Colors.greyWeakColor, borderWidth: 2 }]} onPress={() => onAppleSignin()}>*/}
              {/*    <Image style={[styles.btnIcon,{tintColor:Colors.blackColor}]} source={Images.appleIcon} />*/}
              {/*    <Text style={[styles.btnTxt, { color: Colors.blackColor }]}>Sign in with Apple</Text>*/}
              {/*  </TouchableOpacity>*/}
              {/*/!* } *!/*/}
              <TouchableOpacity style={[styles.btn, { backgroundColor: Colors.yellowToneColor }]} onPress={() => navigation.navigate('Signup')}>
                <View style={styles.btnIcon}>
                  <EntypoIcon name="mail" style={styles.btnIconTxt}></EntypoIcon>
                </View>
                <Text style={[styles.btnTxt, { color: Colors.blackColor }]}>Sign up with Email</Text>
              </TouchableOpacity>
            </View>
          }
          {
            page == 'email' &&
            <View style={styles.widgetContainer}>
              {/* <TextInput
                style={styles.inputBox}
                autoCapitalize='none'
                placeholder={'Email'}
                placeholderTextColor={Colors.greyColor}
                value={email}
                onChangeText={(text) => setEmail(text)}
              >
              </TextInput> */}
              <AppDoubleInput
                placeholder={'EMAIL'}
                paddingLeft={wp(5)}
                marginBottom={wp(1)}
                marginTop={5}
                borderRadius={wp(7)}
                borderWidth={wp(0.3)}
                backgroundColor={'transparent'}
                colortextInput={Colors.white}
                placeholderTextColor={Colors.white}
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
              {/* <TextInput
                style={[styles.inputBox, { marginTop: normalize(10, 'height') }]}
                autoCapitalize='none'
                secureTextEntry={true}
                placeholder={'Password'}
                placeholderTextColor={Colors.greyColor}
                value={pwd}
                onChangeText={(text) => setPwd(text)}
              >
              </TextInput> */}
              <AppDoubleInput
                placeholder={'PASSWORD'}
                secureEntry={true}
                paddingLeft={wp(5)}
                marginBottom={wp(1)}
                marginTop={10}
                borderRadius={wp(7)}
                borderWidth={wp(0.3)}
                backgroundColor={'transparent'}
                colortextInput={Colors.white}
                placeholderTextColor={Colors.white}
                value={pwd}
                onChangeText={(text) => setPwd(text)}
              />
              <View style={styles.checkBoxContainer}>
                <CheckBox
                  style={{ width: 20, height: 20, marginLeft: 10 }}
                  value={rememberMe}
                  disabled={false}
                  boxType={'square'}
                  onValueChange={() => {
                    setRememberMe(!rememberMe);
                    if (!rememberMe) {
                      AsyncStorage.setItem('hunteruserremember', 'yes');
                      AsyncStorage.setItem('hunteruseremail', email);
                      AsyncStorage.setItem('hunteruserpwd', pwd);
                    }
                    else {
                      AsyncStorage.removeItem('hunteruserremember');
                      AsyncStorage.removeItem('hunteruseremail');
                      AsyncStorage.removeItem('hunteruserpwd');
                    }
                  }}
                  tintColor = {Colors.appGreenColor}
                  onCheckColor = {Colors.blackColor}
                  onFillColor = {Colors.appGreenColor}
                  onTintColor = {Colors.appGreenColor}
                  tintColors = { {'true': Colors.appGreenColor, 'false': Colors.appGreenColor} }
                />
                <Text style={styles.checkLbl}>Remember Me</Text>
              </View>

              <TouchableOpacity style={[styles.btn, { backgroundColor: Colors.yellowToneColor }]} onPress={() => onSignin()}>
                <Text style={[styles.btnTxt, { color: Colors.blackColor }]}>LOG IN</Text>
              </TouchableOpacity>
            </View>
          }

          <View style={styles.otherLink}>
            {
              page === 'all' &&
              <TouchableOpacity onPress={() => setPage('email')}>
                <Text style={styles.linkTxt}>Already have an Account.</Text>
              </TouchableOpacity>
            }
            {
              page === 'email' &&
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPwd')}>
                <Text style={styles.linkTxt}>Forgot Password</Text>
              </TouchableOpacity>
            }
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView >
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
  },
  mainContainer:
  {
      width: '100%',
      height: '100%',
      backgroundColor: Colors.white,
  },
  headerView:
  {
      width: '100%',
      height: '9%',
      paddingTop: '3%',
  },
  upperView:
  {
      height: '30%',
      justifyContent: 'center',
      alignItems: 'center',
  },
  imageStyles:
  {
      height: '70%',
      width: '70%',
      resizeMode: 'contain',
  },
  imgBack: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0
  },
  backIconRow: {
    width: '9%',
    height: '5%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    top: normalize(50, 'height'),
    zIndex: 10,
    // marginTop: normalize(50, 'height'),
  },
  backIcon: {
    fontSize: RFPercentage(2.5),
    color: Colors.whiteColor,
  },
  label: {
    width: '100%',
    height: '6%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  labelTxt: {
    fontSize: RFPercentage(3),
    color: Colors.whiteColor
  },
  body: {
    width: '100%',
    height: '55%',
    alignItems: 'center',
    marginTop: normalize(20, 'height')
  },
  btnsContainer: {
    width: '80%',
    height: '65%',
    justifyContent: 'space-around',
    marginTop: normalize(15, 'height'),
    // borderWidth: 2
  },
  otherLink: {
    width: '80%',
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(20, 'height'),
    // borderWidth: 2
  },
  linkTxt: {
    fontSize: RFPercentage(2),
    color: Colors.blue_button,
    //textDecorationLine: 'underline'
  },

  btn: {
    width: '100%',
    height: normalize(45, 'height'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(8),
  },
  btnIcon: {
    width: normalize(25),
    height: normalize(25),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: normalize(20),
    resizeMode: 'contain',
  },
  btnIconTxt: {
    fontSize: RFPercentage(3.5),
    color: Colors.blackColor,
  },
  btnTxt: {
    fontSize: RFPercentage(2.2),
    color: Colors.whiteColor
  },

  widgetContainer: {
    width: '80%',
    marginTop: normalize(30, 'height'),
    // borderWidth: 2
  },
  inputBox: {
    width: '100%',
    height: normalize(45, 'height'),
    backgroundColor: Colors.greyWeakColor,
    fontSize: RFPercentage(2.5),
    borderRadius: normalize(8),
    paddingLeft: normalize(10),
  },
  checkBoxContainer: {
    width: '100%',
    height: normalize(45, 'height'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkLbl: {
    fontSize: RFPercentage(1.8),
    color: Colors.whiteColor,
    marginLeft: normalize(10)
  },
});
