import type { AdminDto } from '../api/types';
import type { Admin } from '../model/types';

export function mapAdmin(dto: AdminDto): Admin {
	return {
		id: dto.id,
		name: dto.name,
		surname: dto.surname,
		cardId: dto.card_id,
		isActive: dto.active,
		role: dto.role,
	};
}
