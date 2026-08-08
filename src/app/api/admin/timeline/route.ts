import { makeStoreCrud } from '@/lib/makeStoreCrud'
const crud = makeStoreCrud('timeline')
export const GET = crud.GET
export const POST = crud.POST
