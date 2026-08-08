import { makeStoreCrud } from '@/lib/makeStoreCrud'
const crud = makeStoreCrud('services')
export const PATCH = crud.PATCH
export const DELETE = crud.DELETE
