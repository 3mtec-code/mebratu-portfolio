import { makeStoreCrud } from '@/lib/makeStoreCrud'

export const dynamic = 'force-dynamic'

const crud = makeStoreCrud('videos')
export const PATCH = crud.PATCH
export const DELETE = crud.DELETE
