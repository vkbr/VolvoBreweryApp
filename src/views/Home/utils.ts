import { getBeer, getRandomBeerList } from '../../api';
import { Beer } from '../../types';
import handle from '../../utils/error';

const fetchData = async (
  forceNoCacheKey: string | undefined,
): Promise<Array<Beer> | undefined> => {
  try {
    const { data } = await getRandomBeerList(10, forceNoCacheKey);
    return data;
  } catch (error) {
    handle(error);
  }
};

const fetchBeerListById = async (beerIds: string[]) => {
  try {
    await new Promise((res) => setTimeout(res, 1000));
    return await Promise.all(
      beerIds.map((id) => getBeer(id).then((res) => res.data)),
    );
  } catch (error) {
    handle(error);
  }
};

export { fetchBeerListById, fetchData };
