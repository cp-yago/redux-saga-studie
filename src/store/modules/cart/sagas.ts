import { all, call, select, takeLatest, put } from 'redux-saga/effects'
import { AxiosResponse } from 'axios';
import { IState } from '../..';
import api from '../../../services/api';
import { addProductToCartRequest, addProductToCartSuccess, addProductToCartFailure } from './actions';
import { ActionTypes } from './types';

type CheckProductStockRequest = ReturnType<typeof addProductToCartRequest>;

interface IStockResponse {
  id: number;
  quantity: number;
}

function* checkProductStock({ payload }: CheckProductStockRequest) {
  const { product } = payload;
  
  const currentQuantity: number = yield select((state: IState) => {
    return state.cart.items.find(item => item.product.id === product.id)?.quantity ?? 0;
  });

  const availableStockResponse: AxiosResponse<IStockResponse> = yield call(api.get, `stock/${product.id}`);

  if (availableStockResponse.data.quantity > currentQuantity) {
    console.log('Deu bom');
    yield put(addProductToCartSuccess(product));
  } else {
    console.log('Deu ruim');
    yield put(addProductToCartFailure(product.id));
  }
  
  console.log(currentQuantity);

  console.log('Adicionou ao carinho');
}

export default all([
  takeLatest(ActionTypes.addProductToCartRequest, checkProductStock)
]);