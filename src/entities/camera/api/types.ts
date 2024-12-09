export type CameraDto = {
	id: number;
	serial_number: string;
	brand_name: string;
	camera_model_name: string;
	registration_date: string;
	is_activated: boolean;
	url: string;
	point_id: number;
};

type RequestBody = Omit<CameraDto, 'id'>;

export type CreateRequestCameraBody = RequestBody;

export type UpdateRequestCameraBody = {
	id: number;
	newCamera: RequestBody;
};
