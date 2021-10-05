import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../../utils/constants';
import Carousel from '../Carousel';

const {width} = Dimensions.get('window');

export default class AdvertisementSection extends React.PureComponent
{
    render()
    {
        const {onPressAds = () => {}, images = []} = this.props;

        return(
            <View style={styles.adsContainer}>

                <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitleText}>PUBLICIDAD</Text>
                </View>

                <Carousel  
                    images={images}
                    imageResizeMode={'cover'} 
                    dotsColor={COLORS._1B42CB}
                    onTapImage={onPressAds}
                    autoscroll={true}
                    showIndicator={false}
                />

            </View>
        )
    }


}


const styles = StyleSheet.create({
    adsContainer: {width: '100%', backgroundColor: COLORS._FFFFFF},
    sectionTitleContainer: {padding: 15},
    sectionTitleText: {fontSize: 12, color: COLORS._A5A5A5, fontFamily: FONTS.REGULAR},
    adsImageContainer: {width, height: (width / 2), },
    adsImage: {height: '100%', width: '100%', },
})