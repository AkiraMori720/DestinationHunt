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
  Alert
} from 'react-native';
import normalize from 'react-native-normalize';
import { RFPercentage } from 'react-native-responsive-fontsize';

import EntypoIcon from 'react-native-vector-icons/Entypo';
EntypoIcon.loadFont();

import AppHeader from '../../components/AppHeader/AppHeader';
import { Colors, Images } from '@constants';

export default function TermsScreen({ navigation }) {
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        {/* <View style={styles.iconBackContainer}>
          <TouchableOpacity onPress={() => navigation.goBack(null)}>
            <EntypoIcon name="chevron-thin-left" style={styles.headerIcon}></EntypoIcon>
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTxt}>Terms and Conditions</Text>
        </View> */}
        <AppHeader
              title={'Terms and Conditions'}
              leftIconPath={Images.headerLeftBack}
              //onLeftIconPress={() => navigation.navigate('Home', { screen: 'BusinessList' })}
              onLeftIconPress={()=>navigation.goBack(null)}
        />
      </View>

      <ScrollView style={styles.termsContainer}>
        <Text style={styles.txt}>
        Last updated: February 15, 2021
        {'\n'}
        Please read these terms and conditions carefully before using Our Service.{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        Interpretation and Definitions
        </Text>
        <Text style={styles.tagTxt2}>
        Interpretation
        </Text>
        <Text style={styles.txt}>
        The words of which the initial letter is capitalized have meanings defined under the following conditions. 
        The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Definitions
        </Text>
        <Text style={styles.txt}>
        For the purposes of these Terms and Conditions:
        {'\n'}
        . Application means the software program provided by the Company downloaded by You on any electronic device, named Destination Hunt
        {'\n'}
        . Application Store means the digital distribution service operated and developed by Apple Inc. (Apple App Store) or Google Inc. (Google Play Store) in which the Application has been downloaded.
        {'\n'}
        . Affiliate means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.
        {'\n'}
        . Country refers to: Kentucky, United States
        {'\n'}
        . Company (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Destination Hunt.
        {'\n'}
        Device means any device that can access the Service such as a computer, a cellphone or a digital tablet.
        {'\n'}
        . Free Trial refers to a limited period of time that may be free when purchasing a Subscription.
        {'\n'}
        .Service refers to the Application.
        {'\n'}
        . Subscriptions refer to the services or access to the Service offered on a subscription basis by the Company to You.
        {'\n'}
        . Terms and Conditions (also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.
        {'\n'}
        . Third-party Social Media Service means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.
        {'\n'}
        . You means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        Acknowledgment
        </Text>
        <Text style={styles.txt}>
        These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.

        Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.

        By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.

        You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.

        Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company. Our Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your personal information when You use the Application or the Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy carefully before using Our Service.{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        Subscriptions
        </Text>
        <Text style={styles.tagTxt2}>
        Subscription period
        </Text>
        <Text style={styles.txt}>
        The Service or some parts of the Service are available only with a paid Subscription. You will be billed in advance on a recurring and periodic basis (such as daily, weekly, monthly or annually), depending on the type of Subscription plan you select when purchasing the Subscription.

        At the end of each period, Your Subscription will automatically renew under the exact same conditions unless You cancel it or the Company cancels it.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Subscription cancellations
        </Text>
        <Text style={styles.txt}>
        You may cancel Your Subscription renewal either through Your Account settings page or by contacting the Company. 
        You will not receive a refund for the fees You already paid for Your current Subscription period and You will be able to access the Service until the end of Your current Subscription period.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Billing
        </Text>
        <Text style={styles.txt}>
        You shall provide the Company with accurate and complete billing information including full name, address, state, zip code, telephone number, and a valid payment method information.

        Should automatic billing fail to occur for any reason, the Company will issue an electronic invoice indicating that you must proceed manually, within a certain deadline date, with the full payment corresponding to the billing period as indicated on the invoice.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Fee Changes
        </Text>
        <Text style={styles.txt}>
        The Company, in its sole discretion and at any time, may modify the Subscription fees. Any Subscription fee change will become effective at the end of the then-current Subscription period.

        The Company will provide You with reasonable prior notice of any change in Subscription fees to give You an opportunity to terminate Your Subscription before such change becomes effective.

        Your continued use of the Service after the Subscription fee change comes into effect constitutes Your agreement to pay the modified Subscription fee amount.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Refunds
        </Text>
        <Text style={styles.txt}>
        Except when required by law, paid Subscription fees are non-refundable.

        Certain refund requests for Subscriptions may be considered by the Company on a case-by-case basis and granted at the sole discretion of the Company.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Free Trial
        </Text>
        <Text style={styles.txt}>
        The Company may, at its sole discretion, offer a Subscription with a Free Trial for a limited period of time.

        You may be required to enter Your billing information in order to sign up for the Free Trial.

        If You do enter Your billing information when signing up for a Free Trial, You will not be charged by the Company until the Free Trial has expired. On the last day of the Free Trial period, unless You cancelled Your Subscription, You will be automatically charged the applicable Subscription fees for the type of Subscription You have selected.

        At any time and without notice, the Company reserves the right to (i) modify the terms and conditions of the Free Trial offer, or (ii) cancel such Free Trial offer.{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        Links to Other Websites
        </Text>
        <Text style={styles.txt}>
        We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.

        Upon termination, Your right to use the Service will cease immediately.{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        Limitation of Liability
        </Text>
        <Text style={styles.txt}>
        Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or 100 USD if You haven't purchased anything through the Service.

        To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of this Terms), even if the Company or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.

        Some states do not allow the exclusion of implied warranties or limitation of liability for incidental or consequential damages, which means that some of the above limitations may not apply. In these states, each party's liability will be limited to the greatest extent permitted by law.{'\n'}
        </Text>

        <Text style={styles.tagTxt1}>
        "AS IS" and "AS AVAILABLE" Disclaimer
        </Text>
        <Text style={styles.txt}>
        The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service, including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement, and warranties that may arise out of course of dealing, course of performance, usage or trade practice. Without limitation to the foregoing, the Company provides no warranty or undertaking, and makes no representation of any kind that the Service will meet Your requirements, achieve any intended results, be compatible or work with any other software, applications, systems or services, operate without interruption, meet any performance or reliability standards or be error free or that any errors or defects can or will be corrected.

        Without limiting the foregoing, neither the Company nor any of the company's provider makes any representation or warranty of any kind, express or implied: (i) as to the operation or availability of the Service, or the information, content, and materials or products included thereon; (ii) that the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency of any information or content provided through the Service; or (iv) that the Service, its servers, the content, or e-mails sent from or on behalf of the Company are free of viruses, scripts, trojan horses, worms, malware, timebombs or other harmful components.

        Some jurisdictions do not allow the exclusion of certain types of warranties or limitations on applicable statutory rights of a consumer, so some or all of the above exclusions and limitations may not apply to You. But in such a case the exclusions and limitations set forth in this section shall be applied to the greatest extent enforceable under applicable law.
        </Text>
        <Text style={styles.tagTxt1}>
        Governing Law
        </Text>
        <Text style={styles.txt}>
        The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        Disputes Resolution
        </Text>
        <Text style={styles.txt}>
        If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company.{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        For European Union (EU) Users
        </Text>
        <Text style={styles.txt}>
        If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country in which you are resident in.{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        United States Federal Government End Use Provisions
        </Text>
        <Text style={styles.txt}>
        If You are a U.S. federal government end user, our Service is a "Commercial Item" as that term is defined at 48 C.F.R. §2.101.{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        United States Legal Compliance
        </Text>
        <Text style={styles.txt}>
        You represent and warrant that (i) You are not located in a country that is subject to the United States government embargo, or that has been designated by the United States government as a "terrorist supporting" country, and (ii) You are not listed on any United States government list of prohibited or restricted parties.{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        Severability and Waiver
        </Text>
        <Text style={styles.tagTxt2}>
        Severability
        </Text>
        <Text style={styles.txt}>
        If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.{'\n'}
        </Text>
        <Text style={styles.tagTxt2}>
        Waiver
        </Text>
        <Text style={styles.txt}>
        Except as provided herein, the failure to exercise a right or to require performance of an obligation under this Terms shall not effect a party's ability to exercise such right or require such performance at any time thereafter nor shall be the waiver of a breach constitute a waiver of any subsequent breach.{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        Translation Interpretation
        </Text>
        <Text style={styles.txt}>
        These Terms and Conditions may have been translated if We have made them available to You on our Service. You agree that the original English text shall prevail in the case of a dispute.{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        Changes to These Terms and Conditions
        </Text>
        <Text style={styles.txt}>
        We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.

        By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the website and the Service.{'\n'}
        </Text>
        <Text style={styles.tagTxt1}>
        Contact Us
        </Text>
        <Text style={styles.txt}>
        The Application may display a third-party-hosted “offer wall.” Such an offer wall allows third-party
        advertisers to offer virtual currency, gifts, or other items to users in return for acceptance and completion
        of an advertisement offer. Such an offer wall may appear in the Application and be displayed to you
        based on certain data, such as your geographic area or demographic information. When you click on an
        offer wall, you will leave the Application. A unique identifier, such as your user ID, will be shared with the
        offer wall provider in order to prevent fraud and properly credit your account.{'\n'}
        If you have any questions about these Terms and Conditions, You can contact us:
        {'\n'}
        By email: jameswbrennan24@gmail.com
        </Text>
      </ScrollView>

    </View>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: Colors.greyWeakColor,
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
    fontSize: RFPercentage(3),
    fontWeight: '600',
    color: Colors.yellowToneColor,
  },

  termsContainer: {
    width: '90%',
    backgroundColor: Colors.whiteColor,
    alignSelf: 'center',
    marginTop: normalize(15, 'height'),
    marginBottom: normalize(15, 'height'),
    padding: normalize(10),    
    borderRadius: normalize(7),
  },
  tagTxt1: {
    fontSize: RFPercentage(3),
    color: Colors.blackColor,
  },
  tagTxt2: {
        fontSize: RFPercentage(2.5),
        color: Colors.blackColor,
  },
  txt: {
    fontSize: RFPercentage(2),
    color: Colors.blackColor,
  },

});