export type UserDto = {
	id: number;
	name: string;
	surname: string;
	card_id: string;
	active: true;
	gender: 'male' | 'female';
	birth_date: string;
	photo: FileList;
};

export enum AddBatchUsersParams {
	EXCEL_FILE = 'excel_file',
	PHOTOS = 'photos',
}

export enum UserParams {
	NAME = 'name',
	SURNAME = 'surname',
	CARD_ID = 'card_id',
	ACTIVE = 'active',
	GENDER = 'gender',
	BIRTH_DATE = 'birth_date',
	PHOTO = 'photo',
}
