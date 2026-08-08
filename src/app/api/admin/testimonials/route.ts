import { makeStoreCrud } from '@/lib/makeStoreCrud'
const crud = makeStoreCrud('testimonials')
export const GET = crud.GET
export const POST = crud.POST
