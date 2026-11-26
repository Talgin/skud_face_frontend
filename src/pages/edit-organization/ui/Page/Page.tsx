import { useParams } from "@tanstack/react-router";
import {
  useOrganizationQuery,
  useUpdateOrganizationMutation,
} from "@/entities/organization";
import {
  type OrganizationValues,
  SubmitOrganizationForm,
} from "@/features/organizations/submitForm";
import { t } from "@/shared/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ServerError } from "@/shared/ui/server-error";

const successMessage = t("Организация успешно обновлена!");

export function EditOrganizationPage() {
  const [updateOrganization, { isLoading, isSuccess, error }] =
    useUpdateOrganizationMutation();
  const { id } = useParams({ strict: false });
  const { data: organization, isSuccess: isOrganizationSuccess } =
    useOrganizationQuery(parseInt(id ?? ""));

  function onSubmit(values: OrganizationValues) {
    if (id) {
      updateOrganization({
        id: parseInt(id),
        newOrganization: {
          name: values.organizationName,
          ceo_name: values.ceoName,
          address: values.address,
          phone: values.phoneNumber,
        },
      });
    }
  }
  return (
    <div className="container flex justify-center pt-16">
      <Card className="xl:w-6/12 w-full">
        <CardHeader>
          <CardTitle>{t("Изменить организацию")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isOrganizationSuccess && (
            <SubmitOrganizationForm
              onSubmit={onSubmit}
              isLoading={isLoading}
              isSuccess={isSuccess}
              successMessage={successMessage}
              defaultValues={organization}
              isEditing={true}
            />
          )}
          <ServerError error={error} />
        </CardContent>
      </Card>
    </div>
  );
}
