import { makeStoreCrud } from '@/lib/makeStoreCrud'
const crud = makeStoreCrud('services')
export const GET = crud.GET
export const POST = crud.POST
