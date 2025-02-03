import type { UserDto } from '../api/types';
import type { User } from '../model/types';

export function mapUser(dto: UserDto): User {
	return {
		id: dto.id,
		name: dto.name,
		surname: dto.surname,
		cardId: dto.card_id,
		isActive: dto.active,
		gender: dto.gender,
		photoPath: dto.photo_path,
		birthDate: new Date(dto.birth_date),
	};
}
