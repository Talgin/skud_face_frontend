export type PointDto = {
	id: number;
	organization_id: number;
	name: string;
	address: string;
	camera_id: number;
};

type RequestBody = Pick<PointDto, 'name' | 'address' | 'camera_id' | 'organization_id'>;

export type CreatePointRequestBody = RequestBody;

export type UpdatePointRequestBody = RequestBody;
