import { makeStoreCrud } from '@/lib/makeStoreCrud'
const crud = makeStoreCrud('skills')
export const PATCH = crud.PATCH
export const DELETE = crud.DELETE
