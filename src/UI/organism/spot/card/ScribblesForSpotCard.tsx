import { memo, useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useShallow } from 'zustand/react/shallow';
import { useNavigation } from '@react-navigation/native';

import { useAppStore } from '@/lib/store/store';
import {
	useDeleteScribble,
	usePutScribble,
} from '@/lib/hooks/useQueryScribbles';
import { handleVisitDateFormat } from '@/lib/helpers/dates/visitedDateFormat';
import { useRenderScribbleImages } from '@/lib/hooks/scribble/renderScribbleImages';
import { i18nInstance } from 'config/i18n';

import TextElement from '@/UI/atoms/text/TextElement';
import CustomImage from '@/UI/atoms/image/CustomImage';
import LikeThumbIcon from '@/UI/assets/svg/LikeThumbIcon';
import EditDotsIcon from '@/UI/assets/svg/EditDotsIcon';
import DotSeparator from '@/UI/assets/svg/DotSeparator';
import EmojiPickerButton from '../../feed/cards/EmojiPickerButton';
import ScribbleFormModal from '../modal/ScribbleFormModal';
import ScribbleOptionsModal from '../modal/ScribbleOptionsModal';
import ConfirmModal from '../../modal/ConfirmModal';
import ReportModal from '../../report/ReportModal';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';

import { useForm, type SubmitHandler } from 'react-hook-form';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type {
	TypeAddOrEditScribbleFormValues,
	TypeAddOrEditScribbleValues,
} from '@/lib/types/scribbles';
import type { TypeEmojiFromEvent } from '@/lib/types/emojis';
import type { TypeQueriesMutateDestination } from '@/lib/types/queries';
import type { AppStackNavigationProp } from '@/lib/types/tabScreenParams';
import { ImagePickerAsset } from 'expo-image-picker';
import { getImageUriInformation } from '@/lib/helpers/strings/getImageUriInformation';
import { addOrEditScribbleFormValuesSchema } from '@/lib/schemas/scribbles';
import FeedScribbleModal from '../../scribble/FeedScribbleModal';

type TypeScribblesForSpotCardProps = {
	queryMutateDestination: TypeQueriesMutateDestination;
	userId: number;
	scribbleId: number;
	eventId: number;
	spotId?: number;
	googlePlacesLocationId?: string;
	username: string;
	reviewDescription: string;
	spotName: string;
	isPositive: boolean;
	emojis: TypeEmojiFromEvent[];
	visitedDate?: string | null;
	profilePictureUrl: string | null;
	testId?: string;
	handleRedirectProfile: (userId: number) => void;
	scribbleImages?: string[];
	hasBottomModal?: boolean;
	hasThreeDotsButton?: boolean;
};

const ScribblesForSpotCard = ({
	queryMutateDestination,
	userId,
	scribbleId,
	eventId,
	username,
	emojis,
	reviewDescription,
	visitedDate,
	profilePictureUrl,
	isPositive,
	spotName,
	spotId,
	googlePlacesLocationId,
	testId,
	handleRedirectProfile,
	scribbleImages,
	hasBottomModal,
	hasThreeDotsButton = true,
}: TypeScribblesForSpotCardProps) => {
	const { appUserId } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			appUserId: state.user?.id,
		})),
	);
	const { scribbleImagesToRender, modalToRender, onPressImage } =
		useRenderScribbleImages(scribbleImages);
	const [partialScribbleImages, setPartialScribbleImages] =
		useState(scribbleImages);
	const [scribbleFileImagesToSave, setFileScribbleImagesToSave] = useState<
		ImagePickerAsset[] | null
	>([]);

	const [showDeleteSingleScribbleModal, setShowDeleteSingleScribbleModal] =
		useState(false);
	const scribbleEditFormModalRef = useRef<BottomSheetModal>(null);
	const scribbleOptionsModalRef = useRef<BottomSheetModal>(null);
	const reportModalRef = useRef<BottomSheetModal>(null);
	const navigation = useNavigation<AppStackNavigationProp>();

	const formMethods = useForm<TypeAddOrEditScribbleFormValues>({
		resolver: zodResolver(addOrEditScribbleFormValuesSchema),
		defaultValues: {
			is_positive: isPositive,
			review_description: reviewDescription,
			visit_date: visitedDate ? new Date(visitedDate) : null,
		},
	});
	const { mutateAsync: updateScribble, isLoading: isLoadingUpdateScribble } =
		usePutScribble(
			queryMutateDestination,
			scribbleId,
			spotId,
			googlePlacesLocationId,
		);
	const { mutateAsync: deleteScribble } = useDeleteScribble(
		queryMutateDestination,
		scribbleId,
		spotId,
	);

	const hasScribblesImages =
		scribbleImages &&
		Array.isArray(scribbleImages) &&
		scribbleImages.length > 0;

	const scribbleModalRef = useRef<BottomSheetModal>(null);

	const isAuthenticateUser = appUserId === userId;

	const userNameToShow = isAuthenticateUser ? 'You' : username;

	const visitedDateFormatted = handleVisitDateFormat(visitedDate);

	const onOpenScribbleOptions = () => {
		setPartialScribbleImages(scribbleImages);
		setFileScribbleImagesToSave(null);
		formMethods.reset();
		scribbleOptionsModalRef.current?.present();
	};

	const onConfirmDeleteScribble = async () => {
		setShowDeleteSingleScribbleModal(false);
		await deleteScribble();
	};

	const onSubmit: SubmitHandler<TypeAddOrEditScribbleFormValues> = async (
		data,
	) => {
		if (!appUserId || isLoadingUpdateScribble) return;

		const dataToSend: TypeAddOrEditScribbleValues = {
			is_positive: data.is_positive,
			review_description: data.review_description,
			user_id: appUserId,
			spot_id: spotId,
		};

		if (data?.visit_date) {
			const visitIsoDate = data?.visit_date.toISOString();

			dataToSend['visit_date'] = visitIsoDate;
		}

		const imagesToRemove = scribbleImages?.filter(
			(item) => !partialScribbleImages?.includes(item),
		);

		const isValidScribbleImagesToSend =
			scribbleFileImagesToSave &&
			Array.isArray(scribbleFileImagesToSave) &&
			scribbleFileImagesToSave.length > 0 &&
			partialScribbleImages &&
			partialScribbleImages?.length < 3;

		if (isValidScribbleImagesToSend) {
			let imageFileToSend = [];
			let iteration = 0;
			for (let i = 0; i < scribbleFileImagesToSave?.length; i++) {
				if (iteration + partialScribbleImages.length < 3) {
					const { fileName, fileType } = getImageUriInformation(
						scribbleFileImagesToSave[i].uri,
					);

					imageFileToSend.push({
						uri: scribbleFileImagesToSave[i].uri,
						type: fileType,
						name: fileName,
					});

					iteration++;
				}
			}

			dataToSend['scribble_file_images'] = imageFileToSend;
		}

		if (imagesToRemove) {
			dataToSend['scribble_images'] = imagesToRemove;
		}

		await updateScribble(dataToSend);

		scribbleEditFormModalRef.current?.close();

		setFileScribbleImagesToSave(null);
	};

	const onPressSpotName = () => {
		if (spotId) {
			navigation.replace('SingleSpot', { spotId });

			return;
		}

		if (googlePlacesLocationId) {
			navigation.replace('SingleSpot', {
				spotId: googlePlacesLocationId,
				isCandidateSpot: true,
			});
		}
	};

	useEffect(() => {
		setPartialScribbleImages(scribbleImages);
	}, [scribbleImages]);

	return (
		<>
			{modalToRender()}
			<TouchableOpacity
				activeOpacity={1}
				testID={testId}
				onPress={() => {
					if (hasBottomModal) {
						scribbleModalRef.current?.present();
					}
				}}
				className='flex-row border-b border-b-filter-border/20 pb-6 mt-6'
			>
				<ButtonPrimary
					onPress={() => {
						handleRedirectProfile(userId);
					}}
					buttonStyles='w-[25px] h-[25px] !p-0 mr-4'
					designVariation='custom'
					isReactNodeContent
				>
					<CustomImage
						testID='profile-image'
						className={`object-contain rounded-full w-[30px] h-[30px] mr-4`}
						imageSrc={profilePictureUrl}
						width={20}
						height={20}
						typeDefaultImage='profile'
					/>
				</ButtonPrimary>
				<View className='flex-1'>
					<View className='flex flex-row justify-between flex-1'>
						<View className='flex-wrap flex flex-row w-[90%]'>
							<ButtonPrimary
								designVariation='custom'
								buttonStyles='mr-[4px] ml-0 mt-0 mb-0 p-0'
								textStyles='text-sm text-white font-semibold'
								onPress={() => handleRedirectProfile(userId)}
							>{`${userNameToShow}`}</ButtonPrimary>
							<TextElement textStyles='text-sm text-white font-semibold'>
								<LikeThumbIcon isPositive={isPositive} /> scribbled on the {''}
								<TextElement
									onPress={onPressSpotName}
									textStyles='text-sm text-white font-semibold'
								>
									{i18nInstance.t('spot')}
								</TextElement>
							</TextElement>
						</View>
						{hasThreeDotsButton && (
							<TouchableOpacity
								testID='scribble-options-button'
								onPress={onOpenScribbleOptions}
								activeOpacity={1}
							>
								<EditDotsIcon />
							</TouchableOpacity>
						)}
					</View>
					<View className='mt-2 flex-1'>
						<TextElement textStyles={`text-sm text-white text-gray`}>
							{reviewDescription}
						</TextElement>
					</View>
					{hasScribblesImages && <>{scribbleImagesToRender()}</>}
					<View
						className='flex-row items-center mt-3 flex-wrap'
						style={{ gap: 8 }}
					>
						<EmojiPickerButton
							emojis={emojis}
							eventId={eventId}
							queryMutateDestination={queryMutateDestination}
							spotId={spotId ?? googlePlacesLocationId}
						/>
						{visitedDateFormatted && (
							<>
								<View>
									<DotSeparator />
								</View>
								<TextElement textStyles={`text-xs text-white`}>
									{visitedDateFormatted}
								</TextElement>
							</>
						)}
					</View>
				</View>
			</TouchableOpacity>
			{hasBottomModal && spotId && (
				<FeedScribbleModal
					onPressImage={onPressImage}
					spotId={spotId}
					eventId={eventId}
					scribbleEmojis={emojis}
					reviewDescription={reviewDescription}
					spotName={spotName}
					creatorImage={profilePictureUrl}
					creatorName={username}
					creatorUsername={username}
					isPositive={isPositive}
					scribbleImages={scribbleImages}
					visitDate={visitedDate ?? ''}
					scribbleModalRef={scribbleModalRef}
					queryMutateDestination='userScribbles'
				/>
			)}
			<ScribbleFormModal
				spotName={spotName}
				onSubmit={onSubmit}
				scribbleFormModalRef={scribbleEditFormModalRef}
				isLoadingPostScribble={isLoadingUpdateScribble}
				scribbleImagesToSave={scribbleFileImagesToSave}
				setScribbleImagesToSave={setFileScribbleImagesToSave}
				partialScribbleImages={partialScribbleImages}
				setPartialScribbleImages={setPartialScribbleImages}
				formMethods={formMethods}
			/>
			<ScribbleOptionsModal
				isAuthenticateUser={isAuthenticateUser}
				setShowDeleteSingleScribbleModal={setShowDeleteSingleScribbleModal}
				scribbleOptionsModalRef={scribbleOptionsModalRef}
				scribbleEditFormModalRef={scribbleEditFormModalRef}
				reportModalRef={reportModalRef}
			/>
			<ConfirmModal
				showConfirmModal={showDeleteSingleScribbleModal}
				setShowConfirmModal={setShowDeleteSingleScribbleModal}
				questionText='Are you sure you want to delete this scribble?'
				confirmButtonText='Delete'
				cancelButtonText='Cancel'
				onConfirm={onConfirmDeleteScribble}
			/>
			<ReportModal
				entityType='scribble'
				reportModalRef={reportModalRef}
				reportedId={scribbleId}
			/>
		</>
	);
};

export default ScribblesForSpotCard;
