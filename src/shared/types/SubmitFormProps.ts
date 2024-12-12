export type SubmitFormProps<FormValues extends Record<string, unknown>> = {
	onSubmit: (values: FormValues) => void;
	isSuccess: boolean;
	defaultValues?: FormValues;
	isEditing?: boolean;
};
