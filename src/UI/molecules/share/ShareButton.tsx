import ShareIcon from '@/UI/assets/svg/ShareIcon';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';

import type { ReactNode } from 'react';
import type { TypeButtonPrimaryDesignVariations } from '@/lib/types/atoms';
import type { TypeShareEntity } from '@/lib/types/app';
import { onPressShare } from '@/lib/helpers/shareHelpers';

interface ShareButtonProps {
	id?: number;
	type: TypeShareEntity;
	showText?: boolean;
	testID?: string;
	customButtonContent?: ReactNode;
	buttonDesignVariation?: TypeButtonPrimaryDesignVariations;
	buttonStyles?: string;
	color?: string;
}

const ShareButton = ({
	id,
	type,
	showText = true,
	testID = 'spot-share-button',
	customButtonContent,
	buttonDesignVariation = 'ghost',
	buttonStyles,
	color = 'white',
}: ShareButtonProps) => {
	const onPressShareButton = async () => {
		await onPressShare(type, id);
	};

	return (
		<ButtonPrimary
			buttonStyles={`p-0 border-none ${
				showText
					? '  rounded-none flex flex-col justify-center items-center'
					: ''
			} ${buttonStyles ?? ''}`}
			designVariation={buttonDesignVariation}
			nodeContentStyles={`flex  justify-center items-center ${
				showText ? 'flex-col' : 'flex-row'
			}`}
			isReactNodeContent
			onPress={onPressShareButton}
			testID={testID}
		>
			{!!customButtonContent ? (
				customButtonContent
			) : (
				<ShareIcon width={25} height={25} color={color} />
			)}
		</ButtonPrimary>
	);
};

export default ShareButton;
