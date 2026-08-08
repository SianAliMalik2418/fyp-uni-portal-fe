import { Toast as ToastPrimitive } from '@base-ui/react/toast'

const toast = ToastPrimitive.createToastManager()
const createToastManager = ToastPrimitive.createToastManager
const useToastManager = ToastPrimitive.useToastManager

export { createToastManager, toast, useToastManager }
