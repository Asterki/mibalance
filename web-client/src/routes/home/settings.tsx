import { createFileRoute } from '@tanstack/react-router'
// import { useEffect, useState } from "react";

import { useTranslation } from 'react-i18next'

import { useSelector } from 'react-redux'
import type { RootState } from '../../store'

import HomeLayout from '../../layouts/HomeLayout'
import { FaCog } from 'react-icons/fa'

import { Button, Typography } from 'antd'
const { Title, Text } = Typography

export const Route = createFileRoute('/home/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  // const _navigate = useNavigate();
  // const _dispatch = useDispatch<typeof import("../../store").store.dispatch>();
  const { account } = useSelector((state: RootState) => state.auth)

  const { t } = useTranslation(['main'])

  return (
    <HomeLayout selectedPage="settings">
      <div className="mb-2">
        {t('dashboard:common.loggedInAs', {
          name: account?.profile.name,
          email: account?.email.value,
        })}
      </div>

      <Title level={1} className="flex items-center gap-2">
        <FaCog />
        {t('dashboard:settings.page.title')}
      </Title>

      <Text>{t('dashboard:settings.page.description')}</Text>
    </HomeLayout>
  )
}
