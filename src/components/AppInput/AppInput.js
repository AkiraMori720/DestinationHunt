/* eslint-disable prettier/prettier */
import React from 'react';
import { Image, StyleSheet, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { Colors } from '@constants';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

class AppInput extends React.Component {


    render() {

        let style = this.props.style;
        let shadow = this.props.shadow;

        let height = this.props.height || 40;
        let width = this.props.width || '90%';

        let marginTop = this.props.marginTop || 0;
        let marginBottom = this.props.marginBottom;
        let marginLeft = this.props.marginLeft;
        let marginRight = this.props.marginRight;

        let paddingLeft = this.props.paddingLeft || '0%';
        let paddingRight = this.props.paddingRight;
        let paddingTop = this.props.paddingTop;
        let paddingBottom = this.props.paddingBottom;

        let borderColor = this.props.borderColor || Colors.white;
        let borderWidth = this.props.borderWidth;
        let borderRadius = this.props.borderRadius;
        let borderTopLeftRadius = this.props.borderTopLeftRadius;
        let borderTopRightRadius = this.props.borderTopRightRadius;

        let backgroundColor = this.props.backgroundColor || 'transparent';

        let rightIconSize = this.props.rightIconSize || 22;
        let leftImageHeight = this.props.leftImageHeight || 22;
        let leftImageWidth = this.props.leftImageWidth || 25;


        return (
            <View style={[styles.inputFieldTextView, shadow, style, {
                height: height
                , width: width, marginTop: marginTop, paddingBottom: paddingBottom, marginBottom: marginBottom,paddingRight:paddingRight,
                paddingTop: paddingTop, backgroundColor: backgroundColor,
                paddingLeft: paddingLeft, borderWidth: borderWidth
                , borderColor: borderColor, borderRadius: borderRadius,
                borderTopLeftRadius:borderTopLeftRadius,borderTopRightRadius:borderTopRightRadius,
            }]}>
                {this.props.leftIconPath !== undefined &&

                    <View style={styles.leftImageViewStyle}>
                        <TouchableWithoutFeedback onPress={this.props.onLeftIconPress}>
                            <Image style={this.props.imageStyle !== undefined ? this.props.imageStyle :
                                { height: leftImageHeight, width: leftImageWidth, resizeMode: 'contain', marginLeft: '3%', tintColor:this.props.leftTintColor  }}
                                source={this.props.leftIconPath} />
                        </TouchableWithoutFeedback>
                    </View>
                }
                <TextInput
                    value={this.props.value}
                    secureTextEntry={this.props.secureEntry}
                    style={[styles.inputFieldText, this.props.textInputStyle, { color: this.props.colortextInput || Colors.white,paddingLeft: this.props.paddingLeftText || '0%' }]}
                    onChangeText={this.props.onChangeText}
                    autoCapitalize='none'
                    justifyContent={this.props.justifyContent}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={this.props.placeholderTextColor}
                    onSubmitEditing={this.props.onSubmitEditing}
                    onFocus={this.props.onFocus}
                    onBlur={this.props.onBlur}
                    ref={this.props.ref}
                    multiline={this.props.multiline}
                    maxHeight={this.props.maxHeight}
                    autoGrow={this.props.autoGrow}
                    onContentSizeChange={this.props.onContentSizeChange}
                    onEndEditing={this.props.onEndEditing}
                    keyboardType={this.props.keyboardType}
                />
                {this.props.rightIconPath !== undefined &&
                    <TouchableWithoutFeedback onPress={this.props.onRightIconPress}>
                        <Image
                            source={this.props.rightIconPath}
                            style={{ height: rightIconSize, width: rightIconSize, resizeMode: 'contain', tintColor: this.props.rightTintColor }} />
                    </TouchableWithoutFeedback>}
            </View>
        )
    }


}

const styles = StyleSheet.create({

    inputFieldTextView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        // height:wp(7),
        alignSelf: 'center',
    },
    inputFieldText: {
        paddingLeft: '3%',
        height: '100%',
        width: '85%',
        fontSize: 16,
        // textAlignVertical:'center',
        // marginVertical:'5%',
        // borderLeftColor:Colors.deep_grey,
        // borderLeftWidth:wp(0.1),
        color: Colors.black,

    },
    leftImageViewStyle:
    {
        height: '100%',
        // backgroundColor:'red',
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(2),
        // borderRightColor:Colors.grey,
        // borderRightWidth:wp(0.1),
    }


});
export default AppInput;
