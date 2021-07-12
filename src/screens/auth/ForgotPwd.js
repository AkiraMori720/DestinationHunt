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
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();
import Spinner from 'react-native-loading-spinner-overlay';
import AppHeader from '../../components/AppHeader/AppHeader';
import AppDoubleInput from '../../components/AppDoubleInput/AppDoubleInput';

import { Colors, Images } from '@constants';
import { resetPassword } from '..//../service/firebase';

export default function ForgotPwdScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [spinner, setSpinner] = useState(false);

  const validateEmail = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email);
  }

  function onResetPwd() {
    if (!email) {
      Alert.alert('Please enter email');
      return;
    }
    if (!validateEmail()) {
      Alert.alert('Please enter a valid email');
      return;
    }

    setSpinner(true);

    resetPassword(email)
      .then((res) => {
        // console.log('reset password success');
        Alert.alert(
          "Reset Password", 
          "We have sent a reset password link to your email.",           
          [
            { text: "OK", onPress: () => {setSpinner(false); navigation.navigate('Signin');}}
          ],
        );                
      })
      .catch((err) => {
        console.log('reset password error', err)        
        if (err.code == 'auth/user-not-found') {
          Alert.alert(
            'This is not registered account!',
            '',
            [
              { text: "OK", onPress: () => {setSpinner(false)}}
            ],
          );
        }
      })
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Image style={styles.imgBack} source={Images.authBack} />
      <Spinner
        visible={spinner}
        textContent={''}
      />
      {/* <View style={styles.backIconRow}>
        <TouchableOpacity onPress={() => navigation.goBack(null)}>
          <EntypoIcon name="chevron-thin-left" style={styles.backIcon}></EntypoIcon>
        </TouchableOpacity>
      </View> */}
      <ImageBackground style={styles.mainContainer} source={Images.background}>
        <View style={styles.headerView}>
          <StatusBar barStyle="dark-content" hidden={false} backgroundColor={Colors.statusBarColor} translucent={false} />
          <AppHeader
              leftIconPath={Images.headerLeftBack}
              bgColor={'transparent'}
              tintColor={Colors.white}
              onLeftIconPress={() => navigation.goBack(null)}
          />
        </View>
        <View style={styles.upperView}>
            <Image
                style={styles.imageStyles}
                source={Images.logo}  >
            </Image>
        </View>
        <View style={styles.label}>
          <Text style={styles.labelTxt}>Forgot Password</Text>
        </View>
        <View style={styles.body}>
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
                marginBottom={wp(5)}
                marginTop={5}
                borderRadius={wp(7)}
                borderWidth={wp(0.3)}
                backgroundColor={'transparent'}
                colortextInput={Colors.white}
                placeholderTextColor={Colors.white}
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
          <View style={styles.tipContainer}>
            <Text style={styles.tip}>
              Input the email used to create your account.
              We will send you a link to reset your password.
            </Text>
          </View>

          <TouchableOpacity style={styles.btn} onPress={() => onResetPwd()}>
            <Text style={styles.btnTxt}>RESET PASSWORD</Text>
          </TouchableOpacity>

        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
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
    width: '80%',
    height: '50%',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: normalize(20, 'height'),
    // borderWidth: 2
  },

  btn: {
    width: '100%',
    height: normalize(45, 'height'),
    backgroundColor: Colors.yellowToneColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(8),
  },
  btnTxt: {
    fontSize: RFPercentage(2.2),
    color: Colors.blackColor
  },

  inputBox: {
    width: '100%',
    height: normalize(45, 'height'),
    backgroundColor: Colors.greyWeakColor,
    fontSize: RFPercentage(2.5),
    borderRadius: normalize(8),
    paddingLeft: normalize(10),
  },
  tipContainer: {
    width: '80%',
    height: normalize(150),
    marginTop: normalize(0, 'height')
  },
  tip: {
    fontSize: RFPercentage(2.2),
    color: Colors.white,
    textAlign: 'center'
  },
});