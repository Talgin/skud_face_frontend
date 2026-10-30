export type UserDto = {
  id: number;
  name: string;
  surname: string;
  card_id: string;
  active: true;
  gender: "male" | "female";
  birth_date: string;
  photo_path: string;
  face_photo_url?: string | null;
};

export enum AddBatchUsersParams {
  EXCEL_FILE = "excel_file",
  PHOTOS = "photos",
}

export type UserQueryParams = Partial<
  Omit<UserDto, "active" | "photo_path" | "face_photo_url" | "id">
>;
