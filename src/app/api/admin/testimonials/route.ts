import { makeStoreCrud } from '@/lib/makeStoreCrud'

export const dynamic = 'force-dynamic'
const crud = makeStoreCrud('testimonials')
export const GET = crud.GET
export const POST = crud.POST

