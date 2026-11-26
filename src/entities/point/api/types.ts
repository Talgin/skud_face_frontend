export type PointDto = {
  id: number;
  name: string;
  address: string;
  camera_id: number;
};

type RequestBody = Omit<PointDto, "id"> & {
  /** required for super admins; the backend uses the admin's own organization otherwise */
  organization_id?: number;
};

export type CreatePointRequestBody = RequestBody;

export type UpdatePointRequestBody = RequestBody;
