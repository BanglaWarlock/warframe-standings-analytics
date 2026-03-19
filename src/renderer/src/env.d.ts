/// <reference types="vite/client" />
interface Window {
  api: {
    fetchItemPrice: (itemSlug: string) => Promise<unknown[]>
    fetchItemOrders: (itemSlug: string) => Promise<unknown[]>
  }
}