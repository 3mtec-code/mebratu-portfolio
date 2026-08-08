import { makeStoreCrud } from '@/lib/makeStoreCrud'
const crud = makeStoreCrud('infoCards')
export const GET = crud.GET
export const POST = crud.POST
