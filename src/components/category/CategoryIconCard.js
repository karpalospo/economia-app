import React, { useState } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS, FONTS } from "../../utils/constants";
import { CapitalizeWords } from "../../utils/helper";

export const CategoryIconCard = props =>
{
    const {category, onTapCategory} = props;

    const [emptyState, setEmptyState] = useState(false)

    const onPressCategoryIcon = (id, name, categories) =>
    {
        onTapCategory(id, name, categories)
    }

    const setImage = () =>
    {
        return !emptyState ? category.image : require('../../../assets/icons/category/no_category_img.png')
    }

    const icons = {
       "01": require('../../../assets/icons/cat1.png'),
       "02": require('../../../assets/icons/cat2.png'),
       "03": require('../../../assets/icons/cat3.png'),
       "04": require('../../../assets/icons/cat4.png'),
       "05": require('../../../assets/icons/cat5.png'),
       "07": require('../../../assets/icons/cat6.png'),
    }

    //console.log(category.id, category.name)

    return(
        <View style={styles.categoryItemContainer}>
            <TouchableOpacity style={styles.categoryItemImageContainer} 
            onPress={onPressCategoryIcon.bind(this, category.id, category.name, category.categories)}>
                <Image source={icons[category.id]} resizeMode='contain' style={styles.categoryItemImage} onError={() => { setEmptyState(true) }} />
            </TouchableOpacity>

            <Text style={styles.categoryItemNameText}>{category.name}</Text>
        </View>
    )

}


const styles = StyleSheet.create({

    categoryItemContainer: {alignItems: 'center', width: 100, height: 110, padding: 5, marginTop: 5}, 
    categoryItemImageContainer: {width: 70, height: 70, padding:10, overflow: 'hidden',},
    categoryItemImage: {width: '100%', height: '100%'},
    categoryItemNameText: {fontSize: 12, color: COLORS._657272, textAlign: 'center', marginTop: 5, fontFamily: FONTS.REGULAR},

})