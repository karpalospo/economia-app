import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { Truncate } from '../../utils/helper';
import { COLORS, FONTS } from '../../utils/constants';

export default class SponsoredBrandCard extends React.PureComponent
{
    static propTypes = {
        image: PropTypes.any.isRequired, /* accepts Uri objects or require images */
        name: PropTypes.string,
        description: PropTypes.string,
        onPressCard: PropTypes.func,
    }


    render()
    {
        const {image, name = "", description = "", onPressCard = () => {}} = this.props;

        return(
            <TouchableOpacity style={styles.cardContainer} onPress={onPressCard}>
                
                {/* Image container */}
                <View style={styles.cardImageWrapper}>
                    <View style={styles.cardImageContainer}>
                        <Image source={image} style={styles.cardImage} resizeMode='contain' />
                    </View>
                </View>

                {/* Description */}
                <View style={styles.cardDescriptionContainer}>
                    <Text style={styles.cardNameText}>{Truncate(name, 30)}</Text>
                    {/* {description != '' &&
                    <Text style={styles.cardDescriptionText}>{description}</Text>} */}
                </View>

                <View style={styles.rightArrowContainer}>
                    <Image source={require('../../../assets/icons/dropright_arrow.png')} style={styles.rightArrow} resizeMode='contain' />
                </View>

            </TouchableOpacity>
        )
    }


}


const styles = StyleSheet.create({
    cardContainer: {width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', },
    
    cardImageWrapper: {alignItems: 'center', padding: 10, width: '20%',},
    cardImageContainer: {width: 60, height: 60, overflow: 'hidden', borderRadius: 15, },
    cardImage: {height: '100%', width: '100%', },

    cardDescriptionContainer: {alignItems: 'flex-start', justifyContent: 'center', width: '65%',},
    cardNameText: {fontSize: 16, color: COLORS._657272, fontFamily: FONTS.BOLD},
    cardDescriptionText: {fontSize: 13, color: COLORS._657272, fontFamily: FONTS.REGULAR},

    rightArrowContainer: {width: '15%', padding: 5},
    rightArrow: {width: 15, height: 15,},
})