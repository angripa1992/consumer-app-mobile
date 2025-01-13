import { useState } from 'react';

import ProfileMyLists from './categories/ProfileMyLists';
import ProfileFilterTabs from './filter/ProfileFilterTabs';

import type { TypeProfileListFilterValue } from '@/lib/types/profile';
import type { ReactNode } from 'react';

interface ProfileContentProps {
	userId: number;
	profileHeader: ReactNode;
	currentCity: string;
	isBlock?: boolean;
	isAuthenticateUser: boolean;
}

const ProfileContent = ({
	userId,
	profileHeader,
	currentCity,
	isBlock,
	isAuthenticateUser,
}: ProfileContentProps) => {
	const [currentListFilter, setCurrentListFilter] =
		useState<TypeProfileListFilterValue>('list');

	const renderListsHeader = () => {
		return (
			<>
				{profileHeader}
				<ProfileFilterTabs
					currentFilter={currentListFilter}
					setCurrentFilter={setCurrentListFilter}
					isAuthenticateUser={isAuthenticateUser}
				/>
			</>
		);
	};

	if (isBlock) {
		return profileHeader;
	}

	return (
		<ProfileMyLists
			userId={userId}
			headerFlatList={renderListsHeader()}
			currentFilter={currentListFilter}
			currentCity={currentCity}
		/>
	);
};

export default ProfileContent;
