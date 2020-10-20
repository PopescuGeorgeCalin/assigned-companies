import {
  formatRequestError,
  getAssignedCompanies,
  getAssignedCompaniesSchemaV2,
  getSettings
} from "../helpers/helper";


export async function getAssignedCompaniesApi(ctx: any) {
  try {
    const {sessionData: {namespaces: {profile}}} = await ctx.clients.session.getSession(ctx.vtex.sessionToken, ["profile.email"]);

    if (!profile?.email?.value) {
      throw new Error("No email for the current user is defined");
    }

    const settings = await getSettings(ctx);
    const { fields = [], urlFields = []} = settings;
    const companies = await getAssignedCompanies(ctx, settings, profile?.email?.value);

    const schemaData = (await getAssignedCompaniesSchemaV2(ctx, settings))
      ?.find((schema: any) => schema.name === settings.schemaName);

    const { schema: { properties } } = schemaData;

    const schemaFromDataEntity = fields.filter((key: string) => key in properties)
    .reduce((oldObject: any, key: string) => ({
        ...oldObject,
        [key]: properties[key]
    }), {});

    const _urlFields = urlFields.reduce((oldObject: any, field: any) => {
      return {
        ...oldObject,
        [field.name]: {
          type: "url",
          title: field.title,
        }
      }
    }, {});

    ctx.response.body = {
      companies,
      schema: {
        ...schemaFromDataEntity,
        ..._urlFields,
      }
    };
    ctx.response.status = 200;
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = formatRequestError(e);
  }

  return ctx.response.body
}

