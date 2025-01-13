import { Dispatch } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { dataEditProfileTabs } from '@/lib/data/profileData';
import { i18nInstance } from 'config/i18n';

import SelectForm from '@/UI/atoms/select/SelectForm';
import InputForm from '@/UI/atoms/input/InputForm';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import CloseIcon from '@/UI/assets/svg/CloseIcon';
import useProfileFormEdit from '@/lib/hooks/useProfileFormEdit';
import TextElement from '@/UI/atoms/text/TextElement';
import FilterTabs from '@/UI/molecules/tabs/FilterTabs';
import QRIcon from '@/UI/assets/svg/QRIcon';
import TarotProfileImage from '../tarot/TarotProfileImage';
import ChangeLanguageButton from '@/UI/molecules/language/ChangeLanguageButton';
import TarotQRModal from '../../tarot/TarotQRModal';
import LocationFilter from '../../filters/LocationFilter';

import type { TypeProfileForm } from '@/lib/types/profile';

type TypeProfileFormEditProps = {
	onSubmit: (profileData: TypeProfileForm) => void;
	onCancel: () => void;
	isUsernameRepeated: boolean;
	setIsUsernameRepeated: Dispatch<React.SetStateAction<boolean>>;
	setShowDeleteProfileModal: Dispatch<React.SetStateAction<boolean>>;
	pickImage: () => Promise<void>;
	imageUrl: () => any;
	hideFormStyles: string;
};

const ProfileFormEdit = ({
	onSubmit,
	onCancel,
	isUsernameRepeated,
	setIsUsernameRepeated,
	hideFormStyles,
	setShowDeleteProfileModal,
	imageUrl,
	pickImage,
}: TypeProfileFormEditProps) => {
	const {
		userId,
		tarotQRModalRef,
		control,
		errors,
		inputCustomStyles,
		numberExtraWebsiteFields,
		tarotValue,
		handleExtraWebsiteAddition,
		onRemoveWebsiteTwo,
		onRemoveWebsiteThree,
		handleSubmit,
		onClearAllWebsiteFields,
		onRedirectToTarotWebsite,
		currentEditProfileTab,
		setCurrentEditProfileTab,
		userStored,
		handleOpenQRModal,
		tarotCodeNames,
		hasTarotCode,
		partialTarotCode,
		handleCloseQRModal,
		controlCity,
		setValueCity,
		watchCity,
		resetCity,
		cityChosen,
		setCityChosen,
	} = useProfileFormEdit(isUsernameRepeated, setIsUsernameRepeated);

	return (
		<>
			{userId && (
				<TarotQRModal
					tarotQRModalRef={tarotQRModalRef}
					userId={userId}
					onCustomDismiss={handleCloseQRModal}
				/>
			)}
			<KeyboardAwareScrollView
				testID='profile-form-scroll'
				className={hideFormStyles}
				extraHeight={130}
				showsVerticalScrollIndicator={false}
			>
				<View className='flex flex-row justify-center'>
					<TarotProfileImage
						tarotCode={partialTarotCode?.code || ''}
						tarotColors={partialTarotCode?.tarot_color || []}
						imageUrl={imageUrl()}
						onPressPickImage={pickImage}
						showPickImageButton
					/>
				</View>
				{hasTarotCode && (
					<View className='flex flex-row justify-center items-center mb-4 mt-3'>
						<TextElement
							textStyles={`text-white text-lg mr-2 mb-[3px]`}
							testID='edit-profile-username'
						>
							{`@${userStored?.username}`}
						</TextElement>
						<ButtonPrimary
							designVariation='custom'
							buttonStyles='!p-0'
							onPress={handleOpenQRModal}
							isReactNodeContent
						>
							<QRIcon />
						</ButtonPrimary>
					</View>
				)}
				{hasTarotCode && (
					<View className='flex flex-row justify-center mb-6'>
						<FilterTabs
							currentFilter={currentEditProfileTab}
							setCurrentFilter={setCurrentEditProfileTab as any}
							dataFilterTabs={dataEditProfileTabs}
						/>
					</View>
				)}
				<View className='flex flex-row justify-center mt-2 mb-10'>
					<ChangeLanguageButton />
				</View>
				<InputForm
					name='username'
					control={control}
					label={i18nInstance.t('username')}
					containerStyles={inputCustomStyles}
					error={errors.username}
					customErrorMessage='This username already exist, please try another one'
					showCustomError={isUsernameRepeated}
					testID='input-profile-username'
				/>
				<InputForm
					name='name'
					control={control}
					label={i18nInstance.t('name')}
					containerStyles={inputCustomStyles}
					error={errors.name}
					testID='input-profile-name'
				/>
				<View className='mb-2 mt-[2px]'>
					<TextElement textStyles={`text-gray-label mb-1`}>
						{i18nInstance.t('city')}
					</TextElement>
					<LocationFilter
						control={controlCity}
						setValue={setValueCity}
						watch={watchCity}
						currentCity={cityChosen}
						setCurrentCity={setCityChosen}
						reset={resetCity}
						designVariation='dropdown'
						disabledGlobal
					/>
					{errors.city?.message && (
						<TextElement textStyles={`text-error mt-[-4px]`}>
							{i18nInstance.t(errors.city?.message)}
						</TextElement>
					)}
				</View>
				<SelectForm
					options={tarotCodeNames}
					name='tarot'
					control={control}
					testID='input-profile-tarot'
					customLabel={
						<View className='flex flex-row mb-2'>
							<TextElement textStyles='text-neutral-gray'>
								{i18nInstance.t('tasteTarotResult')}
							</TextElement>
							<ButtonPrimary
								designVariation='custom'
								textStyles='!text-gray'
								buttonStyles='!p-0 ml-[4px] rounded-none border-b border-gray'
								onPress={onRedirectToTarotWebsite}
							>{`${i18nInstance.t('seeMore')} ->`}</ButtonPrimary>
						</View>
					}
					defaultValue={tarotValue ? tarotValue : undefined}
					containerStyles={inputCustomStyles}
				/>
				<InputForm
					name='websiteOne'
					control={control}
					label={i18nInstance.t('personalWebsite')}
					containerStyles={inputCustomStyles}
					error={errors.websiteOne}
				/>
				{numberExtraWebsiteFields > 0 && (
					<View className='mb-4'>
						<InputForm
							name='websiteTwo'
							control={control}
							label={i18nInstance.t('personalWebsite')}
							error={errors.websiteTwo}
							customIcon={
								<ButtonPrimary
									isReactNodeContent
									onPress={onRemoveWebsiteTwo}
									designVariation='ghost'
									buttonStyles='absolute right-0 top-0 bottom-0 flex items-center justify-center'
								>
									<CloseIcon color='#FFF' />
								</ButtonPrimary>
							}
						/>
					</View>
				)}
				{numberExtraWebsiteFields === 2 && (
					<View className='mb-4'>
						<InputForm
							name='websiteThree'
							control={control}
							label={i18nInstance.t('personalWebsite')}
							error={errors.websiteThree}
							customIcon={
								<ButtonPrimary
									isReactNodeContent
									onPress={onRemoveWebsiteThree}
									designVariation='ghost'
									buttonStyles='absolute right-0 top-0 bottom-0 flex items-center justify-center'
								>
									<CloseIcon color='#FFF' />
								</ButtonPrimary>
							}
						/>
					</View>
				)}
				{numberExtraWebsiteFields < 2 && (
					<View className={`flex-row justify-end`}>
						<ButtonPrimary
							designVariation='ghost'
							onPress={handleExtraWebsiteAddition}
						>
							{i18nInstance.t('addLink')}
						</ButtonPrimary>
					</View>
				)}
				{numberExtraWebsiteFields === 2 && (
					<View className={`flex-row justify-end`}>
						<ButtonPrimary
							designVariation='ghost'
							onPress={onClearAllWebsiteFields}
						>
							{i18nInstance.t('clearAll')}
						</ButtonPrimary>
					</View>
				)}
				<InputForm
					name='biography'
					control={control}
					label={i18nInstance.t('biography')}
					containerStyles={inputCustomStyles}
					multiline={true}
					numberOfLines={5}
					inputStyles={'h-[90px] pt-2'}
				/>
				<ButtonPrimary
					designVariation='ghost'
					buttonStyles=' mr-auto p-0 mb-10 mt-2'
					textStyles='text-red-500'
					onPress={() => {
						setShowDeleteProfileModal(true);
					}}
				>
					{i18nInstance.t('deleteAccount')}
				</ButtonPrimary>
			</KeyboardAwareScrollView>
			<View className={`${hideFormStyles} flex flex-row justify-between`}>
				<ButtonPrimary
					buttonStyles='w-[47%]'
					designVariation='white-transparent'
					onPress={onCancel}
				>
					{i18nInstance.t('back')}
				</ButtonPrimary>
				<ButtonPrimary
					onPress={handleSubmit(onSubmit)}
					buttonStyles='w-[47%]'
					testID='button-update-profile'
					designVariation='green'
				>
					{i18nInstance.t('submit')}
				</ButtonPrimary>
			</View>
		</>
	);
};

export default ProfileFormEdit;
