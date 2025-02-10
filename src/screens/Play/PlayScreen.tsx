import { Image } from 'expo-image';
import { View, ScrollView } from 'react-native';
import { i18nInstance } from 'config/i18n';
import TextElement from '@/UI/atoms/text/TextElement';
import HeaderFeed from '@/UI/layouts/feed/HeaderFeed';
import GreenTextureHeader from '@/UI/assets/images/textures/green-texture-header.png';
import DailyGameCard from '@/UI/atoms/card/DailyGameCard';
import CustomCarrousel from '@/UI/atoms/card/CustomCarrousel';
import MainLayout from '@/UI/layouts/MainLayout';



const PlayScreen = () => {
	return (

		<View className='relative w-full h-full'>
			<HeaderFeed />
			<Image
				source={GreenTextureHeader}
				className="absolute z-[-1] w-full top-[-220px] left-0 h-[500px]"
			/>
		
			<View className='w-[90%] max-w-[480px] mx-auto'>
				<TextElement designVariation='main-title' fontFamily='pachang'>
					{`${i18nInstance.t('play')}`}
				</TextElement>
			</View>
			<ScrollView className='flex-1 px-4'>
				<View className='flex-row justify-between items-center mt-4'>
					<TextElement className='text-white text-xl'>For You</TextElement>
					<TextElement className='text-white'>Scroll for More →</TextElement>
				</View>
				<CustomCarrousel />
				<View className='mt-6'>
					<DailyGameCard />
				</View>

			</ScrollView>

		</View>

	);
};

export default PlayScreen;
