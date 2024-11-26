import type { OrganizationDto } from '../api/types';
import type { Organization } from '../model/types';

export function mapOrganization(dto: OrganizationDto): Organization {
	return {
		id: dto.id,
		organizationName: dto.name,
		ceoName: dto.ceo_name,
		address: dto.address,
		phoneNumber: dto.phone,
	};
}
