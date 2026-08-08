import { makeStoreCrud } from '@/lib/makeStoreCrud'
const crud = makeStoreCrud('blogPosts')
export const PATCH = crud.PATCH
export const DELETE = crud.DELETE
