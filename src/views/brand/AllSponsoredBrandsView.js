import React from 'react';
import { View, StyleSheet, FlatList, SectionList, } from 'react-native';

import SponsoredBrandCard from '../../components/sponsored_brand/SponsoredBrandCard';
import { COLORS } from '../../utils/constants';
import { PANEL_API } from '../../services/service';
import { FormatBrandItem } from '../../utils/formatter';
import { FullWidthLoading } from '../../components/loading/FullWidthLoading';
import { HeaderWithTitleAndBackButton } from '../../components/header/HeaderWithTitleAndBackButton';

export default class AllSponsoredBrands extends React.Component
{
    state = {
        loading: false,

        sponsoredBrands: [],
    }

    async componentDidMount()
    {
        this.lastPage = -1
        this.page = 0

        await this.retrieveBrands()
    }


    retrieveBrands = async () =>
    {
        this.setState({loading: true})
        const res = await PANEL_API.GET.RetrieveBrands(this.page)
        
        let sponsoredBrands = this.page == 0 ? [] : this.state.sponsoredBrands
        if(!res.error)
        {
            for (let index = 0; index < res.message.data.length; index++) {
                sponsoredBrands.push(FormatBrandItem(res.message.data[index]))
            }

            this.lastPage = this.page
            if(res.message.data.length > 0)
            {
                this.page++
            }
        }

        this.setState({sponsoredBrands, loading: false})
    }

    onTapSingleSponsoredBrand = (brandId, brandName, brandType, brandValue) =>
    {
        this.props.navigation.navigate('SponsoredBrand', {title: brandName, id: brandId, type: brandType, value: brandValue});
    }


    render()
    {
        return(
            <View style={styles.container}>
                
                <SectionList
                    keyExtractor={(item, index) => `section_${index}`}
                    renderItem={({ item, index, section }) => <View />}
                    extraData={this.state}
                    sections={[
                        { title: 'Title', data: [{}], renderItem: this.overrideBrandsTitleSection.bind(this) },
                        { title: 'Brands', data: [{}], renderItem: this.overrideBrandListSection.bind(this) },
                    ]}
                />

            </View>
        )
    }


    overrideBrandsTitleSection = ({ item, index, section: { title, data } }) =>
    {
        return(
            <View style={styles.brandSectionContainer}>
            
                <HeaderWithTitleAndBackButton title='Categorías' subtitle = 'Marcas patrocinadoras' onPress={() => this.props.navigation.goBack()} />

            </View>
        )
    }

    overrideBrandListSection = ({ item, index, section: { title, data } }) => 
    {
        return( 
            <FlatList
                keyExtractor={(item, index) => `brand_${index}`}
                data={this.state.sponsoredBrands}
                extraData={this.state}

                onEndReached={this.handleLoadMore}
                onEndReachedThreshold={0.9}
                ListFooterComponent={this.renderFooter}

                renderItem={({ item, index }) => {
                    return (
                        <View style={styles.brandItemContainer}>
                            <SponsoredBrandCard image = {item.photo} name = {item.name} description = {item.description} onPressCard={this.onTapSingleSponsoredBrand.bind(this, item.id, item.name, item.type_brand, item.value)} />
                        </View>
                    )
                }}
            />  
        )
    }

    handleLoadMore = async () =>
    {
        if(!this.state.loading && this.lastPage !== this.page)
        {
            await this.retrieveBrands()
        }
    }

    renderFooter = () =>
    {
        if(!this.state.loading || this.lastPage === this.page)
        {
            return null
        } 

        return (<FullWidthLoading />)
    }

}

const styles = StyleSheet.create({
    
    container: {flex: 1, backgroundColor: COLORS._F4F4F4},

    brandSectionContainer: {width: '100%', marginTop: 0},

    brandItemContainer: { justifyContent: 'center', backgroundColor: COLORS._FFFFFF, borderBottomWidth: 1, borderTopWidth: 1, borderColor: COLORS._F4F4F4,},
})