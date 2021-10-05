import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONTS } from '../../utils/constants';
import { Truncate } from '../../utils/helper';

export default class ProductCard extends React.PureComponent
{
    static propTypes = {
        image: PropTypes.any.isRequired, /* accepts Uri objects or require images */
        name: PropTypes.string,
        onPressCard: PropTypes.func,
    }

    state = 
    {
        emptyImage: null,
    }


    render()
    {
        const {image, name = "", onPressCard = () => {}} = this.props;

        return(
            <TouchableOpacity style={styles.cardContainer} onPress={onPressCard}>
                
                <View style={styles.cardImageContainer}>
                    <Image source={this.state.emptyImage ? this.state.emptyImage : image} style={styles.cardImage} resizeMode='contain' onError={() => {this.setState({emptyImage: require('../../../assets/icons/product/noimage.png')})}} />
                </View>

            </TouchableOpacity>
        )
    }


}


const styles = StyleSheet.create({
    cardContainer: {width: 110, height: 120, },
    cardImageContainer: {width: 110, height: 110, overflow: 'hidden', borderRadius: 13, borderWidth: 1.5, borderColor: COLORS._F4F4F4, overflow: 'hidden'},
    cardImage: {height: '100%', width: '100%', },
    cardNameContainer: {width: '100%', alignItems: 'center', justifyContent: 'flex-start', marginVertical: 10,},
    cardNameText: {fontSize: 16, color: COLORS._657272, fontFamily: FONTS.BOLD},
})