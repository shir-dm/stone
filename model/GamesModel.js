import { BaseModel } from 'startupjs/orm'
import { GAME_STATUS } from 'helpers/constants'

export default class GamesModel extends BaseModel {
  async addNew (name, professor) {
    console.log('professor', professor)
    const createdAt = Date.now()
    const id = await this.add({
      name,
      firstUser: null,
      secondUser: null,
      professor,
      createdAt,
      status: GAME_STATUS.WAITING_PLAYERS,
      history: [{}]
    })
    return id
  }
}
