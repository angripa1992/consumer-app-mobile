import React from 'react';
import { View } from 'react-native';
import TextElement from '../text/TextElement';

interface ProgressStepsProps {
	currentStep: number;
	totalSteps: number;
	containerStyles?: string;
}

const ProgressSteps = ({
	currentStep,
	totalSteps,
	containerStyles = '',
}: ProgressStepsProps) => {
	return (
		<View className={`flex-row justify-between relative ${containerStyles}`}>
			<View className='bg-light-white w-full h-[1px] absolute left-0 top-1/2 -translate-y-1/2' />
			{Array.from({ length: totalSteps }).map((_, index) => {
				const paddingForFirstStep = index === 0 ? 'pr-5' : '';
				const paddingForLastStep = index === totalSteps - 1 ? 'pl-5' : '';
				const paddingForCommonSteps =
					index !== 0 && index !== totalSteps - 1 ? 'px-5' : '';

				const isCurrentStep = currentStep === index;

				return (
					<View
						className={`bg-dark-black ${paddingForFirstStep} ${paddingForLastStep} ${paddingForCommonSteps}`}
						testID={`progress-step-${index}-${isCurrentStep ? 'active' : 'inactive'}`}
						key={index}
					>
						<View
							className={` px-4 py-3 rounded-full ${isCurrentStep ? 'bg-admin-gray' : 'bg-gray'}`}
							key={index}
						>
							<TextElement textStyles='text-light-white'>
								{index + 1}
							</TextElement>
						</View>
					</View>
				);
			})}
		</View>
	);
};

export default ProgressSteps;
