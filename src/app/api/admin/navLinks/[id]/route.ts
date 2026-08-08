import { makeStoreCrud } from '@/lib/makeStoreCrud'
const crud = makeStoreCrud('navLinks')
export const PATCH = crud.PATCH
export const DELETE = crud.DELETE
