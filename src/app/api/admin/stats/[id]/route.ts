import { makeStoreCrud } from '@/lib/makeStoreCrud'

export const dynamic = 'force-dynamic'

const crud = makeStoreCrud('heroStats')
export const PATCH = crud.PATCH
export const DELETE = crud.DELETE
