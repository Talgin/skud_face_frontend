export type OrganizationDto = {
	id: number;
	name: string;
	ceo_name: string;
	address: string;
	phone: string;
};

export type RequestOrganizationBody = Omit<OrganizationDto, 'id'>;
