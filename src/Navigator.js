/* eslint-disable prettier/prettier */
import React,{ useState, useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator,DrawerItem } from '@react-navigation/drawer';
import { View, Text, Image, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import SplashScreen from './screens/Splash';

import SigninScreen from './screens/auth/Signin';
import SignupScreen from './screens/auth/Signup';
import ForgotPwdScreen from './screens/auth/ForgotPwd';

import WelcomeScreen from './screens/Welcome';

import ProfileScreen from './screens/profile/Profile';
import ProfileEditScreen from './screens/profile/ProfileEdit';

import MapViewScreen from './screens/home/MapView';
import BusinessListScreen from './screens/home/BusinessList';
import ServiceListScreen from './screens/home/ServiceList';
import ServiceDetailScreen from './screens/home/ServiceDetail';

import MessageListScreen from './screens/message/MessageList';
import ChatScreen from './screens/message/Chat';

import SettingListScreen from './screens/setting/SettingList';
import ContactScreen from './screens/setting/Contact';
import AboutScreen from './screens/setting/About';
import PolicyScreen from './screens/setting/Policy';
import TermsScreen from './screens/setting/Terms';
import RequestScreen from './screens/setting/Request';

import BusinessProfileScreen from './screens/profile/BusinessProfile';
import BusinessProfileEdit from './screens/profile/BusinessProfileEdit';
import BusinessServicesScreen from './screens/home/BusinessServices';
import ServiceEditScreen from './screens/home/ServiceEdit';

import { signOut } from './service/firebase';
import { Colors } from '@constants';
import { Images } from '@constants';
import { Constants } from '@constants';

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      headerMode='none'
      initialRouteName='Signin'
    >
      <Stack.Screen
        name='Signin'
        component={SigninScreen}
      />
      <Stack.Screen
        name='Signup'
        component={SignupScreen}
      />      
      <Stack.Screen
        name='ForgotPwd'
        component={ForgotPwdScreen}
      />      
    </Stack.Navigator>
  )
}

function ProfileStack(){
  return (
    <Stack.Navigator
      headerMode='none'
      initialRouteName='Profile'
    >
      <Stack.Screen
        name='Profile'
        component={ProfileScreen}
      />
      <Stack.Screen
        name='ProfileEdit'
        component={ProfileEditScreen}
      />
    </Stack.Navigator>
  )
}

function HomeStack(){
  return (
    <Stack.Navigator
      headerMode='none'            
    >
      <Stack.Screen
        name='MapView'
        component={MapViewScreen}
      />
      <Stack.Screen
        name='BusinessList'
        component={BusinessListScreen}
      />         
      <Stack.Screen
        name='ServiceList'
        component={ServiceListScreen}
      />         
      <Stack.Screen
        name='ServiceDetail'
        component={ServiceDetailScreen}
      />         
    </Stack.Navigator>
  )
}

function MessageStack (){
  return (
    <Stack.Navigator
      headerMode='none'
      initialRouteName='MessageList'
    >
      <Stack.Screen
        name='MessageList'
        component={MessageListScreen}
      />
      <Stack.Screen
        name='Chat'
        component={ChatScreen}
      />               
    </Stack.Navigator>
  )
}

function SettingStack (){
  return (
    <Stack.Navigator
      headerMode='none'
      initialRouteName='SettingList'
    >
      <Stack.Screen
        name='SettingList'
        component={SettingListScreen}
      />
      <Stack.Screen
        name='Contact'
        component={ContactScreen}
      />               
      <Stack.Screen
        name='About'
        component={AboutScreen}
      />               
      <Stack.Screen
        name='Policy'
        component={PolicyScreen}
      />               
      <Stack.Screen
        name='Terms'
        component={TermsScreen}
      />               
      <Stack.Screen
        name='Request'
        component={RequestScreen}
      />               
    </Stack.Navigator>
  )
}

function BusinessProfileStack (){
  return (
    <Stack.Navigator
      headerMode='none'
      initialRouteName='BusinessProfile'
    >
      <Stack.Screen
        name="BusinessProfile"
        component={BusinessProfileScreen}
      />
      <Stack.Screen
        name="BusinessProfileEdit"
        component={BusinessProfileEdit}
      />
    </Stack.Navigator>
  )
}

function BusinessServiceStack (){
  return (
    <Stack.Navigator
      headerMode='none'
      initialRouteName='BusinessServices'
    >
      <Stack.Screen
        name="BusinessServices"
        component={BusinessServicesScreen}
      />
      <Stack.Screen
          name="ServiceEdit"
          component={ServiceEditScreen}
      />
      <Stack.Screen
        name='BusinessServiceDetail'
        component={ServiceDetailScreen}
      />
    </Stack.Navigator>
  );
}

function CustomDrawerContent(props) {
  const user = Constants.user;


  function onSignout() {
    Alert.alert(
      'Are you sure want to log out?',
      '',
      [
        {
          text: "OK", onPress: () => {
            signOut();
            AsyncStorage.removeItem('user');
            props.navigation.navigate('Auth');
          }
        },
        { text: "CANCEL", onPress: () => { } }
      ],
    );
  }

  return (
          <SafeAreaView {...props} style={styles.drawerMainContainer}  >
              <View style={styles.userInfoContainer}>
                  <TouchableOpacity
                      style={styles.userImageContainer} >
                      <Image source={user.img ? {uri:user.img} : Images.ic_profile}  style={styles.userProfileImage} resizeMode={"contain"}/>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={styles.userTextContainer}>
                      <Text style={styles.userNameText}>Welcome, {user.firstname}</Text>
                  </TouchableOpacity>
              </View>
              <View style={styles.drawerItemsContainer} >
                  <DrawerItem
                      style={styles.drawerItemStyles}
                      label={()=><Text style={styles.drawerItemLabelText} >{"Profile"}</Text>}
                      icon={()=> <Image source={Images.ic_home}
                                        style={styles.drawerItemImage}
                      />}
                      onPress={()=>props.navigation.navigate('BusinessProfile')}
                  />
                  <DrawerItem
                      style={styles.drawerItemStyles}
                      label={()=><Text style={styles.drawerItemLabelText} >{"Services"}</Text>}
                      icon={()=> <Image source={Images.ic_home}
                                        style={styles.drawerItemImage}
                      />}
                      onPress={()=>props.navigation.navigate('BusinessServices')}
                  />
                  <DrawerItem
                      style={styles.drawerItemStyles}
                      label={()=><Text style={styles.drawerItemLabelText} >{"Messages"}</Text>}
                      icon={()=> <Image source={Images.ic_message} style={styles.drawerItemImage}
                      />}
                      onPress={()=>props.navigation.navigate('Message')}
                  />
                  <DrawerItem
                      style={styles.drawerItemStyles}
                      label={()=><Text style={styles.drawerItemLabelText} >{"Settings"}</Text>}
                      icon={()=> <Image source={Images.ic_settings} style={styles.drawerItemImage}
                      />}
                      onPress={()=>props.navigation.navigate('Setting')}
                  />
              </View>
              <View style={{height:'10%', width:"100%",marginBottom:wp(10), marginLeft:-10}}>
                  <DrawerItem
                      style={[styles.drawerItemStyles,{backgroundColor:Colors.dark_red}]}
                      label={()=><Text style={[styles.drawerItemLabelText,{color:Colors.white,fontWeight:'bold'}]} >{"Logout"}</Text>}
                      icon={()=> <Image source={Images.ic_logout} style={[styles.drawerItemImage,{tintColor: Colors.white}]}
                      />}
                      onPress={()=>onSignout()}
                  />
              </View>
          </SafeAreaView>
  );
}


const Drawer = createDrawerNavigator();

function drawerNav() {
  return (
      <Drawer.Navigator
          // drawerStyle={{backgroundColor:"#F4F4F4"}}
          initialRouteName="BusinessProfile"
          drawerContent={props => CustomDrawerContent(props)}>
          <Drawer.Screen name="BusinessProfile" component={BusinessProfileStack} />
          <Drawer.Screen name="BusinessServices" component={BusinessServiceStack} />
          <Drawer.Screen name="Message" component={MessageStack} />
          <Drawer.Screen name="Setting" component={SettingStack} />
      </Drawer.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode='none' initialRouteName="Splash" screenOptions={{ cardStyle: {backgroundColor: Colors.blackColor }}}>
        <Stack.Screen name='Splash' component={SplashScreen} />
        <Stack.Screen name='Auth' component={AuthStack} />
        <Stack.Screen name='Welcome' component={WelcomeScreen} />
        <Stack.Screen name='Profile' component={ProfileStack} />        
        <Stack.Screen name='Home' component={HomeStack} />        
        <Stack.Screen name='Message' component={MessageStack} />
        <Stack.Screen name='Setting' component={SettingStack} />
        <Stack.Screen name="drawer" component={drawerNav}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

let styles = {
  drawerMainContainer:{
      width:"100%",
      height:hp(100),
      backgroundColor:Colors.dark_black,
  },
  userInfoContainer:{
      width:"100%",
      height:"20%",
      paddingTop:wp(5),
      backgroundColor:Colors.dark_black,
      flexDirection:"row"
  },
  userImageContainer: {
      width:"40%",
      justifyContent:"center",
      alignItems:"center"
  },

  userProfileImage:{
      width:wp(23),
      height:wp(23),
      resizeMode:'cover',
      borderRadius:wp(11.5),
  },
  userTextContainer:{
      width:"60%",
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"flex-start",
      paddingLeft:wp(5),
  },
  userNameText:{
      textAlign:"center",
      color:Colors.white,
      fontSize:17,
      fontWeight: "bold"
  },
  emailText:{
      marginTop:5,
      textAlign:"center",
      color:"white",
      fontSize:13
  },
  drawerItemsContainer:{
      width:"100%",
      height:"65%",
      marginTop:10,
      marginLeft:-10,
  },
  drawerItemLabelText:{
      fontWeight: "500",
      fontSize:wp(4),
      color:Colors.white,
  },
  drawerItemImage:{
       width:17,
      height:17,
      tintColor:Colors.white,
      resizeMode:"contain",
      marginLeft: 7,

  }
  ,
  drawerItemStyles:
      {
          height:wp(15),
          width:'100%',
          marginVertical:wp(0.5),
          backgroundColor:Colors.dark_black,
          justifyContent:'center',
      }

};



export default App;