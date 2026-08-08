import { makeStoreCrud } from '@/lib/makeStoreCrud'
const crud = makeStoreCrud('navLinks')
export const GET = crud.GET
export const POST = crud.POST
