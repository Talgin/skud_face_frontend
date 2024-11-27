export type OrganizationDto = {
	id: number;
	name: string;
	ceo_name: string;
	address: string;
	phone: string;
};

export type CreateRequestOrganizationBody = Omit<OrganizationDto, 'id'>;

export type UpdateRequestOrganizationBody = {
	id: number;
	newOrganization: Omit<OrganizationDto, 'id'>;
};
