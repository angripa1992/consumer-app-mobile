import { useState } from 'react';
import Link from '@/UI/atoms/link/Link';
import TextElement from '@/UI/atoms/text/TextElement';
import { TypeOrderFromSpot } from '@/lib/types/spot';
import { View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import Spinner from '@/UI/atoms/spinner/Spinner';
import CustomBottomSheetModal from '../modal/CustomBottonSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

interface SpotOrdersProps {
	orders?: TypeOrderFromSpot[];
	ordersModalRef: React.RefObject<BottomSheetModal>;
}

const SpotOrders = ({ orders, ordersModalRef }: SpotOrdersProps) => {
	const [isIconReady, setIsIconReady] = useState(false);
	const hasOrders = !!orders && orders.length > 0;

	const isThereOrdersWithUrlMobile =
		hasOrders && orders.some((order) => order.url_mobile);

	const ordersSorted = hasOrders
		? orders?.sort((a, b) => {
				if (a.name === 'Klikit') return -1;
				if (b.name === 'Klikit') return 1;
				return 0;
			})
		: [];

	return (
		<CustomBottomSheetModal
			bottomSheetModalRef={ordersModalRef}
			snapPoints={['40%']}
		>
			<TextElement textStyles='text-white mb-4 text-base'>
				Select Delivery
			</TextElement>

			<View
				style={{
					gap: 10,
				}}
				className='flex mt-1 flex-wrap flex-row items-center '
			>
				{isThereOrdersWithUrlMobile ? (
					ordersSorted.map((order) => {
						const { color, name, icon, url_mobile, id } = order;

						const urlMobile = url_mobile;
						const backgroundColor = `${color}1a`;

						return (
							<Link key={id} url={urlMobile} linkStyles='flex-[0_0_31.4%]'>
								<View
									className='flex flex-row py-[5px] px-1 items-center justify-center border rounded-full'
									style={{ backgroundColor, borderColor: color, gap: 8 }}
								>
									{icon && (
										<>
											<SvgUri
												width={14}
												height={14}
												uri={icon}
												onLoad={() => {
													setIsIconReady(true);
												}}
												className={`${isIconReady ? '' : 'hidden'}`}
											/>
											<Spinner
												width={14}
												height={14}
												isFullPage={false}
												containerStyles={`w-[14px] ${
													isIconReady ? 'hidden' : ''
												}`}
											/>
										</>
									)}
									<TextElement textStyles='text-light-white  text-xs'>
										{name}
									</TextElement>
								</View>
							</Link>
						);
					})
				) : (
					<TextElement textStyles='text-white text- mx-auto'>
						There are no delivery options currently available.
					</TextElement>
				)}
			</View>
		</CustomBottomSheetModal>
	);
};

export default SpotOrders;
