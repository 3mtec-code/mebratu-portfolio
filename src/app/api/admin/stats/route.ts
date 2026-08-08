import { makeStoreCrud } from '@/lib/makeStoreCrud'
const crud = makeStoreCrud('heroStats')
export const GET = crud.GET
export const POST = crud.POST
