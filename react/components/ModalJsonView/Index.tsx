/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React from 'react'
import { Modal, Box } from 'vtex.styleguide'
import { JsonEditor } from 'json-edit-react'

import style from './index.css'

type ModalJsonViewProps = {
  isOpen: boolean
  onClose: () => void
  jsonData?: Record<string, any>
  msg?: string
}

export const ModalJsonView = ({
  onClose,
  isOpen,
  jsonData,
  msg,
}: ModalJsonViewProps) => {
  return (
    <Modal centered isOpen={isOpen} onClose={onClose}>
      <div className={style['modal-json-body']}>
        {msg && (
          <Box title="Message">
            <p>{msg}</p>
          </Box>
        )}
        {jsonData && (
          <Box title="Object">
            <JsonEditor
              data={jsonData}
              collapse={1}
              enableClipboard
              restrictAdd
              restrictDelete
              restrictEdit
            />
          </Box>
        )}
      </div>
    </Modal>
  )
}
