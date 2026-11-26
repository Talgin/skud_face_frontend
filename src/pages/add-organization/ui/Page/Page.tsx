import { useCreateOrganizationMutation } from "@/entities/organization";
import {
  type OrganizationValues,
  SubmitOrganizationForm,
} from "@/features/organizations/submitForm";
import { t } from "@/shared/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ServerError } from "@/shared/ui/server-error";

const successMessage = t("Организация успешно создана!");

export function AddOrganizationPage() {
  const [createOrganization, { isLoading, isSuccess, error }] =
    useCreateOrganizationMutation();

  function onSubmit(values: OrganizationValues) {
    createOrganization({
      name: values.organizationName,
      ceo_name: values.ceoName,
      address: values.address,
      phone: values.phoneNumber,
    });
  }

  return (
    <div className="container flex justify-center pt-16">
      <Card className="xl:w-6/12 w-full">
        <CardHeader>
          <CardTitle>{t("Добавить организацию")}</CardTitle>
        </CardHeader>
        <CardContent>
          <SubmitOrganizationForm
            onSubmit={onSubmit}
            isLoading={isLoading}
            isSuccess={isSuccess}
            successMessage={successMessage}
          />
          <ServerError error={error} />
        </CardContent>
      </Card>
    </div>
  );
}
