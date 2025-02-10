import React from "react";
import { View } from "react-native";
import { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import { i18nInstance } from 'config/i18n';
import TextElement from "@/UI/atoms/text/TextElement";
import ButtonPrimary from "@/UI/atoms/button/ButtonPrimary";
import CloseIcon from "@/UI/assets/svg/CloseIcon";
import InputForm from "@/UI/atoms/input/InputForm";
import SearchIcon from "@/UI/assets/svg/SearchIcon";

type TypeSearchInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  searchQueryValue: string;
  clearInput: () => void;
  showCustomError?: boolean;
  customErrorText?: string;
  testID?: string;
  containerStyles?: string;
  placeholder?: string;
};

const FriendSearchInput = <T extends FieldValues>({
  control,
  name,
  searchQueryValue,
  clearInput,
  showCustomError,
  customErrorText,
  testID,
  containerStyles,
  placeholder = "Search for friends...",
}: TypeSearchInputProps<T>) => {
  
  return (
    <View className={containerStyles}>
      <View className="relative">
        <View className="absolute z-10 left-3 top-3 -translate-y-1/2">
          <SearchIcon color="#858585" />
        </View>
        <InputForm
          control={control}
					name={name}
          placeholder={(placeholder)}
          placeholderTextColor="#666666"
          inputStyles="text-light-white pl-12 pr-10 border-[#F4F5F70F]"
          testID={testID}
        />
        {searchQueryValue.length > 0 && (
					<ButtonPrimary
						isReactNodeContent
						onPress={clearInput}
						designVariation='ghost'
						buttonStyles='absolute z-20 bottom-0 right-0 top-0 w-[40px] flex items-center justify-center'
					>
						<CloseIcon color='#FFF' />
					</ButtonPrimary>
				)}
      </View>
      {showCustomError && (
        <View className="mt-3 flex-row items-center">
          <TextElement className="text-red-500">{customErrorText}</TextElement>
        </View>
      )}
    </View>
  );
};

export default FriendSearchInput;
