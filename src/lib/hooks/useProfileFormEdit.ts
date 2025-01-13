import { useForm } from 'react-hook-form';
import { Dispatch, useEffect, useMemo, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import * as Linking from 'expo-linking';

import { zodResolver } from '@hookform/resolvers/zod';
import { useGetCountries } from '@/lib/hooks/useQueryCountries';
import { useAppStore } from '@/lib/store/store';
import { useGetUser } from '@/lib/hooks/useQueryUser';
import { putUserValidationsSchema } from '@/lib/schemas/user';
import { useGetAllTarotCodes } from '@/lib/hooks/useQueryTarot';
import { locationFilterValidationSchema } from '../schemas/discovery';

import type { TypeEditProfileTab, TypeProfileForm } from '@/lib/types/profile';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

const useProfileFormEdit = (
	isUsernameRepeated: boolean,
	setIsUsernameRepeated: Dispatch<React.SetStateAction<boolean>>,
) => {
	const { user: userStored } = useAppStore(
		useShallow((state) => ({
			user: state.user,
		})),
	);

	const { allTarotCodes } = useGetAllTarotCodes();

	const tarotQRModalRef = useRef<BottomSheetModal>(null);

	const [currentEditProfileTab, setCurrentEditProfileTab] =
		useState<TypeEditProfileTab>('profile');

	const { user } = useGetUser(Number(userStored?.id));
	const { countries } = useGetCountries();

	const profileInitialValues = {
		username: user?.username,
		name: user?.name,
		city: user?.city,
		websiteOne: user?.website_user[0]?.url,
		websiteTwo: user?.website_user[1]?.url,
		websiteThree: user?.website_user[2]?.url,
		biography: user?.biography,
		tarot: user?.tarot_code,
	};

	const {
		control,
		watch,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<TypeProfileForm>({
		resolver: zodResolver(putUserValidationsSchema),
		defaultValues: profileInitialValues,
	});

	const {
		control: controlCity,
		setValue: setValueCity,
		watch: watchCity,
		reset: resetCity,
	} = useForm({
		defaultValues: {
			city: '',
		},
		resolver: zodResolver(locationFilterValidationSchema),
	});

	const [cityChosen, setCityChosen] = useState(user?.city ?? '');

	const inputCustomStyles = 'mb-4';
	const countryNames = countries?.map((country) => country.name);
	const cityValue = watch('city');
	const usernameValue = watch('username');
	const tarotValue = watch('tarot');
	const websiteThreeValue = watch('websiteThree');
	const hasTarotCode = !!userStored?.tarot_code;

	const partialTarotCode = allTarotCodes?.find(
		(tarotCode) => tarotCode.code === tarotValue,
	);

	const tarotCodeNames = useMemo(
		() =>
			allTarotCodes?.map((tarotCode) => {
				return {
					label: `${tarotCode.name} (${tarotCode.code})`,
					value: tarotCode.code,
				};
			}) ?? [],
		[allTarotCodes],
	);

	const userHasAllExtraWebsiteFields =
		user?.website_user[1]?.url && user?.website_user[2]?.url;
	const useHasOneExtraWebsiteField =
		user?.website_user[1]?.url && !user?.website_user[2]?.url;

	const initialNumberExtraWebsiteFields = useMemo(() => {
		if (userHasAllExtraWebsiteFields) {
			return 2;
		}

		if (useHasOneExtraWebsiteField) {
			return 1;
		}

		return 0;
	}, []);

	const [numberExtraWebsiteFields, setNumberExtraWebsiteFields] = useState(
		initialNumberExtraWebsiteFields,
	);

	const handleExtraWebsiteAddition = () => {
		if (numberExtraWebsiteFields < 3) {
			setNumberExtraWebsiteFields(numberExtraWebsiteFields + 1);
		}
	};

	const onRemoveWebsiteTwo = () => {
		if (numberExtraWebsiteFields > 1) {
			setValue('websiteTwo', websiteThreeValue);
			setValue('websiteThree', '');
			setNumberExtraWebsiteFields(1);
			return;
		}

		setValue('websiteTwo', '');
		setNumberExtraWebsiteFields(0);
	};

	const onRemoveWebsiteThree = () => {
		setValue('websiteThree', '');
		setNumberExtraWebsiteFields(1);
	};

	const onClearAllWebsiteFields = () => {
		setValue('websiteTwo', '');
		setValue('websiteThree', '');

		setNumberExtraWebsiteFields(0);
	};

	const onRedirectToTarotWebsite = async () => {
		await Linking.openURL('https://klikit.io/consumer/taste-test/foodies');
	};

	const handleOpenQRModal = () => {
		tarotQRModalRef.current?.present();
	};

	const handleCloseQRModal = () => {
		setCurrentEditProfileTab('profile');
	};

	useEffect(() => {
		if (isUsernameRepeated) {
			setIsUsernameRepeated(false);
		}
	}, [usernameValue]);

	useEffect(() => {
		if (currentEditProfileTab === 'qr-card') {
			handleOpenQRModal();
		}
	}, [currentEditProfileTab]);

	useEffect(() => {
		setValue('city', cityChosen !== 'Select Option' ? cityChosen : '');
	}, [cityChosen]);

	return {
		userId: user?.id,
		tarotQRModalRef,
		control,
		errors,
		countryNames,
		inputCustomStyles,
		numberExtraWebsiteFields,
		cityValue,
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
	};
};

export default useProfileFormEdit;
