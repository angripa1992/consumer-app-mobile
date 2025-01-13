import { Platform, PressableProps, TouchableOpacity, View } from 'react-native';
import { memo, useMemo, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import LottieView from 'lottie-react-native';

import { useDeleteSpotFromList } from '@/lib/hooks/useQuerySpotSpot';
import { useGetSpotImage } from '@/lib/hooks/UseQuerySpot';
import { useSpotStatusTags } from '@/lib/hooks/useSpotStatusTags';
import { formatBigNumbers } from '@/lib/helpers/numbers/formatBigNumbers';

import TextElement from '@/UI/atoms/text/TextElement';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import EditDotsIcon from '@/svg/EditDotsIcon';
import CustomImage from '@/UI/atoms/image/CustomImage';
import ReportModal from '../report/ReportModal';
import ConfirmModal from '../modal/ConfirmModal';
import ModalTemplate from '../modal/ModalTemplate';
import SpotThumbnailEditModal from './SpotThumbnailEditModal';
import ScribbleIcon from '@/UI/assets/svg/ScribbleIcon';

import DefaultImageForListAndSpot from '@/images/default-color-image-for-spot-and-list.png';

import type { TypeQueriesMutateDestination } from '@/lib/types/queries';
import type {
	TypeAddStatusTagsFromDB,
	TypeStatusTagsSchema,
} from '@/lib/types/spot';
import type { AppStackNavigationProp } from '@/lib/types/tabScreenParams';
import SpotHeartButton from '@/UI/atoms/spot/SpotHeartButton';

type SpotThumbnailProps = {
	id: number;
	queryMutateDestination: TypeQueriesMutateDestination;
	small_image?: string | null;
	name: string;
	spotListId?: number;
	userId?: number | null;
	spotListName?: string;
	spotSpotListId?: number;
	isSpotListOwner?: boolean;
	owner_status_tags?: TypeStatusTagsSchema;
	viewer_status_tags?: TypeStatusTagsSchema;
	spot_like_counter: number | null;
	scribbles_count?: number | null;
	disabled?: boolean;
	cardContainerStyles?: string;
	categoryName?: string;
	testID?: string;
	searchQuery?: string;
	currentCity?: string | null;
	isOwner?: boolean;
	tripAdvisorLocationId?: number | null;
	googlePlaceLocationId?: string | null;
	currentArea?: string;
};

const SpotThumbnail = ({
	id,
	queryMutateDestination,
	small_image,
	name,
	spot_like_counter,
	owner_status_tags,
	viewer_status_tags,
	spotSpotListId,
	spotListId,
	userId,
	cardContainerStyles = 'flex-1',
	testID,
	categoryName,
	searchQuery,
	currentCity,
	isSpotListOwner,
	isOwner,
	tripAdvisorLocationId,
	googlePlaceLocationId,
	scribbles_count,
	currentArea,
}: SpotThumbnailProps) => {
	const navigation = useNavigation<AppStackNavigationProp>();
	const toast = useToast();
	const spotEditModalRef = useRef<BottomSheetModal>(null);
	const reportModalRef = useRef<BottomSheetModal>(null);

	const [showDeleteSingleSpotModal, setShowDeleteSingleSpotModal] =
		useState(false);

	const spotSmallImage = small_image || undefined;
	const placeholder =
		Platform.OS === 'android'
			? (spotSmallImage ?? DefaultImageForListAndSpot)
			: spotSmallImage;

	const { spotImage } = useGetSpotImage(
		{
			imageSize: 'small',
			tripAdvisorLocationId,
			spotGooglePlacesId: googlePlaceLocationId,
		},
		!spotSmallImage,
	);
	const spotImageToShow = useMemo(
		() => spotSmallImage ?? spotImage,
		[spotSmallImage, spotImage],
	);

	const ownerStatusTags = owner_status_tags;
	const viewerStatusTags = viewer_status_tags;
	const statusTagsForViewer = isSpotListOwner
		? ownerStatusTags
		: viewerStatusTags;

	const valuesToUpdate = useMemo(() => {
		const dataToSave: TypeAddStatusTagsFromDB = {
			spot_id: id,
			google_place_location_id: null,
			spotType: 'db',
		};

		return dataToSave;
	}, [id]);

	const { hasStatusFavorite, onClickFavorite } = useSpotStatusTags({
		queryMutateDestination,
		spotName: name,
		statusTags: statusTagsForViewer,
		valuesToUpdate,
		spotId: id,
		spotListId,
		userId,
		categoryName,
		searchQuery,
		currentCity,
		isOwner: isOwner ?? isSpotListOwner,
		currentArea,
	});

	const { mutateAsync: deleteSpot, isLoading: isDeletingSpot } =
		useDeleteSpotFromList({
			queryMutateDestination,
			spotSpotListId,
			spotListId,
		});

	const onClickEdit: PressableProps['onPress'] = (e) => {
		e.stopPropagation();
		spotEditModalRef.current?.present();
	};

	const onConfirmDelete = async () => {
		setShowDeleteSingleSpotModal(false);
		spotEditModalRef.current?.close();

		await deleteSpot().then(() => {
			toast.show('', {
				type: 'success',
				data: {
					item: name,
					message: 'was deleted successfully',
				},
			});
		});
	};

	const handlePressReport = () => {
		reportModalRef.current?.present();
		spotEditModalRef.current?.close();
		setShowDeleteSingleSpotModal(false);
	};

	const onPressCard = () => {
		navigation.push('SingleSpot', { spotId: id });
	};

	return (
		<>
			<TouchableOpacity
				activeOpacity={1}
				className={` my-2 p-0  ${cardContainerStyles} `}
				onPress={onPressCard}
				testID={testID}
			>
				<View>
					<View
						className='mb-2  flex flex-row  justify-between '
						style={{ columnGap: 2 }}
					>
						<TextElement
							textStyles={`text-white text-sm font-medium ${isSpotListOwner ? 'w-[90%]' : 'w-full'}`}
							numberOfLines={1}
						>
							{name}
						</TextElement>
						{isSpotListOwner && (
							<ButtonPrimary
								designVariation='ghost'
								buttonStyles='p-0'
								isReactNodeContent
								nodeContentStyles='flex flex-row items-center justify-center'
								onPress={onClickEdit}
								hitSlop={10}
								testID='spot-thumbnail-edit-button'
							>
								<EditDotsIcon />
							</ButtonPrimary>
						)}
					</View>
					<View className='overflow-hidden rounded-lg h-[150px]'>
						<CustomImage
							imageSrc={spotImageToShow}
							className='flex-1 w-full'
							contentFit='cover'
							width={150}
							height={150}
							testID='spot-thumbnail-image'
							placeholder={placeholder}
						/>
					</View>
					<View className='flex-row items-center mt-[1px]' style={{ gap: 5 }}>
						<SpotHeartButton
							onClickFavorite={(e) => {
								if (onClickFavorite) {
									onClickFavorite(e);
								}
							}}
							hasStatusFavorite={hasStatusFavorite}
							spotLikeCounter={spot_like_counter}
						/>
						{scribbles_count !== null &&
							scribbles_count !== undefined &&
							scribbles_count >= 0 && (
								<View className='flex flex-row items-center justify-center'>
									<ScribbleIcon width={22} height={18} color='#B0B0B0' />
									<TextElement textStyles='text-xs ml-1 text-white'>
										{formatBigNumbers(scribbles_count)}
									</TextElement>
								</View>
							)}
					</View>
				</View>
			</TouchableOpacity>
			{isSpotListOwner && (
				<>
					<SpotThumbnailEditModal
						spotName={name}
						setShowDeleteSpotModal={setShowDeleteSingleSpotModal}
						spotThumbnailEditModalRef={spotEditModalRef}
						onPressReport={handlePressReport}
					/>
					<ReportModal
						entityType='spot'
						reportModalRef={reportModalRef}
						reportedId={id}
					/>
					<ConfirmModal
						showConfirmModal={showDeleteSingleSpotModal}
						setShowConfirmModal={setShowDeleteSingleSpotModal}
						questionText={`Are you sure delete ${name}?`}
						confirmButtonText='Delete'
						cancelButtonText='Cancel'
						onConfirm={onConfirmDelete}
					/>
					{isDeletingSpot && (
						<ModalTemplate showModal={isDeletingSpot} modalPosition='center'>
							<View className=' w-full h-36 bg-dark-gray justify-center items-center rounded-lg'>
								<TextElement textStyles='text-light-white text-lg text-center'>
									Deleting spot, this may take a few seconds...
								</TextElement>
							</View>
						</ModalTemplate>
					)}
				</>
			)}
		</>
	);
};

export default memo(SpotThumbnail);
