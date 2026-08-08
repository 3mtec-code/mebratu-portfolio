import { makeStoreCrud } from '@/lib/makeStoreCrud'
const crud = makeStoreCrud('videos')
export const GET = crud.GET
export const POST = crud.POST
