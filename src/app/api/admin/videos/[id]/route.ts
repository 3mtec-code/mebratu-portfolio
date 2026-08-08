import { makeStoreCrud } from '@/lib/makeStoreCrud'
const crud = makeStoreCrud('videos')
export const PATCH = crud.PATCH
export const DELETE = crud.DELETE
