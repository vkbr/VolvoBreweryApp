import { getBeerList, getBeerMetaData } from '../../api';
import { ApiParams, Beer, BreweriesMetaResponse } from '../../types';
import handle from '../../utils/error';

const fetchData = async (
  params?: ApiParams,
): Promise<Array<Beer> | undefined> => {
  try {
    const response = await getBeerList(params);
    return response.data;
  } catch (error) {
    handle(error);
  }
};

const fetchMatadata = async (
  params?: ApiParams,
): Promise<{ total: number }> => {
  const { data }: { data: BreweriesMetaResponse } = await getBeerMetaData(
    params,
  );

  return {
    total: parseInt(data.total, 10),
  };
};

export { fetchData, fetchMatadata };
