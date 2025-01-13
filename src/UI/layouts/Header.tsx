import { ReactNode } from 'react';
import { View } from 'react-native';
import Constants from 'expo-constants';
import KlikitLogo from '../assets/svg/KlikitLogo';

type HeaderProps = {
	children?: ReactNode;
	headerStyles?: string;
	headerContainerStyles?: string;
	showDefaultHeader?: boolean;
};

const Header = ({
	children,
	headerStyles,
	headerContainerStyles = 'bg-dark-gray',
	showDefaultHeader = true,
}: HeaderProps) => {
	return (
		<View
			className={`w-full z-10 ${headerContainerStyles ?? ''}`}
			style={{ paddingTop: Constants.statusBarHeight }}
		>
			<View
				className={`w-full h-14 flex-row items-center pl-[5%] pr-[5%] bg-dark-gray ${headerStyles}`}
			>
				{showDefaultHeader ? <KlikitLogo /> : <>{children}</>}
			</View>
		</View>
	);
};

export default Header;
