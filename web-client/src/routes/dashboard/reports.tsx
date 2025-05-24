import { createFileRoute } from '@tanstack/react-router'
// import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { useSelector } from 'react-redux'
import type { RootState } from '../../store'

import AdminPageLayout from '../../layouts/AdminLayout'
import { FaBox } from 'react-icons/fa'

export const Route = createFileRoute('/dashboard/reports')({
  component: RouteComponent,
})

function RouteComponent() {
  // const navigate = useNavigate()
  // const dispatch = useDispatch<typeof import('../../store').store.dispatch>()
  const { account } = useSelector((state: RootState) => state.auth)

  const { t } = useTranslation(['main'])

  return (
    <AdminPageLayout>
      <div className="mb-2">
        {t('dashboard:common.loggedInAs', {
          name: account?.profile.name,
          email: account?.email.value,
        })}
      </div>

      <h1 className="font-bold text-2xl flex items-center gap-2">
        <FaBox />
        {t('page.title')}
      </h1>
    </AdminPageLayout>
  )
}
