import { makeStoreCrud } from '@/lib/makeStoreCrud'
const crud = makeStoreCrud('awards')
export const GET = crud.GET
export const POST = crud.POST
