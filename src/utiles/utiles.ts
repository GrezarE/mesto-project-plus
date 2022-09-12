/* eslint-disable no-useless-escape */

import { BadRequestError } from '../errors/index';

export const checkUrl = (url: string) => {
  if (
    /^(https?:\/\/)(www\.)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/.test(
      url,
    )
  ) {
    return url;
  }
  const err = new BadRequestError('Url не прошел валидацию');
  return err;
};

export const checkId = (id: string) => {
  if (/^[a-f0-9]{24}$/.test(id)) {
    return id;
  }
  const err = new BadRequestError('Id не прошел валидацию');
  return err;
};
