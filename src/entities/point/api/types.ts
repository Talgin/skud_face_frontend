export type PointDto = {
	id: number;
	name: string;
	address: string;
	camera_id: number;
};

type RequestBody = Omit<PointDto, 'id'>;

export type CreatePointRequestBody = RequestBody;

export type UpdatePointRequestBody = RequestBody;
