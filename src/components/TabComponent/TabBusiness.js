/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors, Images } from '@constants';



export default class TabComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leftBgColor: Colors.blue_button,
            middleBgColor: 'transparent',
            leftTextColor: Colors.white,
            middleTextColor: Colors.white,
        }

    }

    onLeftPress = () => {
        if (this.state.leftBgColor === 'transparent') {
            this.setState({ leftBgColor:Colors.blue_button, middleBgColor:'transparent'})
        }

        this.props.onLeftPress();
    };

    onMiddlePress = () => {
        if (this.state.middleBgColor === 'transparent') {
            this.setState({ leftBgColor:'transparent', middleBgColor:Colors.blue_button})
        }
        this.props.onMiddlePress();

    };

    render() {
        return (
            <View style={styles.mainContainer} >

                <View style={{ flexDirection: 'row', justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => this.onLeftPress()} style={{
                        backgroundColor: this.state.leftBgColor,
                        width: wp(33.3),
                        height: hp(7),
                        justifyContent: "center"
                        , alignItems: "center",
                        flexDirection:'row',
                        // borderBottomWidth: this.state.leftBorderWidth,
                        // borderBottomColor: this.state.leftBottomColor,
                    }}>
                    <Text style={{ color: this.state.leftTextColor,paddingLeft:'6%', fontSize: wp(4.3),fontWeight:'bold' }} >{this.props.leftText}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.onMiddlePress()} style={{
                        backgroundColor: this.state.middleBgColor,
                        width: wp(33.3)
                        , height: hp(7),
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection:'row',
                        // borderBottomWidth: this.state.middleBorderWidth,
                        // borderBottomColor: this.state.middleBottomColor
                    }}>
                        <Text style={{ color: this.state.middleTextColor, paddingLeft:'6%',fontSize: wp(4.3),fontWeight:'bold' }}>{this.props.middleText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        // flex:1,
        // backgroundColor:'grey',


    },

    container: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'green'
    },


});


