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
  Modal,
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import AppHeader from '../../components/AppHeader/AppHeader';
import AppDoubleInput from '../../components/AppDoubleInput/AppDoubleInput';
import MyModel from '../../components/Model/Model';

import { Colors, Images, Constants } from '@constants';
import { signup, createUser, setData, checkInternet } from '../../service/firebase';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [pwdValidObj, setPwdValidObj] = useState({
    sixCharacters: false,
    letter: false,
    number: false,
    specialCharacter: false
  })
  const [spinner, setSpinner] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const validateEmail = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email);
  };

  function hasNumber(password){
    return /\d/.test(password);
  }

  function hasLetter(password) {
      return password.search(/[a-z]/i) < 0 ? false : true;
  }

  function hasSpecial(password) {
      const re = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      return re.test(String(password));
  }

  const navigateScreem = ()=>{
    navigation.navigate('termAndCondition') , this.setModalVisible(!this.state.modalVisible);
  };
  const Privacy = ()=>{
    navigation.navigate('Privacy') , this.setModalVisible(!this.state.modalVisible);
  };

  const accept = async()=> {
      setModalVisible(false);
      setSpinner(true);
      await signup(email, pwd)
      .then(async (res) => {
        var user = {
          id: res.user.uid,
          name: '',
          img: '',
          email: email,
          pwd: '',
          address: '',
          location: {
            latitude: null,
            longitude: null
          },
          favorbids: [],
          favorsids: [],
          active: true,
          createdAt: moment().format("MM/DD/YYYY"),
          role: 'user'
        }

        await createUser(user)
          .then(() => {
            console.log('create user success');
            Alert.alert(
              'Account created!',
              '',
              [
                {
                  text: "OK", onPress: () => {
                    setSpinner(false);
                    Constants.user = user;
                    AsyncStorage.setItem('user', JSON.stringify(user));
                    navigation.navigate('Welcome');
                  }
                }
              ],
            )
          })
          .catch((err) => {
            console.log('create user error', err);
            setSpinner(false)
          });
      })
      .catch((err) => {
        console.log('signup error', err);
        if (err.code === 'auth/email-already-in-use') {
          Alert.alert(
            'That email address is already in use!',
            '',
            [
              { text: "OK", onPress: () => setSpinner(false) }
            ],
          )
        }
        if (err.code === 'auth/invalid-email') {
          Alert.alert(
            'That email address is invalid!',
            '',
            [
              { text: "OK", onPress: () => setSpinner(false) }
            ],
          );
        }
      });
  }

  const onChangeEmail = (text) => {
    setEmail(text);
    if (!text) {
      setEmailValid(false);
      return;
    }

    if (validateEmail()) {
      setEmailValid(true);
    }
    else {
      setEmailValid(false);
    }
  }

  /* const onChangePwd = (text) => {
    setPwd(text);

    var pwdChkObj = {
      sixCharacters: false,
      letter: false,
      number: false,
      specialCharacter: false
    };
    setPwdValidObj(pwdChkObj);

    if (text.length >= 6 && !pwdValidObj.sixCharacters) {
      var pwdChkObj = { ...pwdValidObj, sixCharacters: true };
      setPwdValidObj(pwdChkObj);
      return;
    }
    else if (text.length < 6 && pwdValidObj.sixCharacters) {
      var pwdChkObj = { ...pwdValidObj, sixCharacters: false };
      setPwdValidObj(pwdChkObj);
      return;
    }

    let letterReg = /^[a-zA-Z]+$/;
    let numberReg = /^[0-9]+$/;
    let specialReg = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
    let letterNumberReg = /^[a-zA-Z0-9]+$/;
    let letterSpecialReg = /[a-zA-Z !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
    let numberSpecialReg = /[0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
    let allReg = /[a-zA-z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;

    if (letterReg.test(text) && !numberReg.test(text) && !specialReg.test(text) && !numberSpecialReg.test(text)) {
      var pwdChkObj = { ...pwdValidObj, letter: true };
      setPwdValidObj(pwdChkObj);
    }
    if (!letterReg.test(text) && numberReg.test(text) && !specialReg.test(text) && !letterSpecialReg.test(text)) {
      var pwdChkObj = { ...pwdValidObj, number: true };
      setPwdValidObj(pwdChkObj);
    }
    if (!letterReg.test(text) && !numberReg.test(text) && specialReg.test(text) && !letterNumberReg.test(text)) {
      var pwdChkObj = { ...pwdValidObj, specialCharacter: true };
      setPwdValidObj(pwdChkObj);
    }
    if (letterNumberReg.test(text) && !letterReg.test(text) && !numberReg.test(text)) {
      var pwdChkObj = { ...pwdValidObj, letter: true, number: true };
      setPwdValidObj(pwdChkObj);
    }
    // if (letterSpecialReg.test(text) && !letterReg.test(text) && !specialReg.test(text)) {
    //   var pwdChkObj = { ...pwdValidObj, letter: true, specialCharacter: true };
    //   setPwdValidObj(pwdChkObj);
    // }
    // if (numberSpecialReg.test(text) && !numberReg.test(text) && !specialReg.test(text)) {
    //   var pwdChkObj = { ...pwdValidObj, number: true, specialCharacter: true };
    //   setPwdValidObj(pwdChkObj);
    // }
    // if (!letterReg.test(text) && !numberReg.test(text) && !specialReg.test(text) && !letterNumberReg.test(text) && !letterSpecialReg.test(text) && !numberSpecialReg.test(text) && allReg.test(text)) {
    //   var pwdChkObj = { ...pwdValidObj, letter: true, number: true, specialCharacter: true };
    //   setPwdValidObj(pwdChkObj);
    // }


  } */

  const onChangePwd = (text) => {
    setPwd(text);

    var pwdChkObj = {
      sixCharacters: false,
      letter: false,
      number: false,
      specialCharacter: false
    };

    if (text.length >= 6) {
      pwdChkObj.sixCharacters = true;
    }

    if (hasLetter(text)) {
      pwdChkObj.letter = true;
    }
    if (hasNumber(text)) {
      pwdChkObj.number = true;
    }
    if (hasSpecial(text)) {
      pwdChkObj.specialCharacter = true;
    }
    setPwdValidObj(pwdChkObj);
  }

  const onSignup = async () => {
    if (!email) {
      Alert.alert('Please enter email');
      return;
    }
    if (!emailValid) {
      Alert.alert('Please enter a valid email address');
      return;
    }
    if (!pwd) {
      Alert.alert('Please enter password');
      return;
    }
    // if (!pwdValidObj.sixCharacters || !pwdValidObj.letter || !pwdValidObj.number || !pwdValidObj.specialCharacter) {
    //   Alert.alert('Please endter a valid password');
    //   return;
    // }

    var isConnected = await checkInternet();
    if (!isConnected) {
      Alert.alert('Please check your internet connection.');
      return;
    }

    setTimeout(() => setModalVisible(true), 1000);

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
          <Text style={styles.labelTxt}>Sign up</Text>
        </View>
        <View style={styles.body}>
          {/* <TextInput
            style={styles.inputBox}
            autoCapitalize='none'
            placeholder={'Email'}
            placeholderTextColor={Colors.greyColor}
            value={email}
            onChangeText={(text) => onChangeEmail(text)}
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
              onChangeText={(text)=>onChangeEmail(text)}
          />
          {
            emailValid &&
            <View style={styles.checkLine}>
              <Image style={{ width: 10, height: 10, tintColor:'#00ff00'}} source={Images.ic_check_green} />
              <Text style={styles.checkLbl}>Valid email</Text>
            </View>
          }
         {/*  <TextInput
            style={styles.inputBox}
            autoCapitalize='none'
            secureTextEntry={true}
            placeholder={'Password'}
            placeholderTextColor={Colors.greyColor}
            value={pwd}
            onChangeText={(text) => onChangePwd(text)}
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
              onChangeText={(text)=>onChangePwd(text)}
          />
          {
            pwdValidObj.sixCharacters &&
            <View style={styles.checkLine}>
              <Image style={{ width: 10, height: 10, tintColor:'#00ff00'}} source={Images.ic_check_green} />
              <Text style={styles.checkLbl}>At least 6 characters long.</Text>
            </View>
          }
          {
            pwdValidObj.letter &&
            <View style={styles.checkLine}>
              <Image style={{ width: 10, height: 10, tintColor:'#00ff00'}} source={Images.ic_check_green} />
              <Text style={styles.checkLbl}>Contains a letter.</Text>
            </View>
          }
          {
            pwdValidObj.number &&
            <View style={styles.checkLine}>
              <Image style={{ width: 10, height: 10, tintColor:'#00ff00'}} source={Images.ic_check_green} />
              <Text style={styles.checkLbl}>Contains a number.</Text>
            </View>
          }
          {
            pwdValidObj.specialCharacter &&
            <View style={styles.checkLine}>
              <Image style={{ width: 10, height: 10, tintColor:'#00ff00'}} source={Images.ic_check_green} />
              <Text style={styles.checkLbl}>Contains a special character.</Text>
            </View>
          }

          <TouchableOpacity style={[styles.btn, { backgroundColor: Colors.yellowToneColor }]} onPress={() => onSignup()}>
            <Text style={[styles.btnTxt, { color: Colors.blackColor }]}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);

            }}>

            <MyModel
            onPressPrivacy={()=>Privacy()}
            onPressTerm={()=>navigateScreem()}
            onPressCondition={()=>navigateScreem()}
            onPressAgree={()=>accept()}

            
                onPressCancel={() => {
                    setModalVisible(!modalVisible)}}
            />

        </Modal>
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
      backgroundColor: Colors.blackColor,
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
    // justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: normalize(40, 'height'),
    // borderWidth: 2
  },

  btn: {
    width: '100%',
    height: normalize(45, 'height'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(8),
    marginTop: normalize(20, 'height')
  },
  btnTxt: {
    fontSize: RFPercentage(2.2),
    color: Colors.whiteColor
  },

  inputBox: {
    width: '100%',
    height: normalize(45, 'height'),
    backgroundColor: Colors.greyWeakColor,
    fontSize: RFPercentage(2.5),
    borderRadius: normalize(8),
    marginTop: normalize(10, 'height'),
    paddingLeft: normalize(10),
  },
  checkLine: {
    width: '90%',
    height: normalize(20),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(1, 'height'),
    marginBottom: normalize(5, 'height'),
  },
  checkLbl: {
    fontSize: RFPercentage(1.8),
    color: Colors.white,
    marginLeft: normalize(7)
  },
});