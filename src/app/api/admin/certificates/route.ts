import { makeStoreCrud } from '@/lib/makeStoreCrud'
const crud = makeStoreCrud('certificates')
export const GET = crud.GET
export const POST = crud.POST
