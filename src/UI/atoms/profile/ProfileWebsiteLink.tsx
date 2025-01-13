import Link from '../link/Link';
import TextElement from '../text/TextElement';

import LinkIcon from '@/svg/LinkIcon';

interface WebsiteUser {
	name: string;
	url: string | null;
}

const ProfileWebsiteLink = ({ name, url }: WebsiteUser) => {
	if (!url) return null;

	return (
		<Link linkStyles='  flex flex-row items-center py-[2px] mb-1' url={url}>
			<LinkIcon />
			<TextElement textStyles='text-white text-xs ml-1 underline'>
				{url}
			</TextElement>
		</Link>
	);
};

export default ProfileWebsiteLink;
