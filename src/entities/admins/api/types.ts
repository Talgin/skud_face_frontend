export type RoleType = 'admin' | 'operator' | 'registrar' | 'super_admin';

export type AdminDto = {
	id: number;
	name: string;
	surname: string;
	card_id: string;
	role: RoleType;
};

type AdminCredentials = {
	username: string;
	password: string;
};

type RequestBody = Omit<AdminDto, 'id'> & AdminCredentials;

export type CreateAdminRequestBody = RequestBody;

export type UpdateAdminRequestBody = {
	id: number;
	newAdmin: RequestBody;
};
