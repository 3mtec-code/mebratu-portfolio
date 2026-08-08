import { makeStoreCrud } from '@/lib/makeStoreCrud'
const crud = makeStoreCrud('skills')
export const GET = crud.GET
export const POST = crud.POST
