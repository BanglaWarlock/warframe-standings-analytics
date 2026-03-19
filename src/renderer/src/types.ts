export interface BuyOrder {
  platinum: number
  rank: number | string
  user: {
    ingameName: string
    status: string
    reputation: number
  }
}

export interface ItemData {
  [itemName: string]: BuyOrder[]
}

export type LoadingState = 'idle' | 'loading' | 'done' | 'cancelled'