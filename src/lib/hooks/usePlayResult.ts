
import { useCallback, useEffect, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { TypePlayPersonCard } from '../types/play';
import ProfileThumbnail from '@/UI/molecules/profile/ProfileThumbnail';

interface UsePlayResultProps {
    debounceSearchQuery: string;
}
const usePlayResult = ({
    debounceSearchQuery,
}: UsePlayResultProps) => {
    const renderPersonCard = useCallback(
            ({
                item,
                index,
                categoryName,
                containerStyles,
                queryMutateDestination,
                isSmallVariant,
            }: TypePlayPersonCard) => {
                if ('empty' in item && item.empty) {
                    return <View className='flex-1'></View>;
                }
                return (
                    <ProfileThumbnail
                        queryMutateDestination={queryMutateDestination}
                        name={item.name}
                        imageUrl={item.profile_image}
                        isFollowing={item.is_following}
                        followUserId={item.id}
                        searchQuery={debounceSearchQuery}
                        currentCity={currentCity}
                        categoryName={categoryName}
                        testID={`person-card-${index}`}
                        containerStyles={`${containerStyles}`}
                        designVariation={isSmallVariant ? 'small' : 'large'}
                    />
                );
            },
            [currentCity, debounceSearchQuery],
        );

    return {
        renderPersonCard
    };
}