import { makeStoreCrud } from '@/lib/makeStoreCrud'
const crud = makeStoreCrud('timeline')
export const PATCH = crud.PATCH
export const DELETE = crud.DELETE
