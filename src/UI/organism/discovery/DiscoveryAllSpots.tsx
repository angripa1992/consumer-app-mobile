import { useCallback } from "react";
import { View } from "react-native";

import InfiniteScrollFlashList from "@/UI/molecules/infiniteScroll/InfiniteScrollFlashList";
import { usePostDiscoverySpotsWithInfiniteScroll } from "@/lib/hooks/useQueryDiscovery";
import { useRefetchOnFocus } from "@/lib/hooks/useRefetchOnFocus";

import type { TypeSpotFromDiscoveryCard } from "@/lib/types/discovery";

interface DiscoveryAllSpotsProps {
  spotsNearbyComponent: JSX.Element;
  renderCandidateSpotCard: (values: TypeSpotFromDiscoveryCard) => JSX.Element;
  searchQuery: string;
  currentCity: string;
  currentAreas: string[];
}
const DiscoveryAllSpots = ({
  spotsNearbyComponent,
  renderCandidateSpotCard,
  searchQuery,
  currentCity,
  currentAreas,
}: DiscoveryAllSpotsProps) => {
  const {
    allDiscoverySpots,
    isLoadingAllDiscoverySpots,
    refetchAllDiscoverySpots,
    hasNextPageAllDiscoverySpots,
    fetchNextPageAllDiscoverySpots,
    isFetchingNextPageAllDiscoverySpots,
  } = usePostDiscoverySpotsWithInfiniteScroll(
    currentCity,
    currentAreas.join(","),
    {
      search_content: searchQuery,
    }
  );

  useRefetchOnFocus(refetchAllDiscoverySpots);

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: TypeSpotFromDiscoveryCard["item"];
      index: number;
    }) =>
      renderCandidateSpotCard({
        item,
        index,
        queryMutateDestination: "allSpotDiscovery",
        isFlashList: true,
      }),
    [renderCandidateSpotCard]
  );

  const keyExtractor = useCallback(
    (item: TypeSpotFromDiscoveryCard["item"], index: number) => {
      if ("empty" in item && item.empty) {
        return `empty-${index}`;
      }
      return item.id
        ? item.id.toString()
        : item?.google_place_location_id?.toString() || index.toString();
    },
    []
  );

  return (
    <View className="flex-1">
      <InfiniteScrollFlashList
        ListHeaderComponent={spotsNearbyComponent}
        fetchNextPage={fetchNextPageAllDiscoverySpots}
        hasNextPage={hasNextPageAllDiscoverySpots}
        isFetchingNextPage={isFetchingNextPageAllDiscoverySpots}
        isLoading={isLoadingAllDiscoverySpots}
        showsVerticalScrollIndicator={false}
        dataToRender={allDiscoverySpots}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        hideEmptyComponent
      />
    </View>
  );
};

export default DiscoveryAllSpots;
