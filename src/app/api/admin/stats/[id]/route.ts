import { makeStoreCrud } from '@/lib/makeStoreCrud'
const crud = makeStoreCrud('heroStats')
export const PATCH = crud.PATCH
export const DELETE = crud.DELETE
