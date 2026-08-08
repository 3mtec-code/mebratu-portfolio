import { makeStoreCrud } from '@/lib/makeStoreCrud'
const crud = makeStoreCrud('awards')
export const PATCH = crud.PATCH
export const DELETE = crud.DELETE
