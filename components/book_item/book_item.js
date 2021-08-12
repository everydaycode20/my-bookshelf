import React, {useEffect, useContext, useState} from 'react';
import { View, FlatList, TouchableOpacity, Image } from 'react-native';

export default function BookItem({data, getBook}){

    function Item({item}) {
        const {image} = item;
        return (
                <View style={{marginRight: 30}}>
                    <View>
                        <TouchableOpacity onPress={() => getBook(item.title)}>
                            <Image style={{width: 100, height: 150, resizeMode: "contain", borderRadius: 5,}} source={{uri:image}}/>
                        </TouchableOpacity>
                </View>
            </View>
        )
    }

    function renderItem({item}) {
        return <Item item={item}/>
    }

    return (
        <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={data} renderItem={renderItem} keyExtractor={(item, index) => index.toString()}/>
    )
}