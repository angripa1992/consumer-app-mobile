import { render, fireEvent, screen } from '@testing-library/react-native';
import FilterTabs from '@/UI/molecules/tabs/FilterTabs';

const mockDataFilterTabs = [
	{ name: 'Tab 1', value: 'tab1' },
	{ name: 'Tab 2', value: 'tab2' },
];

describe('FilterTabs tests', () => {
	it('should renders all filter tabs correctly', () => {
		const setCurrentFilter = jest.fn();
		render(
			<FilterTabs
				dataFilterTabs={mockDataFilterTabs}
				currentFilter='tab1'
				setCurrentFilter={setCurrentFilter}
			/>,
		);

		expect(screen.getByText('Tab 1')).toBeTruthy();
		expect(screen.getByText('Tab 2')).toBeTruthy();
	});

	it('should updates current filter on button press', () => {
		const setCurrentFilter = jest.fn();
		render(
			<FilterTabs
				dataFilterTabs={mockDataFilterTabs}
				currentFilter='tab1'
				setCurrentFilter={setCurrentFilter}
			/>,
		);

		fireEvent.press(screen.getByText('Tab 2'));

		expect(setCurrentFilter).toHaveBeenCalledWith('tab2');
	});
});
