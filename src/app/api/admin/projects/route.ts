import { makeStoreCrud } from '@/lib/makeStoreCrud'
const crud = makeStoreCrud('projects')
export const GET = crud.GET
export const POST = crud.POST
