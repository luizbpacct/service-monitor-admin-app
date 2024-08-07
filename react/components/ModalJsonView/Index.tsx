/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useState } from 'react'
import { Modal, InputButton, Box, Tag } from 'vtex.styleguide'
import { JsonEditor } from 'json-edit-react'

import style from './index.css'
import { BUTTON_COPY_CONFIG } from '../../src/utils/constants'

type ModalJsonViewProps = {
  isOpen: boolean
  onClose: () => void
  jsonData?: Record<string, any>
  msg?: string
  authType?: string[]
  title: string
}

const getColorAuthTag = (auth: string) => {
  switch (auth) {
    case 'ADMIN':
      return '#F71963'

    case 'STORE':
      return '#134CD8'

    default:
      return '#3C896D'
  }
}

export const ModalJsonView = ({
  onClose,
  isOpen,
  jsonData,
  authType,
  msg,
  title,
}: ModalJsonViewProps) => {
  const [copyText, setCopyText] = useState(BUTTON_COPY_CONFIG.defaultText)

  const copyAnimation = () => {
    setCopyText('Copied!')
    setTimeout(() => {
      setCopyText('Copy')
    }, BUTTON_COPY_CONFIG.transitionTime)
  }

  return (
    <Modal centered isOpen={isOpen} onClose={onClose} title={title}>
      <div className={style['modal-json-body']}>
        {!!authType?.length && (
          <div className={style['modal-json-auth']}>
            <span>Authentications</span>
            <div className={style['modal-json-auth-box']}>
              {authType.map((auth: string) => (
                <Tag key={auth} bgColor={getColorAuthTag(auth)}>
                  {auth}
                </Tag>
              ))}
            </div>
          </div>
        )}
        {msg && (
          <form
            onSubmit={async (e: any) => {
              e.preventDefault()
              copyAnimation()
              await navigator.clipboard.writeText(msg)
            }}
          >
            <InputButton
              size="regular"
              label="Message"
              button={copyText}
              value={msg}
              readOnly
            />
          </form>
        )}
        {jsonData && (
          <JsonEditor
            data={jsonData}
            collapse={1}
            enableClipboard
            restrictAdd
            restrictDelete
            restrictEdit
          />
        )}
      </div>
    </Modal>
  )
}
