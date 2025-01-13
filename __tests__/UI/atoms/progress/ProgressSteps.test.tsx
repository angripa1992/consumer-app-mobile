import { render, screen, userEvent } from '@testing-library/react-native';
import ProgressSteps from '@/UI/atoms/progress/ProgressSteps';

test('ProgressSteps renders correctly', () => {
	render(<ProgressSteps currentStep={1} totalSteps={4} />);
	const progressStep = screen.getByTestId('progress-step-1-active');
	expect(progressStep).toBeTruthy();
});

test('ProgressSteps renders correctly with custom styles', () => {
	render(
		<ProgressSteps
			currentStep={1}
			totalSteps={4}
			containerStyles='bg-red-500'
		/>,
	);
	const progressStep = screen.getByTestId('progress-step-1-active');
	expect(progressStep).toBeTruthy();
});

test('ProgressSteps renders correctly with different number of steps', () => {
	render(<ProgressSteps currentStep={0} totalSteps={3} />);
	const progressStep = screen.getByTestId('progress-step-0-active');
	const progressStep2 = screen.getByTestId('progress-step-1-inactive');
	const progressStep3 = screen.getByTestId('progress-step-2-inactive');

	expect(progressStep).toBeTruthy();
	expect(progressStep2).toBeTruthy();
	expect(progressStep3).toBeTruthy();
});
