export type SessionDto = {
	readonly access_token: string;
	readonly refresh_token: string;
};

export type RequestLoginBody = {
	readonly username: Email;
	readonly password: string;
};
