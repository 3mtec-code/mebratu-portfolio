import { makeStoreCrud } from '@/lib/makeStoreCrud'
const crud = makeStoreCrud('certificates')
export const PATCH = crud.PATCH
export const DELETE = crud.DELETE
