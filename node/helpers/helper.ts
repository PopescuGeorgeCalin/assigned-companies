import {Apps} from "@vtex/api";
import axios from "axios";

export const getSettings = async (ctx: any) => {
  const apps = new Apps(ctx.vtex);
  return await apps.getAppSettings(ctx.vtex.userAgent)
};

export const getAssignedCompanies = async (ctx: any, settings: any, email: string) => {
  const fields = [
    ...settings.fields,
    ...settings.urlFields.map((field: any) => field.name),
  ];
  const {clients: {masterdata}} = ctx;
  return masterdata.searchDocuments({
    dataEntity: settings.dataentityName,
    fields: fields,
    where: `email=\"${email}\"`,
    pagination: {
      page: 1,
      pageSize: 1000 // TODO: use backend pagination instead of the current approach
    },
  });
};

export const getAssignedCompaniesSchemaV2 = async (ctx: any, settings: any) => {
  const {clients: {masterdata}} = ctx;
  return masterdata.getSchema({ dataEntity: settings.dataentityName, schema: '' } );
};

export const getAssignedCompaniesSchemaV1 = async (ctx: any, settings: any) => {
  return (await axios({
    url: `https://${ctx.vtex.account}.vtexcommercestable.com.br/api/dataentities/${settings.dataentityName}`,
    method: 'get',
  })).data;
};

export const formatRequestError = (error: any) => {
  if (error.response) {
    /*
     * The request was made and the server responded with a
     * status code that falls out of the range of 2xx
     */
    return `Failed with status: ${error.response.status}; data: ${JSON.stringify(error.response.data)}; headers: ${JSON.stringify(error.response.headers)}`;
  } else {
    // Something happened in setting up the request and triggered an Error
    return `Failed with message: ${error.message}`;
  }
};
