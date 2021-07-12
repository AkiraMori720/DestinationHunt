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
  BackHandler,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';
import KeyboardManager from 'react-native-keyboard-manager'

import firebase from '@react-native-firebase/app';

import {
  GiftedChat,
  Time,
  Composer,
  Send,
  InputToolbar,
  Message,
  Bubble,
} from "react-native-gifted-chat";

import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();

import AppHeader from '../../components/AppHeader/AppHeader';
import { Colors, Images, Constants } from '@constants';
import { checkInternet } from '../../service/firebase';

export default function ChatScreen({ navigation, route }) {
  const [messages, setMessages] = useState([]);

  const user = Constants.user;
  const chatee = Constants.users.find(each => each.id == route.params.chateeId);

  const [chatRef, setChatRef] = useState();
  const [chats, setChats] = useState([])

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => { });

    makeChat();
    // eslint-disable-next-line prettier/prettier
    
    if(Platform.OS === 'ios'){
      KeyboardManager.setEnable(false);
    }

    return (() => {
      backHandler.remove()
    })
  }, [])

  const makeChat = async () => {
    var chatID = user.id < chatee.id ? user.id + '-' + chatee.id : chatee.id + '-' + user.id;

    const chatRef = firebase.database().ref('chat/' + chatID);
    setChatRef(chatRef);

    chatRef.on('value', snapshot => {
      const chatsObj = snapshot.val();
      let chats = [];
      for (let key in chatsObj) {
        chats.push(chatsObj[key]);        
      }
      chats.sort(function(a, b){return b.createdAt - a.createdAt});
      setChats(chats);
    });
  }

  const onSendMessage = async (messages = []) => {
    var isConnected = await checkInternet();
    if (!isConnected) {
      Alert.alert('Please check your internet connection.');
      return;
    }

    messages.forEach(message => {
      if (message.text.trim() == "") {
        return;
      }

      const chat = {        
        _id: message._id,
        text: message.text,
        user: { 
          _id: user.id,
          avatar: user.img
        },
        createdAt: new Date().getTime()
      }

      chatRef.push(chat);
    });
  }

  const renderTime = (props) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Time {...props} />
      </View>
    );
  }

  const renderComposer = (props) => {
    return (
      <Composer
        {...props}
        containerStyle={{backgroundColor:Colors.blackColor,marginLeft: 15,
            marginRight: 15,
            marginBottom: 10,
            borderWidth: 0.5,
            borderColor: Colors.greyWeakColor,
            borderRadius: 25, justifyContent: 'center' }}
        textInputProps={{
          returnKeyType: 'send',
          multiline: false,
          onSubmitEditing: event => {
            props.onSend({ text: event.nativeEvent.text.trim() }, true);
          },
        }}
      />
    );
  }

  const renderSend = (props) => {
    return (
    <Send {...props} containerStyle={{ width:normalize(50,'width'),backgroundColor:Colors.blackColor,alignContent:'center', justifyContent: 'center' }}>
      <EntypoIcon name="paper-plane" style={{fontSize:RFPercentage(3),color:Colors.greyWeakColor,marginLeft:normalize(10,'width')}}/>
    </Send>
    );
  }

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar {...props} containerStyle={{backgroundColor:Colors.blackColor}}>
        
      </InputToolbar>
    );
  }

  const renderMessage = (props) => {
    return (
      <Message {...props}>

      </Message>
    )
  }

  const renderBubble = (props) => {
    return (
      <Bubble {...props} wrapperStyle={{
        left: {
          backgroundColor: Colors.blackColor,
          borderRadius: 20,
          borderBottomLeftRadius: 20,
          borderTopLeftRadius: 20,
        },
        right: {
          backgroundColor: Colors.dark_gold,
          borderRadius: 20,
          borderBottomRightRadius: 20,
          borderTopRightRadius: 20,
        }
      }} 

      timeTextStyle={{
        left: {
          color: Colors.whiteColor,
        },
        right: {
          color: Colors.blackColor,
        },
      }}

      textStyle={{
          right: {
            color: Colors.whiteColor
          },
          left:{
            color: Colors.whiteColor
          }
        }}
      >

      </Bubble>
    )
  }


  return (
    <View style={styles.container}>

      <View style={styles.header}>
        {/* <View style={styles.iconBackContainer}>
          <TouchableOpacity onPress={() => navigation.goBack(null)}>
            <EntypoIcon name="chevron-thin-left" style={styles.headerIcon}></EntypoIcon>
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTxt}>{chatee.name}</Text>
        </View> */}
        <AppHeader
              title={chatee.name}
              leftIconPath={Images.headerLeftBack}
              //onLeftIconPress={() => navigation.navigate('Home', { screen: 'BusinessList' })}
              onLeftIconPress={()=>navigation.goBack(null)}
        />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'padding' : null} style={styles.giftedChat} keyboardVerticalOffset={30}>
        <GiftedChat
          messages={chats}
          textInputProps={{}}
          onSend={messages => onSendMessage(messages)}
          user={{ _id: user.id }}
          isAnimated
          showAvatarForEveryMessage
          renderAvatarOnTop={true}
          alwaysShowSend={true}
          scrollToBottom
          renderLoading={() => (<ActivityIndicator size="large" color="#0000ff" />)}
          renderTime={timeProps => renderTime(timeProps)}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderSend={renderSend}
          renderMessage = {renderMessage}
          renderBubble = {renderBubble}
          textInputStyle = {{backgroundColor:Colors.blackColor, color:Colors.whiteColor}}
        />
      </KeyboardAvoidingView>

    </View>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor:Colors.blackColor,
  },
  header: {
    width: '100%',
    height: normalize(60, 'height'),
    flexDirection: 'row',
    backgroundColor: Colors.blackColor
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
    fontSize: RFPercentage(3.5),
    fontWeight: '600',
    color: Colors.yellowToneColor,
  },

  giftedChat: {
    width: '100%',
    height: '86%',
    backgroundColor: Colors.whiteColor,
  },

});

// import React from 'react'
// import { ScrollView, SafeAreaView, Text, TextInput, Dimensions, StyleSheet } from 'react-native'
// import { GiftedChat, InputToolbar, Composer } from 'react-native-gifted-chat';
// import KeyboardManager from 'react-native-keyboard-manager'

// export default class Chat extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { messages: [] };
//     this.onSend = this.onSend.bind(this);
//   }
//   componentWillMount() {
//     this.setState({
//       messages: [
//         {
//           _id: 1,
//           text: 'Hello developer',  
//           createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
//           user: {
//             _id: 2,
//             name: 'React Native',
//             avatar: 'https://facebook.github.io/react/img/logo_og.png',
//           },
//         },
//       ],
//     });

//     KeyboardManager.setEnable(false);
//   }
//   onSend(messages = []) {
//     this.setState((previousState) => {
//       return {
//         messages: GiftedChat.append(previousState.messages, messages),
//       };
//     });
//   }

//   renderInputToolbar(props) {
//     //Add the extra styles via containerStyle
//     return <InputToolbar {...props} containerStyle={{ borderTopWidth: 1.5, borderTopColor: '#333' }} />
//   }

//   renderComposer(props) {
//     return (
//       <Composer
//         {...props}
//         textInputProps={{
//           // returnKeyType: 'send',
//           multiline: false,
//           onSubmitEditing: event => {
//             props.onSend({ text: event.nativeEvent.text.trim() }, true);
//           },          
//         }}
//       />
//     );
//   }

//   render() {
//     return (
//       <ScrollView contentContainerStyle={{flex: 1}} style={styles.container} keyboardShouldPersistTaps='always' >
//         <GiftedChat
//           messages={this.state.messages}
//           onSend={this.onSend}
//           user={{
//             _id: 1,
//           }}
//           renderInputToolbar={this.renderInputToolbar}
//           renderComposer={this.renderComposer}          
          
          
//         />
        
//       </ScrollView>

//     );
//   }
// }

// const width = Dimensions.get('window').width;
// const height = Dimensions.get('window').height;

// const styles = StyleSheet.create({
//   container: {
//     width: width,
//     height: height,
//     flex: 0.5,
//     borderWidth: 5
//   }
// })