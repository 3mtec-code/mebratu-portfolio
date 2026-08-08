import { makeStoreCrud } from '@/lib/makeStoreCrud'
const crud = makeStoreCrud('blogPosts')
export const GET = crud.GET
export const POST = crud.POST
